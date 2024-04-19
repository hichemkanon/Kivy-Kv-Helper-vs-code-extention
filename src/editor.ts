import * as vscode from "vscode";


export async function move_cursor_next_line(how_much_lines: number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const currentPosition = editor.selection.active;
    const lineNumber = currentPosition.line + how_much_lines;

    await vscode.commands.executeCommand('editor.action.insertLineAfter');

}

export function insert_text(text: string) {
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

export function current_Prosition() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return new vscode.Position(0, 0);
    }
    return activeEditor.selection.active;
}

export function insert_text_in(text: string, newPosition: vscode.Position) {
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

export function insert_text_in_pos(text: string, newPosition: number) {
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

export function get_cursor_index(): number {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const document = editor.document;
        const offset = document.offsetAt(position);
        return offset;
    }
    return -1;
}


export function move_cursor_back(how_many: number): void {

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

export function move_cursor_forward(how_many: number): void {

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


export function moveCursorToIndexOf(index: number) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const currentPosition = editor.selection.active;
        const newPosition = currentPosition.with(currentPosition.line, index);
        const newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
    }
}


export function replace_curent_line(newText: string) {
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

export async function select_whole_text() {
    await vscode.commands.executeCommand('editor.action.selectAll');
}

export async function cut_text() {
    await vscode.commands.executeCommand('editor.action.clipboardCutAction');
}

export function move_cursor_to_index_in_text(index: number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }
    const newPosition = editor.document.positionAt(index);
    const newSelection = new vscode.Selection(newPosition, newPosition);

    editor.selection = newSelection;
    editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenter);
}


export function move_cursor_to_index_in_line(charIndex: number) {
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


export function select_text(startIndex: number, endIndex: number | undefined = undefined) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No active editor
    }

    const { document } = editor;
    const startPosition = document.positionAt(startIndex);

    let endPosition: vscode.Position;
    if (endIndex !== undefined) {
        endPosition = document.positionAt(endIndex);
    } else {
        endPosition = editor.selection.active;
    }

    const newSelection = new vscode.Selection(startPosition, endPosition);

    editor.selection = newSelection;
    editor.revealRange(newSelection, vscode.TextEditorRevealType.InCenter); // Optionally, reveal the selection in the center of the editor
}


export function find_closing_parenthesis(openIndex: number): number {
    let openCount = 0;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return -1; // No active editor
    }

    for (let i = openIndex + 1; i < editor.document.getText().length; i++) {
        const char = editor.document.getText()[i];
        if (char === '(') {
            openCount++;
        } else if (char === ')') {
            if (openCount === 0) {
                return i; // Found the matching closing parenthesis
            }
            openCount--;
        }
    }

    return -1; // No matching closing parenthesis found
}


export function find_open_parenthesis(closingIndex: number): number {
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
        } else if (char === '(') {
            if (openCount === 0) {
                return i; // Found the matching open parenthesis
            }
            openCount--;
        }
    }

    return -1; // No matching open parenthesis found
}

export function get_word_towards_from(index: number): string {
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
    } else {
        return "";
    }
}

export function get_word_back_from(index: number): string {
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
    } else {
        return "";
    }
}
