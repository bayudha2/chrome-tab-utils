const specialCharOpt = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];

const getEditDistance = (str1: string = "", str2: string = ""): number => {
  const grid = Array(str1.length + 1)
    .fill(null)
    .map(() => Array(str2.length).fill(null));

  for (let i = 0; i <= str2.length; i++) {
    grid[0][i] = i;
  }

  for (let j = 0; j <= str1.length; j++) {
    grid[j][0] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      grid[i][j] = Math.min(
        grid[i - 1][j] + 1,
        grid[i][j - 1] + 1,
        grid[i - 1][j - 1] + cost,
      );
    }
  }

  return grid[str1.length][str2.length];
};

document.addEventListener("keydown", (e) => {
  if (specialCharOpt.includes(e.key)) {
    chrome.runtime.sendMessage({ dataKey: e.key }, () => {});
  }

  if (e.key === "†") {
    chrome.runtime.sendMessage({ newTab: true }, () => {});
  }
});

chrome.runtime.onMessage.addListener(
  (req: { action: string; text: string }, _, sendResp) => {
    const toleranceText: Set<string> = new Set();
    const x: { [key: number]: Set<string> } = {};
    const res: string[] = [];

    if (req?.action === "start-fuzzy-find") {
      toleranceText.clear();

      document.body.innerText
        .replace(/[^\w\s]/gi, " ")
        .replaceAll("\n", " ")
        .split(" ")
        .forEach((s) => {
          const editDistance = getEditDistance(req.text, s);
          if (editDistance > 2) {
            return;
          }

          if (!x[editDistance]) {
            x[editDistance] = new Set<string>();
          }

          x[editDistance].add(s);
        });

      const sortX = Object.keys(x)
        .sort((a, b) => +a - +b)
        .reduce(
          (acc, key) => {
            acc[+key] = x[+key];
            return acc;
          },
          {} as { [key: number]: Set<string> },
        );

      for (const distance of Object.values(sortX)) {
        res.push(...Array.from(distance));
      }

      sendResp({
        data: JSON.stringify(res),
      });
    }

    if (req?.action === "search-text") {
      let found = false;
      found = window.find(req?.text);

      if (!found) {
        found = window.find(req?.text, false, false, true);
      }
      sendResp();
    }
  },
);

console.log("run Tab Utility Extension");
