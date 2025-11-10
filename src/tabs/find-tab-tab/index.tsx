import { useEffect, useRef, useState } from "react";
import { findTabs } from "../../helper/search";
import { changeActiveTab } from "../../helper/tabs";

export const TabFinderTab = () => {
  const [dataTabs, setDataTabs] = useState<chrome.tabs.Tab[]>([]);
  const [inputStatus, setInputStatus] = useState<number>(-1);
  const [searchType, setSearchType] = useState<"uri" | "title">("title");

  const inputRef = useRef(null);
  const inputStatusRef = useRef(inputStatus);
  const dataTabsRef = useRef(dataTabs);

  const getTabs = async (search: string = "") => {
    const tabs = await findTabs(search);
    if (!tabs) {
      return;
    }

    setDataTabs(tabs);
  };

  useEffect(() => {
    inputStatusRef.current = inputStatus;
  }, [inputStatus]);

  useEffect(() => {
    dataTabsRef.current = dataTabs;
  }, [dataTabs]);

  useEffect(() => {
    (inputRef.current! as HTMLInputElement).focus();

    getTabs();

    const rootEl = document.getElementById("root");
    rootEl!.style.width = "500px";

    const handleKeyListen = async (e: KeyboardEvent) => {
      if (e.key === "/") {
        (inputRef.current! as HTMLInputElement).focus();
        setInputStatus(-1);
        e.preventDefault();
      }

      if (e.key === "i" && e.metaKey) {
        setSearchType((prev) => (prev === "title" ? "uri" : "title"));
      }

      if ((e.key === "Enter" || e.key === " ") && inputStatusRef.current > -1) {
        const selectedTabId = dataTabsRef.current[inputStatusRef.current].id;
        const selectedWindowId =
          dataTabsRef.current[inputStatusRef.current].windowId;

        if (selectedTabId && selectedWindowId) {
          await changeActiveTab(selectedTabId, selectedWindowId);
        }
      }

      if (e.key === "k" && inputStatusRef.current > -1) {
        const prevIndex =
          inputStatusRef.current === 0
            ? dataTabsRef.current.length - 1
            : inputStatusRef.current - 1;

        setInputStatus(prevIndex);
        document.getElementById(`item-tab-found-${prevIndex}`)?.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
      }

      if (e.key === "j" && inputStatusRef.current > -1) {
        const nextIndex =
          inputStatusRef.current === dataTabsRef.current.length - 1
            ? 0
            : inputStatusRef.current + 1;

        setInputStatus(nextIndex);
        document.getElementById(`item-tab-found-${nextIndex}`)?.scrollIntoView({
          behavior: "smooth",
          inline: "nearest",
          block: "nearest",
        });
      }
    };

    document.addEventListener("keydown", handleKeyListen);
    return () => {
      document.removeEventListener("keydown", handleKeyListen);
    };
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.metaKey) {
        await getTabs(e.currentTarget.value);
        return;
      }

      await getTabs(e.currentTarget.value);
      (inputRef.current! as HTMLInputElement).blur();
      setInputStatus(0);
    }
  };

  return (
    <div style={{ padding: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <p className="title-popup-extension" style={{ marginBottom: "4px" }}>
          Find Tab
        </p>
        <div
          className=""
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "4px",
            borderRadius: "4px",
            backgroundColor: "#3a3a3a",
          }}
        >
          <span
            style={{
              padding: "1px 4px",
              fontWeight: searchType === "uri" ? "bold" : "normal",
              backgroundColor: searchType === "uri" ? "inherit" : "#131313",
              fontSize: "10px",
              borderRadius: "4px 0 0 4px",
            }}
          >
            URL
          </span>
          <span
            style={{
              padding: "1px 4px",
              fontWeight: searchType === "title" ? "bold" : "normal",
              backgroundColor: searchType === "title" ? "inherit" : "#131313",
              fontSize: "10px",
              borderRadius: "0 4px 4px 0",
            }}
          >
            Title
          </span>
        </div>
      </div>

      <div
        style={{ margin: 0, padding: 0, display: "flex", marginBottom: "8px" }}
      >
        <input
          placeholder="search…"
          onKeyDown={handleKeyDown}
          data-testid="input-fuzzy-search"
          ref={inputRef}
          className="input-fuzzy-search"
        />
      </div>

      <p className="fuzzy-result-label">Result: </p>
      <div className="list-tab-found">
        {dataTabs.map((tab, i) => (
          <button
            id={`item-tab-found-${i}`}
            style={{
              backgroundColor:
                inputStatus === i
                  ? "light-dark(#f0f0f0, #333333)"
                  : "light-dark(#fff, #121212)",
            }}
            className="item-found item-tab-found"
            type="button"
          >
            <div
              style={{
                width: "16px",
                minWidth: "16px",
                height: "16px",
                background: tab.favIconUrl
                  ? `url(${tab.favIconUrl}) no-repeat center center / contain`
                  : "#eee",
              }}
            />
            {searchType === "title" ? tab.title : tab.url}
          </button>
        ))}
      </div>
    </div>
  );
};
