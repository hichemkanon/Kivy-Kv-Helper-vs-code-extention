import * as vscode from "vscode";
import { showErrorMessage, showMessage } from "./windowutil";
import * as fs from "fs";
import * as path from "path";
import * as file from "./fileutils";

let selected_text = "";
let cursor_index = [-1, -1];
const filePath = path.join(__dirname, '..', 'data', 'kv.json');
const fileValuesPath = path.join(__dirname, '..', 'data', 'in_strings.json');

export function init_textutils() {
    vscode.workspace.onDidOpenTextDocument((document) => {
        const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
        if (fileExtension === "py") {

        } else if (fileExtension === "kv") {

        }
    });

    vscode.workspace.onDidChangeTextDocument((event) => {
        //handleTextDocumentChange(event);
        const parsedWidgets = parseKV(vscode.window.activeTextEditor?.document.getText() as string);
        
    });

    vscode.window.onDidChangeTextEditorSelection((event) => {
        handleTextEditorSelectionChange(event);
    });

}

function handleTextDocumentChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length > 0) {
        let lastChange = event.contentChanges[event.contentChanges.length - 1];
        if (lastChange.text.includes('\n')) {
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                let position = editor.selection.active;
                // Adjust position to insert after the newline character
                let newPosition = position.with(position.line + 1, 0);
                editor.edit((editBuilder) => {
                    editBuilder.insert(newPosition, '    '); // Insert text 'dwd' after Enter
                });
            }
        }
    }
}

function handleTextEditorSelectionChange(
    event: vscode.TextEditorSelectionChangeEvent
) {
    const editor = event.textEditor;
    const cursorPosition = editor.selection.active;
    const document = editor.document;

    // Get the text before the cursor
    const textBeforeCursor = document.getText(
        new vscode.Range(new vscode.Position(0, 0), cursorPosition)
    );

    // Find the nearest opening and closing parentheses before the cursor
    const openingParenIndex = textBeforeCursor.lastIndexOf("(");
    const closingParenIndex = textBeforeCursor.lastIndexOf(")");

    if (openingParenIndex > closingParenIndex && openingParenIndex !== -1) {
        // Cursor is inside parentheses
    } else {
        // Cursor is not inside parentheses
    }

    let startPosition: vscode.Position;
    let endPosition: vscode.Position;

    if (editor.selection.isEmpty) {
        startPosition = editor.selection.active;
        endPosition = editor.selection.active;
        cursor_index = [startPosition.line * 1000 + startPosition.character, endPosition.line * 1000 + endPosition.character];
    } else {
        startPosition = editor.selection.start;
        endPosition = editor.selection.end;
        cursor_index = [startPosition.line * 1000 + startPosition.character, endPosition.line * 1000 + endPosition.character];
    }


}

export function get_selected_text(): string {
    return selected_text;
}

export function get_cursor_index(): number {
    return cursor_index[0];
}

export function get_cursor_start_end_offsets(): Array<number> {
    return cursor_index;
}

function getWordBeforeCursor(): string {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const position = editor.selection.active;
        const wordRange = editor.document.getWordRangeAtPosition(position, /\w+/);
        if (wordRange) {
            return editor.document.getText(wordRange);
        }
    }
    return "/><5%";
}

function getTextBeforeFirstQuote(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return '';
    }

    const position = editor.selection.active;
    const line = editor.document.lineAt(position.line);
    const lineText = line.text;

    let textBeforeQuote = '';
    for (let i = position.character - 1; i >= 0; i--) {
        const char = lineText.charAt(i);
        if (char === '"') {
            textBeforeQuote = lineText.substring(i + 1, position.character);
            break;
        }
    }

    return textBeforeQuote;
}

export function searchKvKeywords(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    if (isInsideString()) {
        const prefix = getTextBeforeFirstQuote();

        const listPaths = searchPaths(prefix);

        const listValues = searchStringsValue(prefix);

        return [...listPaths, ...listValues];
    }

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData: any = JSON.parse(data);


        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const item = jsonData[key];
                let prefix = handle_object_kv(item);

                if (isInsideComment()) {
                    prefix = item.prefix;
                }

                if (prefix.includes(searchTerm)) {
                    searchResult.push(new vscode.CompletionItem(prefix));
                }

            }
        }
    } catch (err) {
        console.error(err);
    }

    return sortText(searchResult);
}

function sortText(items: vscode.CompletionItem[]): vscode.CompletionItem[] {
    return items.sort((a, b) => (b.label as string).length - (a.label as string).length);
}

