const specialCharOpt = ["¡", "™", "£"];

document.addEventListener("keydown", (e) => {
  if (specialCharOpt.includes(e.key)) {
    chrome.runtime.sendMessage({ dataKey: e.key }, () => {});
  }
});

console.log("run Tab Utility Extension", window, document);
