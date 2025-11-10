import { transformDarkColorOpt, transformLightColorOpt } from "./color";
import { getCurrentTab } from "./tabs";

const specialCharOpt = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];

export const closePopup = () => {
  chrome.extension.getViews({ type: "popup" }).forEach((v) => v.close());
};

export const getTabGroupsFormatted = (
  setTabGroups: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
) => {
  const transformOpt = window.matchMedia("(prefers-color-scheme: dark").matches
    ? transformDarkColorOpt
    : transformLightColorOpt;

  chrome.tabGroups.query({}, (tgs) => {
    if (tgs.length > 0) {
      const format = tgs.map((tg, i) => (
        <div key={`key-${tg.title}`}>
          <p
            style={{
              backgroundColor: transformOpt[tg.color].bg,
              color: transformOpt[tg.color].font,
            }}
            className="tg-chip"
          >
            {tg.title}
          </p>

          <p
            className="tg-sub-chip"
            style={{
              borderTop: `1px solid ${transformOpt[tg.color].line}`,
            }}
          >
            [Alt + {i + 1}]
          </p>
        </div>
      ));

      setTabGroups(format);
    }
  });
};

const notToCloseShortcutOptions = ["n", "f", "/", "t", "o"];

const handleKeydownEvent = (e: KeyboardEvent) => {
  return (
    sendResponse: (x?: unknown) => void,
    inputTextAreaRef: React.MutableRefObject<null>,
    setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    if (specialCharOpt.includes(e.key)) {
      sendResponse({ dataKey: e.key });
    }

    if (e.key === "†") {
      sendResponse({ newTab: true });
    }

    if (e.key === "n") {
      (inputTextAreaRef.current! as HTMLInputElement).focus();
      e.preventDefault();
      sendResponse();
    }

    if (e.key === "f") {
      setSelectedTab(2);
      e.preventDefault();
      sendResponse();
    }

    if (e.key === "/" || e.key === "t" || e.key === "o") {
      setSelectedTab(3);
      e.preventDefault();
      sendResponse();
    }

    if (!notToCloseShortcutOptions.includes(e.key)) {
      sendResponse();
      closePopup();
    }
  };
};

export const controller = new AbortController();

export const popupKeydownListener = (
  inputTextAreaRef: React.MutableRefObject<null>,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
) => {
  chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
    if (req.action === "listen_group") {
      document.addEventListener(
        "keydown",
        (e) =>
          handleKeydownEvent(e)(sendResponse, inputTextAreaRef, setSelectedTab),
        { once: true, signal: controller.signal },
      );
    }

    return true;
  });
};

export const storeNoteData = async (data: unknown) => {
  getCurrentTab(async (tab) => {
    const baseUrl = new URL(tab.url || "").origin;

    if (data || (typeof data === "string" && data !== "")) {
      await chrome.storage.local.set({ [baseUrl]: JSON.stringify(data) });
      closePopup();
    }

    if (!data) {
      await chrome.storage.local.remove([baseUrl]);
      closePopup();
    }
  });
};

export const getNoteData = (inputRef: React.MutableRefObject<null>) => {
  getCurrentTab((tab) => {
    const baseUrl = new URL(tab.url || "").origin;
    chrome.storage.local.get([baseUrl]).then((res) => {
      if (!res) return;
      if (typeof res === "object" && Object.keys(res).length === 0) return;

      (inputRef.current! as HTMLInputElement).value = JSON.parse(res[baseUrl]);
    });
  });
};
