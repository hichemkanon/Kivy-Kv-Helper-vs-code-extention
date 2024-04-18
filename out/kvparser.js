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
        this.text = text;
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
        if (default_tabs < 0) {
            return;
        }
        for (let i = 0; i < lines.length; i++) {
            const line_loop = lines[i];
            if (line_loop.trim().startsWith("#")) {
                let node = new KvNode(line_loop, NODE_TYPE.COMMENT);
                node.line_number = i;
                node.index_column = get_tabs_number(line_loop);
                node.index_in_text = column_counter + get_tabs_number(line_loop);
                this.nodes.push(node);
            }
            if (line_loop.trim().endsWith(":")) {
                let node = new KvNode(line_loop.replace(":", ""), NODE_TYPE.PARENT);
                node.line_number = i;
                node.index_column = get_tabs_number(line_loop);
                node.index_in_text = column_counter + get_tabs_number(line_loop);
                this.nodes.push(node);
            }
            if (line_loop.includes(":") && !line_loop.endsWith(":")) {
                const child_tabs = get_tabs_number(line_loop);
                const parent_tabs = child_tabs - default_tabs;
                const split = line_loop.split(":");
                let attr = new Attribute(line_loop, NODE_TYPE.CHILD);
                attr.line_number = i;
                attr.index_column = get_tabs_number(line_loop);
                attr.index_in_text = column_counter + get_tabs_number(line_loop);
                this.nodes[this.nodes.length - 1].attributes.push(attr);
            }
            column_counter += line_loop.length + 1;
        }
    }
    add_attribute(attribute, parent_tabs) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            let node = this.nodes[i];
            if (node.index_column === parent_tabs && node.type === NODE_TYPE.PARENT) {
                node.attributes.push(attribute);
                return;
            }
        }
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
            console.log("default tabs num", tabs_num, line);
            return tabs_num;
        }
    }
    return -1;
}
const kvTemplate = `
BoxLayout:
    orientation: "vertical"
    size_hint: (.5, .5)
    Label:
        text: "Hello, World!"
    Button:
        text: "Click Me"
`;
const parser = new Parser(kvTemplate);
parser.parse();
console.log(parser.nodes);
//# sourceMappingURL=kvparser.js.map