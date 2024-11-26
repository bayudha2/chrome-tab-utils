const specialCharOpt = ["¡", "™", "£", "¢", "∞", "§", "¶", "•", "ª"];

document.addEventListener("keydown", (e) => {
  if (specialCharOpt.includes(e.key)) {
    chrome.runtime.sendMessage({ dataKey: e.key }, () => {});
  }

  if (e.key === "†") {
    chrome.runtime.sendMessage({ newTab: true }, () => {});
  }
});

console.log("run Tab Utility Extension", window, document);
