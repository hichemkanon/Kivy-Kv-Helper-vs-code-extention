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
exports.get_word_back_from = exports.get_word_towards_from = exports.find_open_parenthesis = exports.find_closing_parenthesis = exports.select_text = exports.move_cursor_to_index_in_line = exports.move_cursor_to_index_in_text = exports.cut_text = exports.select_whole_text = exports.replace_curent_line = exports.moveCursorToIndexOf = exports.move_cursor_forward = exports.move_cursor_back = exports.get_cursor_index = exports.insert_text_in_pos = exports.insert_text_in = exports.current_Prosition = exports.insert_text = exports.move_cursor_next_line = void 0;
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
function insert_text_in_pos(text, newPosition) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const edit = vscode.TextEdit.insert(new vscode.Position(0, newPosition), text);
    const editBuilder = activeEditor.edit(editBuilder => {
        editBuilder.insert(new vscode.Position(0, newPosition), text);
    });
}
exports.insert_text_in_pos = insert_text_in_pos;
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
function moveCursorToIndexOf(index) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = currentPosition.with(currentPosition.line, index);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
    }
}
exports.moveCursorToIndexOf = moveCursorToIndexOf;
function replace_curent_line(newText) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const { document, selection } = editor;
    const currentLine = document.lineAt(selection.active.line);
    const startPosition = new vscode.Position(selection.active.line, 0);
    const endPosition = new vscode.Position(selection.active.line, currentLine.range.end.character);
    editor.edit((editBuilder) => {
        editBuilder.replace(new vscode.Range(startPosition, endPosition), newText);
    });
}
exports.replace_curent_line = replace_curent_line;
async function select_whole_text() {
    await vscode.commands.executeCommand('editor.action.selectAll');
}
exports.select_whole_text = select_whole_text;
async function cut_text() {
    await vscode.commands.executeCommand('editor.action.clipboardCutAction');
}
exports.cut_text = cut_text;
function move_cursor_to_index_in_text(index) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }
    const newPosition = editor.document.positionAt(index);
    const newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
    editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenter);
}
exports.move_cursor_to_index_in_text = move_cursor_to_index_in_text;
function move_cursor_to_index_in_line(charIndex) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }
    const lineIndex = editor.selection.active.line;
    const { document, selection } = editor;
    const line = document.lineAt(lineIndex);
    const newPosition = new vscode.Position(line.lineNumber, charIndex);
    editor.selection = new vscode.Selection(newPosition, newPosition);
    editor.revealRange(new vscode.Range(newPosition, newPosition), vscode.TextEditorRevealType.InCenter);
}
exports.move_cursor_to_index_in_line = move_cursor_to_index_in_line;
function select_text(startIndex, endIndex = undefined) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }
    const { document } = editor;
    const startPosition = document.positionAt(startIndex);
    let endPosition;
    if (endIndex !== undefined) {
        endPosition = document.positionAt(endIndex);
    }
    else {
        endPosition = editor.selection.active;
    }
    const newSelection = new vscode.Selection(startPosition, endPosition);
    editor.selection = newSelection;
    editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenter); // Optionally, reveal the selection in the center of the editor
}
exports.select_text = select_text;
function find_closing_parenthesis(openIndex) {
    let openCount = 0;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return -1; // No active editor
    }
    for (let i = openIndex + 1; i < editor.document.getText().length; i++) {
        const char = editor.document.getText()[i];
        if (char === '(') {
            openCount++;
        }
        else if (char === ')') {
            if (openCount === 0) {
                return i; // Found the matching closing parenthesis
            }
            openCount--;
        }
    }
    return -1; // No matching closing parenthesis found
}
exports.find_closing_parenthesis = find_closing_parenthesis;
function find_open_parenthesis(closingIndex) {
    if (closingIndex < 0) {
        return -1; // Invalid closingIndex
    }
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return -1; // No active editor
    }
    const document = editor.document;
    const text = document.getText();
    let openCount = 0;
    for (let i = closingIndex - 1; i >= 0; i--) {
        const char = text[i];
        if (char === ')') {
            openCount++;
        }
        else if (char === '(') {
            if (openCount === 0) {
                return i; // Found the matching open parenthesis
            }
            openCount--;
        }
    }
    return -1; // No matching open parenthesis found
}
exports.find_open_parenthesis = find_open_parenthesis;
function get_word_towards_from(index) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.log("No active editor");
        return "";
    }
    const text = editor.document.getText();
    const substring = text.substring(index);
    const wordMatch = substring.match(/\b\w+\b/);
    if (wordMatch) {
        const word = wordMatch[0];
        return word;
    }
    else {
        return "";
    }
}
exports.get_word_towards_from = get_word_towards_from;
function get_word_back_from(index) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        console.log("No active editor");
        return "";
    }
    const text = editor.document.getText();
    const substring = text.substring(0, index).trim();
    const wordMatch = substring.match(/\b\w+\b$/);
    if (wordMatch) {
        const word = wordMatch[0];
        return word;
    }
    else {
        return "";
    }
}
exports.get_word_back_from = get_word_back_from;
//# sourceMappingURL=editor.js.map