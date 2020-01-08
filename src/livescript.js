chrome.devtools.panels.create(
    "CoffeeScriptConsole",
    "badge.png",
    "livescript-console.html?lang=coffeescript",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);
