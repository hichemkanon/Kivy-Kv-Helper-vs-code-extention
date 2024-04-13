"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_insertion_text = void 0;
const module_1 = require();
function handle_insertion_text(item) {
    const prefix = item.label.trim();
    const strings = ["orientation:", "text:"];
    const tuples = ["size_hint:", "rgba:", "color:", "background_color:", "rgb:"];
    const dicts = ["pos_hint:"];
    if (strings.includes(prefix)) {
        (0, module_1.insertTextAtCursor)("\"\"");
        (0, module_1.move_cursor_forward)(1);
        return;
    }
    if (tuples.includes(prefix)) {
        (0, module_1.insertTextAtCursor)("()");
        (0, module_1.move_cursor_forward)(1);
        return;
    }
    if (dicts.includes(prefix)) {
        (0, module_1.insertTextAtCursor)("{}");
        (0, module_1.move_cursor_forward)(1);
        return;
    }
}
exports.handle_insertion_text = handle_insertion_text;
//# sourceMappingURL=text_insertions.js.map