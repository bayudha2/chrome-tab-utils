import { useEffect, useRef, useState } from "react";

import {
  getNoteData,
  getTabGroupsFormatted,
  popupKeydownListener,
  storeNoteData,
} from "./helper/popup";
import "./App.css";

function App() {
  const [tabGroups, setTabGroups] = useState<JSX.Element[]>([]);
  const inputNoteRef = useRef(null);

  useEffect(() => {
    popupKeydownListener(inputNoteRef);
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
      <div style={{ padding: "8px" }}>
        <p className="title-popup-extension">Toggle Collapse Group</p>
        <div className="tg-wrapper">{tabGroups}</div>
        <p className="title-popup-extension">
          Notes <span className="extra-label">(for this website)</span>{" "}
          <span style={{ fontSize: "9px", color: "#a0a0a0", fontWeight: 400 }}>
            [n]
          </span>
        </p>
        <div>
          <textarea
            onKeyDown={handleEscNote}
            ref={inputNoteRef}
            className="input-text-area-notes"
          />
        </div>
      </div>
    </>
  );
}

export default App;
