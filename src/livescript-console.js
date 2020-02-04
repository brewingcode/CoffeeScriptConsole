var getUrlParameters = function(){
  var url, hash, map, parts;
  url = window.location.href;
  hash = url.lastIndexOf('#');
  if (hash !== -1) {
    url = url.slice(0, hash);
  }
  map = {};
  parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
    return map[key] = decodeURIComponent(value).split('+').join(' ');
  });
  return map;
};

var lang = getUrlParameters().lang
var err = document.getElementById('error');
var editor = ace.edit("cc-editor");

function setEditorTheme(theme) {
  if (!theme) {
    theme = chrome.devtools.panels.themeName;
  }
  if (theme === 'dark' || theme == 'firebug') {
    editor.setTheme('ace/theme/monokai');
  }
  else {
    editor.setTheme('ace/theme/clouds');
  }
}

setEditorTheme();

if (chrome.devtools.panels.onThemeChanged) {
  chrome.devtools.panels.onThemeChanged.addListener(function(theme) {
    setEditorTheme(theme);
  });
}

if (typeof browser === 'undefined') {
  // in Chrome, hopefully
  editor.setKeyboardHandler('ace/keyboard/vim');
}
else {
  // in Firefox
  // The escape key is stolen by Firefox in order to toggle the devtools
  // console, rather the esc key going to Ace in order to kick vim into normal
  // mode. This makes using vim feel like a touchbar Macbook Pro (oh, burn!)
  // and so I'm disabling vim mode.
}

if (lang == 'livescript') {
    editor.session.setMode("ace/mode/livescript");
} else {
    editor.session.setMode("ace/mode/coffee");
}
editor.session.setUseSoftTabs(true);
editor.session.setUseWrapMode(true);
editor.session.setTabSize(2);
editor.setShowPrintMargin(false);

var compiled = '';

function compileIt(){
    // inject libraries into the context of the eval'd compiled code
    // there is probably a better way to do this....
    csconsole_injections.forEach(function(chunk){
        chrome.devtools.inspectedWindow['eval'](atob(chunk), function(result, exception) {
            if (exception) {
                console.error('error evaling chunk:', chunk.slice(0, 30), exception.description);
            }
        });
    });

    chrome.devtools.inspectedWindow["eval"](compiled, function(result, exception) {
      if (exception && (exception.isError || exception.isException)) {
          if (exception.isError) {
            err.className = '';
            err.innerHTML = "Error " + exception.code + ": " + exception.description;
          }
          if (exception.isException) {
            err.className = '';
            err.innerHTML = "Exception: " + exception.value;
          }
        }
      else {
          err.className = 'green';
          err.innerHTML = "Done!";
        }
    });
}

function update(){
    var code = editor.session.getValue();
    try {
        if (lang == 'livescript') {
            LiveScript = require('livescript');
            compiled= LiveScript.compile( code, {bare:true, header: false});
        } else {
            compiled = CoffeeScript.compile( code );
            compiled = '(async function() { console.log(await ' + compiled.replace(/;\s*$/,'') + '); })();'
        }
        err.className = 'is-hidden';
    } catch (error) {
        err.className = '';
        err.innerHTML = error.message;
    }
    chrome.devtools.inspectedWindow.eval("window.location.href", function(url) {
      localStorage.setItem("csconsole:" + url, editor.session.getValue());
    });
}

schedule = function(fn, timeout) {
    if (fn.$timer) return;
    fn.$timer = setTimeout(function() {fn.$timer = null; fn();}, timeout || 10);
};

editor.on("change", function(e){
    schedule(update, 20);
});

var compileOptions = {
    name: "compileIt",
    exec: compileIt,
    bindKey: "Ctrl-Return|Command-Return|Shift-Return"
};

editor.commands.addCommand(compileOptions);
document.getElementById('runcc').addEventListener('click', compileIt);

chrome.devtools.inspectedWindow.eval("window.location.href", function(url) {
  editor.session.setValue(localStorage.getItem("csconsole:" + url));
});

chrome.runtime.onMessage.addListener(function(req) {
  if (req === 'coffeeconsole-shown') {
    editor.focus();
  }
});












