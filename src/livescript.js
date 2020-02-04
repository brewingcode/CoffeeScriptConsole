var theme = chrome.devtools.panels.themeName;

chrome.devtools.panels.create(
    "Coffee",
    theme === "dark" ? "icon-dark-48.png" : "icon-48.png",
    "livescript-console.html?lang=coffeescript",
    function cb(panel) {
        panel.onShown.addListener(function(win){
          chrome.runtime.sendMessage('coffeeconsole-shown');
        });
    }
);
