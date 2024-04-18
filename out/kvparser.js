"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.KvNode = exports.Attribute = exports.NODE_TYPE = void 0;
var NODE_TYPE;
(function (NODE_TYPE) {
    NODE_TYPE[NODE_TYPE["PARENT"] = 0] = "PARENT";
    NODE_TYPE[NODE_TYPE["CHILD"] = 1] = "CHILD";
    NODE_TYPE[NODE_TYPE["MAIN_VIEW"] = 2] = "MAIN_VIEW";
    NODE_TYPE[NODE_TYPE["COMMENT"] = 3] = "COMMENT";
})(NODE_TYPE || (exports.NODE_TYPE = NODE_TYPE = {}));
class Attribute {
    key;
    value;
    type;
    index_column;
    line_number;
    index_in_text;
    constructor(text, type) {
        this.type = type;
        this.index_column = -1;
        this.index_in_text = -1;
        this.line_number = -1;
        this.key = text.split(":")[0].trim();
        this.value = text.split(":")[1].trim();
    }
}
exports.Attribute = Attribute;
class KvNode {
    text;
    type;
    attributes;
    children;
    index_column;
    line_number;
    index_in_text;
    constructor(text, type) {
        this.text = text.replace(":", "").trim();
        this.type = type;
        this.attributes = [];
        this.children = [];
        this.index_column = -1;
        this.index_in_text = -1;
        this.line_number = -1;
    }
}
exports.KvNode = KvNode;
class Parser {
    nodes;
    kvContent;
    constructor(kvContent) {
        this.kvContent = kvContent;
        this.nodes = [];
    }
    parse() {
        if (this.kvContent.trim().length === 0) {
            return;
        }
        const lines = this.kvContent.split('\n');
        let column_counter = 0;
        let mainFound = false;
        const default_tabs = get_default_tabs_number(this.kvContent);
        let current_node = null;
        if (default_tabs < 0) {
            return;
        }
        const main_node = this.get_main();
        if (main_node) {
            this.nodes.push(main_node);
            mainFound = true;
        }
        for (let i = 0; i < lines.length; i++) {
            if (mainFound && i === main_node?.line_number) {
                continue;
            }
            const line_loop = lines[i];
            const tabs = get_tabs_number(line_loop);
            if (line_loop.trim().endsWith(":")) {
                if (tabs === 0) {
                    let node = new KvNode(line_loop, NODE_TYPE.PARENT);
                    node.line_number = i;
                    node.index_column = get_tabs_number(line_loop);
                    node.index_in_text = column_counter + get_tabs_number(line_loop);
                    this.nodes.push(node);
                }
                else {
                }
            }
            column_counter += line_loop.length + 1;
        }
    }
    loopIt(node, counter) {
        if (node.children.length === 0) {
            return node;
        }
        else {
            let node2 = node.children[node.children.length - 1];
            if (node2.children.length === 0) {
                return node2;
            }
            else {
            }
        }
    }
    get_main() {
        let found = false;
        let node = null;
        let i = 0;
        let column_counter = 0;
        for (let line_loop of this.kvContent.split("\n")) {
            const tabs = get_tabs_number(line_loop);
            if (line_loop.trim().includes(":") && !line_loop.trim().endsWith(":") && found && tabs > 0) {
                console.log("break", "line", line_loop);
                node = null;
                break;
            }
            if (line_loop.trim().endsWith(":") && found) {
                const matche = this.kvContent.match("\<" + node?.text + "\>" + "|" + "\<" + node?.text + "@");
                if (matche) {
                    return node;
                }
                else {
                    return null;
                }
            }
            if (line_loop.trim().endsWith(":") && tabs === 0) {
                node = new KvNode(line_loop, NODE_TYPE.MAIN_VIEW);
                node.line_number = i;
                node.index_column = get_tabs_number(line_loop);
                node.index_in_text = column_counter + get_tabs_number(line_loop);
                found = true;
            }
            i++;
            column_counter += line_loop.length + 1;
        }
        return node;
    }
}
exports.Parser = Parser;
function get_tabs_number(line) {
    const spaces = line.match("^\\s+");
    if (spaces) {
        return spaces[0].length;
    }
    return 0;
}
function get_default_tabs_number(text) {
    const lines = text.split("\n");
    let tabs_numer = 0;
    if (lines.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tabs_num = get_tabs_number(line);
            if (tabs_num === 0) {
                continue;
            }
            if (line.trim().length === 0) {
                continue;
            }
            if (line.trim().startsWith("#")) {
                continue;
            }
            return tabs_num;
        }
    }
    return -1;
}
const kvTemplate = `
BoxLay:
BoxLayout:
    orientation: "vertical"
    size_hint: (.5, .5)
    BoxLayout:
        orientation: "vertical"
        size_hint: (.5, .5)
    Label:
        text: "Hello, World!"
    Button:
        text: "Click Me"
<BoxLay@StackLayout>:
    orientation: "lr-tb"
`;
const parser = new Parser(kvTemplate);
parser.parse();
console.log("main", parser.nodes);
//# sourceMappingURL=kvparser.js.map