import { useEffect, useState } from "react";
import "./App.css";
import { transformColorOpt } from "./helper/color";

const specialCharOpt = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];

function App() {
  const [tabGroups, setTabGroups] = useState<JSX.Element[]>([]);

  useEffect(() => {
    chrome.tabGroups.query({}, (tgs) => {
      if (tgs.length > 0) {
        const format = tgs.map((tg, i) => (
          <div key={`key-${tg.title}`}>
            <p
              style={{
                backgroundColor: transformColorOpt[tg.color].bg,
                color: transformColorOpt[tg.color].font,
              }}
              className="tg-chip"
            >
              {tg.title}
            </p>

            <p
              className="tg-sub-chip"
              style={{
                borderTop: `1px solid ${transformColorOpt[tg.color].line}`,
              }}
            >
              [Alt + {i + 1}]
            </p>
          </div>
        ));

        setTabGroups(format);
      }
    });

    chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
      if (req.action === "listen_group") {
        document.addEventListener(
          "keydown",
          (e) => {
            if (specialCharOpt.includes(e.key)) {
              sendResponse({ dataKey: e.key });
            }

            if (e.key === "†") {
              sendResponse({ newTab: true });
            }

            chrome.extension
              .getViews({ type: "popup" })
              .forEach((v) => v.close());
          },
          { once: true },
        );
      }

      return true;
    });
  }, []);

  return (
    <>
      <div>
        <p className="title-popup-extension">Toggle Collapse Group</p>
        <div className="tg-wrapper">{tabGroups.length > 0 && tabGroups}</div>
      </div>
    </>
  );
}

export default App;
