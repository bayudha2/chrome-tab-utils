import { useEffect, useRef, useState } from "react";

import {
  getNoteData,
  getTabGroupsFormatted,
  popupKeydownListener,
  storeNoteData,
} from "./helper/popup";
import "./App.css";
import { FuzzyTab } from "./tabs/fuzzy-tab";
// import { fuzzyFindWord, startFuzzyFind } from "./helper/search";

function App() {
  const [tabGroups, setTabGroups] = useState<JSX.Element[]>([]);
  const [fuzzyFinding, setFuzzyFinding] = useState<boolean>(false);

  const inputNoteRef = useRef(null);

  useEffect(() => {
    popupKeydownListener(inputNoteRef, setFuzzyFinding);
    getTabGroupsFormatted(setTabGroups);
    getNoteData(inputNoteRef);
  }, []);

  const handleEscNote = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      storeNoteData((inputNoteRef.current! as HTMLInputElement).value);
      e.preventDefault();
    }
  };

  // TODO: change bg color according to theme
  return (
    <>
      {fuzzyFinding ? (
        <FuzzyTab />
      ) : (
        <div style={{ padding: "8px" }}>
          <p className="title-popup-extension">Toggle Collapse Group</p>

          <div className="tg-wrapper">{tabGroups}</div>

          <p className="title-popup-extension">
            Notes <span className="extra-label">(for this website)</span>{" "}
            <span
              style={{ fontSize: "9px", color: "#a0a0a0", fontWeight: 400 }}
            >
              [n]
            </span>
          </p>

          <div style={{ margin: 0, padding: 0, display: "flex" }}>
            <textarea
              onKeyDown={handleEscNote}
              ref={inputNoteRef}
              className="input-text-area-notes"
            />
          </div>

          <button
            onClick={() => setFuzzyFinding(true)}
            type="button"
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
        </div>
      )}
    </>
  );
}

export default App;