export function searchKivyKeywords(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    if (isInsideString()) {
        const prefix = getTextBeforeFirstQuote();
        let listPaths = searchPaths(prefix);
        return listPaths;
    }

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData: any = JSON.parse(data);


        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const item = jsonData[key];
                let prefix = handle_object_kivy(item);

                if (isInsideComment()) {
                    prefix = item.prefix;
                }

                if (prefix.includes(searchTerm)) {
                    searchResult.push(new vscode.CompletionItem(prefix));
                }

            }
        }
    } catch (err) {
        console.error(err);
    }

    return sortText(searchResult);
}



export function searchPaths(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    try {
        
        const listFile = file.listFilesInPath(path.dirname(searchTerm));

        for (const filePath of listFile) {
            searchResult.push(new vscode.CompletionItem(path.basename(filePath)));
        }
    } catch (err) {
        console.error(err);
    }

    return searchResult;
}


export function searchStringsValue(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    try {
        const data = fs.readFileSync(fileValuesPath, "utf8");

        const jsonData = JSON.parse(data);

        for (const item of jsonData) {
            searchResult.push(new vscode.CompletionItem(item));
        }
    } catch (err) {
        console.error(err);
    }

    return searchResult;
}


export function isInsideString(): boolean {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return false;
    }

    const position = editor.selection.active;
    const line = editor.document.lineAt(position.line);
    const lineText = line.text;

    let find_parenth1 = false;
    let find_parenth2 = false;

    if (position.character >= lineText.length) {
        return false;
    }

    for (let i = position.character; i < lineText.length; i++) {
        if (lineText.charAt(i) === '"' || lineText.charAt(i) === "'") {
            const prev = i - 1;


            if (prev < lineText.length) {

                if (lineText.charAt(i) === '\n') {
                    break;
                }

                if (lineText.charAt(prev) === '\\') {
                    continue;
                }
            }
            find_parenth1 = true;
        }
    }

    for (let i = position.character - 1; i >= 0; i--) {
        if (lineText.charAt(i) === '"' || lineText.charAt(i) === "'") {
            const prev = i - 1;
            const charAt = lineText.charAt(i);


            if (prev > 0) {

                if (lineText.charAt(i) === '\n') {
                    break;
                }

                if (lineText.charAt(prev) === '\\') {
                    continue;
                }
            }
            find_parenth2 = true;
        }
    }

    return find_parenth1 === true && find_parenth2 === true;
}


export function isInsideComment(): boolean {
    const editor = vscode.window.activeTextEditor;
    const position = editor?.selection.active;
    if (!position) {
        return false; // Return false if cursor position is undefined
    }
    const line = editor?.document.lineAt(position.line);
    const lineText = line?.text;

    if (!lineText) {
        return false; // Return false if line text is undefined
    }

    for (let i = 0; i < position.character; i++) {
        const char = lineText.charAt(i);
        if (char === '#') {
            return true;
        }
    }
    return false;
}


function handle_object_kv(json_obj: any): string {
    const type: string = json_obj.type;
    const prefix: string = json_obj.prefix;

    if (type === 'widget') {
        return prefix + ":\n    ";
    } else if (type === 'attribute') {
        return prefix + ": ";
    } else if (type === 'event') {
        return prefix + ": ";
    } else if (type === 'operator') {
        return prefix + "\n";
    } else if (type === 'other') {
        if (prefix.includes("import") || prefix.includes("include")) {
            return prefix + " ";
        }
        return prefix + ": ";
    } else if (type === 'loop') {
        return prefix + " ";
    }
    return prefix;
}

function handle_object_kivy(json_obj: any): string {
    const type: string = json_obj.type;
    const prefix: string = json_obj.prefix;

    if (type === 'widget') {
        return prefix + "()";
    } else if (type === 'attribute') {
        return prefix + "=";
    } else if (type === 'event') {
        return prefix + "=";
    } else if (type === 'operator') {
        return prefix + "";
    } else if (type === 'other') {
        if (prefix.includes("import") || prefix.includes("include")) {
            //return prefix + " ";
        }
        //return prefix + ": ";
    } else if (type === 'loop') {
        return prefix + "";
    }
    return prefix;
}



interface Widget {
    type: string;
    properties: { [key: string]: any };
    children?: Widget[];
    index: number;
    lineNumber: number;
}

function parseKV(kvString: string): Widget[] {
    const widgets: Widget[] = [];
    let currentWidget: Widget | null = null;
    let lineNumber = 0;

    kvString.split('\n').forEach((line, index) => {
        lineNumber++;
        const trimmedLine = line.trim();
        if (trimmedLine.endsWith(':')) {
            currentWidget = { type: trimmedLine.slice(0, -1), properties: {}, index, lineNumber };
            widgets.push(currentWidget);
        } else if (currentWidget && trimmedLine.includes(':')) {
            const [key, value] = trimmedLine.split(':').map(s => s.trim());
            currentWidget.properties[key] = value;
        }
    });

    return widgets;
}