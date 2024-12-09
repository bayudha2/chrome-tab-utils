import { useEffect, useRef, useState } from "react";
import { fuzzyFindWord, startFuzzyFind } from "../../helper/search";

export const FuzzyTab = () => {
  const [dataFound, setDataFound] = useState<string[]>([]);
  const inputFindRef = useRef(null);

  useEffect(() => {
    (inputFindRef.current! as HTMLInputElement).focus();
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter": {
        if (!e.currentTarget.value) {
          return;
        }

        const resp = await startFuzzyFind(e.currentTarget.value);
        setDataFound(resp);
        break;
      }
      case "¡":
        fuzzyFindWord(dataFound[0]);
        e.preventDefault();
        break;
      case "™":
        fuzzyFindWord(dataFound[1]);
        e.preventDefault();
        break;
      case "£":
        fuzzyFindWord(dataFound[2]);
        e.preventDefault();
        break;
      case "¢":
        fuzzyFindWord(dataFound[3]);
        e.preventDefault();
        break;
      case "∞":
        fuzzyFindWord(dataFound[4]);
        e.preventDefault();
        break;
      case "§":
        fuzzyFindWord(dataFound[5]);
        e.preventDefault();
        break;
      case "¶":
        fuzzyFindWord(dataFound[6]);
        e.preventDefault();
        break;
      case "•":
        fuzzyFindWord(dataFound[7]);
        e.preventDefault();
        break;
      case "ª":
        fuzzyFindWord(dataFound[8]);
        e.preventDefault();
        break;
      case "º":
        fuzzyFindWord(dataFound[9]);
        e.preventDefault();
        break;
    }
  };

  return (
    <div style={{ padding: "8px" }}>
      <p className="title-popup-extension" style={{ marginBottom: "4px" }}>
        Fuzzy Find
      </p>

      <div
        style={{ margin: 0, padding: 0, display: "flex", marginBottom: "8px" }}
      >
        <input
          placeholder="search…"
          onKeyDown={handleKeyDown}
          data-testid="input-fuzzy-search"
          ref={inputFindRef}
          className="input-fuzzy-search"
        />
      </div>

      <p style={{ marginBottom: "4px", fontWeight: "400", fontSize: "10px" }}>
        Result:{" "}
        {dataFound.length > 0 ? (
          <span style={{ fontSize: "12px", fontWeight: "700" }}>
            {dataFound.length}
          </span>
        ) : null}
      </p>
      <div className="list-fuzzy-found">
        {dataFound.map((item, i) => (
          <button
            type="button"
            onClick={() => fuzzyFindWord(dataFound[i])}
            data-testid={`btn-item-fuzzy-${item}`}
            key={`item-${item}`}
            className="item-fuzzy-found"
          >
            <p
              style={{
                maxWidth: i < 10 ? "200px" : "230px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item}
            </p>
            {i < 10 ? (
              <span style={{ color: "#a0a0a0", fontSize: "10px" }}>
                [Alt+{i + (i === 9 ? -i : 1)}]
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};
