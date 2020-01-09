chrome.devtools.panels.create(
    "Coffee",
    "badge.png",
    "livescript-console.html?lang=coffeescript",
    function cb(panel) {
        panel.onShown.addListener(function(win){ win.focus(); });
    }
);
