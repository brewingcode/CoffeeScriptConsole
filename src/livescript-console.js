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

var tabId = chrome.devtools.inspectedWindow.tabId;
var err = document.getElementById('error');
var editor = ace.edit("cc-editor");

editor.setTheme("ace/theme/clouds");
if (lang == 'livescript') {
    editor.session.setMode("ace/mode/livescript");
} else {
    editor.session.setMode("ace/mode/coffee");
}
editor.session.setUseSoftTabs(true);
editor.session.setUseWrapMode(true);
editor.session.setTabSize(2);
editor.setShowPrintMargin(false);

var compiled = ace.edit("cc-results");
compiled.setTheme("ace/theme/clouds");
compiled.session.setMode("ace/mode/livescript");
compiled.session.setUseSoftTabs(true);
compiled.session.setUseWrapMode(true);
compiled.session.setTabSize(2);
compiled.setShowPrintMargin(false);


function compileIt(){
    chrome.devtools.inspectedWindow["eval"](compiled.session.getValue(), function(result, exception) {
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
    try {
        var compiledSource;
        if (lang == 'livescript') {
            LiveScript = require('livescript');
            compiledSource = LiveScript.compile( editor.session.getValue(), {bare:true, header: false});
        } else {
            compiledSource = CoffeeScript.compile( editor.session.getValue(), {bare:true});
        }
        compiled.session.setValue(compiledSource);
        err.className = 'is-hidden';
    } catch (error) {
        err.className = '';
        err.innerHTML = error.message;
    }
    localStorage.setItem("state" + tabId, editor.session.getValue());
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
compiled.commands.addCommand(compileOptions);

document.getElementById('runcc').addEventListener('click', compileIt);
editor.session.setValue(localStorage.getItem("state" + tabId));
schedule(function(){ editor.focus();}, 20);