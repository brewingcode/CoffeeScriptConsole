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
$.fn.flattext = function() {
    return $(this)
        .text()
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
};

window.commify = function(s) {

    function r(r) {
        return Array.isArray(r) ? r : String(r).split(/[eE]/)
    }

    function fromExp(e) {
        var t = r(e);
        if (! function(e) {
                var t = r(e);
                return !Number.isNaN(Number(t[1]))
            }(t)) return t[0];
        var n = "-" === t[0][0] ? "-" : "",
            u = t[0].replace(/^-/, "").split("."),
            i = u[0],
            f = u[1] || "",
            o = Number(t[1]);
        if (0 === o) return n + i + "." + f;
        if (o < 0) {
            var s = i.length + o;
            if (s > 0) return n + i.substr(0, s) + "." + i.substr(s) + f;
            var a = "0.";
            for (o += 1; o;) a += "0", o += 1;
            return n + a + i + f
        }
        var c = f.length - o;
        if (c > 0) {
            var p = f.substr(o);
            return n + i + f.substr(0, o) + "." + p
        }
        for (var b = -c, d = ""; b;) d += "0", b -= 1;
        return n + i + f + d
    }

    var decimals, m, ref;
    var num = fromExp(eval(s));
    if (m = num.match(/(\d+)(\.(\d+))?/)) {
      decimals = (ref = m[3]) != null ? ref.replace(/(\d{3})(?=\d)/g, function(a,b) {
        return b + ',';
      }) : void 0;
      num = m[1].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (decimals ? '.' + decimals : '');
    }

    return num;
};
