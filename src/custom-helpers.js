// Clones a branch of the DOM that has `node` as its bottom leaf, and returns
// the root node.
window.branch = function(node) {
    var next, nodes, root;
    nodes = [];
    while (node) {
        nodes.push(node.cloneNode(false));
        node = node.parentElement;
    }
    root = node = nodes.pop();
    while (nodes.length) {
        next = nodes.pop();
        node.appendChild(next);
        node = next;
    }
    return root;
};

// Similar to `branch()`, but doesn't clone anything and returns each DOM node
// in a flat array, ordered from root -> leaf.
window.nodes = function(node) {
    var results = [];
    while (node) {
        results.push(node);
        node = node.parentElement;
    }
    results.reverse();
    return results;
};

// Flattens out whitespace from the results of $.text().
$.fn.flattext = function() {
    return $(this)
        .text()
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
};

window.commify = function(s) {
    var num, decimals, m, ref;
    if (m = s.toString().match(/(\d+)(\.(\d+))?/)) {
      decimals = (ref = m[3]) != null ? ref.replace(/(\d{3})(?=\d)/g, function(a,b) {
        return b + ',';
      }) : void 0;
      num = m[1].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimals ? '.' + decimals : '');
      if (s.toString().match(/^\s*-/)) {
          num = '-' + num;
      }
    }

    return num;
};
