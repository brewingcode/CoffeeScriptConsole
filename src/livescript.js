chrome.devtools.panels.create(
    "CoffeeScriptConsole",
    "badge.png",
    "livescript-console.html?lang=coffeescript",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);

chrome.devtools.panels.create(
    "LiveScriptConsole",
    "badge.png",
    "livescript-console.html?lang=livescript",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);
