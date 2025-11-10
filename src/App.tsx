import { useEffect, useRef, useState } from "react";

import {
  getNoteData,
  getTabGroupsFormatted,
  popupKeydownListener,
  storeNoteData,
  controller,
} from "./helper/popup";
import "./App.css";

import { FuzzyTab } from "./tabs/fuzzy-tab";
import { TabFinderTab } from "./tabs/find-tab-tab";

function App() {
  const [tabGroups, setTabGroups] = useState<JSX.Element[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const inputNoteRef = useRef(null);

  useEffect(() => {
    popupKeydownListener(inputNoteRef, setSelectedTab);
    getTabGroupsFormatted(setTabGroups);
    getNoteData(inputNoteRef);
  }, []);

  const handleEscNote = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      storeNoteData((inputNoteRef.current! as HTMLInputElement).value);
      e.preventDefault();
    }
  };

  const tabOptions: { [key: number]: JSX.Element } = {
    1: (
      <div style={{ padding: "8px" }}>
        <p className="title-popup-extension">Toggle Collapse Group</p>

        <div className="tg-wrapper">{tabGroups}</div>

        <p className="title-popup-extension">
          Notes <span className="extra-label">(for this website)</span>{" "}
          <span style={{ fontSize: "9px", color: "#a0a0a0", fontWeight: 400 }}>
            [n]
          </span>
        </p>

        <div style={{ margin: 0, padding: 0, display: "flex" }}>
          <textarea
            onKeyDown={handleEscNote}
            data-testid="text-area-note"
            ref={inputNoteRef}
            className="input-text-area-notes"
          />
        </div>

        <button
          onClick={() => {
            controller.abort();
            setSelectedTab(2);
          }}
          data-testid="btn-start-fuzzy-find"
          type="button"
          style={{ marginBottom: "8px" }}
          className="button-fuzzy-find"
        >
          Fuzzy Find
          <span
            style={{ padding: 0, color: "#b4b4b4" }}
            className="tg-sub-chip"
          >
            [f]
          </span>
        </button>

        <button
          onClick={() => {
            controller.abort();
            setSelectedTab(3);
          }}
          data-testid="btn-start-fuzzy-find"
          type="button"
          className="button-fuzzy-find"
        >
          Find Tab
          <span
            style={{ padding: 0, color: "#b4b4b4" }}
            className="tg-sub-chip"
          >
            [/] [t] [o]
          </span>
        </button>
      </div>
    ),
    2: <FuzzyTab />,
    3: <TabFinderTab />,
  };

  return tabOptions[selectedTab];
}

export default App;
