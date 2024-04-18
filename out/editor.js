"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.move_cursor_forward = exports.move_cursor_back = exports.get_cursor_index = exports.insert_text_in = exports.current_Prosition = exports.insert_text = exports.move_cursor_next_line = void 0;
const vscode = __importStar(require("vscode"));
async function move_cursor_next_line(how_much_lines) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const currentPosition = editor.selection.active;
    const lineNumber = currentPosition.line + how_much_lines;
    await vscode.commands.executeCommand('editor.action.insertLineAfter');
}
exports.move_cursor_next_line = move_cursor_next_line;
function insert_text(text) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const currentPosition = activeEditor.selection.active;
    const currentLineIndex = currentPosition.line;
    const newPosition = currentPosition.with(currentLineIndex, currentPosition.character);
    const edit = vscode.TextEdit.insert(newPosition, text);
    const editBuilder = activeEditor.edit(editBuilder => {
        editBuilder.insert(newPosition, text);
    });
}
exports.insert_text = insert_text;
function current_Prosition() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return new vscode.Position(0, 0);
    }
    return activeEditor.selection.active;
}
exports.current_Prosition = current_Prosition;
function insert_text_in(text, newPosition) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const edit = vscode.TextEdit.insert(newPosition, text);
    const editBuilder = activeEditor.edit(editBuilder => {
        editBuilder.insert(newPosition, text);
    });
}
exports.insert_text_in = insert_text_in;
function get_cursor_index() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const document = editor.document;
        const offset = document.offsetAt(position);
        return offset;
    }
    return -1;
}
exports.get_cursor_index = get_cursor_index;
function move_cursor_back(how_many) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const currentPosition = activeEditor.selection.active;
    const newPosition = currentPosition.with(currentPosition.line, currentPosition.character - how_many);
    const selection = new vscode.Selection(newPosition, newPosition);
    activeEditor.selection = selection;
    activeEditor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
}
exports.move_cursor_back = move_cursor_back;
function move_cursor_forward(how_many) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const currentPosition = activeEditor.selection.active;
    const newPosition = currentPosition.with(currentPosition.line, currentPosition.character + how_many);
    const selection = new vscode.Selection(newPosition, newPosition);
    activeEditor.selection = selection;
    activeEditor.revealRange(selection, vscode.TextEditorRevealType.InCenter);
}
exports.move_cursor_forward = move_cursor_forward;
//# sourceMappingURL=editor.js.map