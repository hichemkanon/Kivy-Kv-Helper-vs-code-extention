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

