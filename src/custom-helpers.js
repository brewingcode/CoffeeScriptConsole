window.branch = function(node) {
    var next, nodes, root;
    nodes = [];
    while (node) {
        nodes.push(node.cloneNode(false));
        node = node.parentElement
    }
    root = node = nodes.pop();
    while (nodes.length) {
        next = nodes.pop();
        node.appendChild(next);
        node = next
    }
    return root
};
window.nodes = function(node, prop) {
    var classes;
    classes = [];
    if (prop == null) {
        prop = "className"
    }
    while (node) {
        classes.push(node[prop]);
        node = node.parentElement
    }
    classes.reverse();
    return classes
};
void 0;