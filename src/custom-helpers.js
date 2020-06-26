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

// Initialize a node as a tablesort (jquery plugin).
window.tsort = function(node) {
    if (!node) {
        if ($0) {
            if ($0.tagName === 'TABLE') {
                node = $($0);
            }
            else {
                node = $($0).parents('table').first()
            }
        }
        else {
            node = $('table').first()
        }
    }
    return $(node).tablesorter();
};

// Convert a <table> to an array of rows, with the headers as the first row.
//   - table is required to have `thead > tr > th` and `tbody > tr > td`
//   - only rows that have the same number of <td>s as <th>s are included
window.table2json = function(node) {
    if (!node) node = $0;
    while (node.tagName !== 'TABLE') {
        node = node.parentNode;
    }
    var headers = $('thead > tr > th', node).map(function() {
        return $(this).flattext();
    }).toArray();
    var rows = [headers];
    $('tbody > tr', node).each(function() {
         var row = $('> td', this).map(function() {
             return $(this).flattext();
         }).toArray();
         if (row.length == headers.length) {
             rows.push(row);
         }
    });
    return rows;
};