import * as vscode from "vscode";
import { showErrorMessage, showMessage, CustomPanel } from "./windowutil";
import * as fs from "fs";
import * as path from "path";
import * as file from "./fileutils";
import * as tools from "./tools";

let selected_text = "";
let cursor_index = [-1, -1];

const filePath = path.join(__dirname, '..', 'data', 'all_kivy.json');
const fileValuesPath = path.join(__dirname, '..', 'data', 'in_strings.json');
let fileExtension: string | undefined;




export function init_textutils(context: vscode.ExtensionContext) {


    vscode.workspace.onDidOpenTextDocument((document) => {

    });

    // on tab changes event
    vscode.window.onDidChangeTextEditorSelection((event) => {
        if (event.textEditor) {
            fileExtension = event.textEditor.document.fileName.split(".").pop()?.toLowerCase();
            if (fileExtension === "py") {

            } else if (fileExtension === "kv") {

            }
        }

    });

    vscode.workspace.onDidChangeTextDocument((event) => {
        //handleTextDocumentChange(event);
    });

    vscode.window.onDidChangeTextEditorSelection((event) => {
        handleTextEditorSelectionChange(event);
    });

}

function getWebviewContent(colorPickerPath: string, panel: vscode.WebviewPanel): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Color Picker</title>
            <style>
                body { font-family: Arial, sans-serif; }
                #colorPicker { width: 300px; margin: 20px; }
                #closeBtn { float: right; }
            </style>
        </head>
        <body>
            <div id="colorPicker">
                <input type="color" id="colorInput">
                <button id="applyBtn">Apply</button>
                <button id="closeBtn">Close</button>
            </div>
            <script>
                const vscode = acquireVsCodeApi();

                const colorInput = document.getElementById('colorInput');
                const applyBtn = document.getElementById('applyBtn');
                const closeBtn = document.getElementById('closeBtn');

                applyBtn.addEventListener('click', () => {
                    const selectedColor = colorInput.value;
                    vscode.postMessage({ command: 'colorSelected', color: selectedColor });
                });

                closeBtn.addEventListener('click', () => {
                    vscode.postMessage({ command: 'closePanel' });
                });
            </script>
        </body>
        </html>
    `;
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
        if (char === '"' || char === "'") {
            if (i - 1 >= 0) {
                if (lineText.charAt(i - 1) === "\\") {
                    continue;
                }
            }
            textBeforeQuote = lineText.substring(i + 1, position.character);
            break;
        }
    }

    return textBeforeQuote;
}

export function searchKvKeywords(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    if (isInsideStringKv()) {
        const prefix = getTextBeforeFirstQuote();

        const listPaths = searchPaths(prefix);

        const listValues = searchStringsValue(prefix);

        return [...listPaths, ...listValues];
    }


    const parent_name = get_parent_of_child();
    const current_word = getWordBeforeCursor();

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData: any = JSON.parse(data);

        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const item = jsonData[key];
                const type = item["type"];
                const name = item["name"];
                let prefix = item["prefix_kv"];
                const parents_list = item["parent"];

                const is_parent = searchTerm.charAt(0).match("[A-Z]") !== null;


                let completion_item: vscode.CompletionItem = new vscode.CompletionItem(name);
                completion_item.detail = type;

                if (inside_brackets() || isInsideComment()) {
                    completion_item.insertText = name;
                } else {
                    completion_item.insertText = prefix;
                }


                if (parent_name.trim().length > 0 && jsonData.hasOwnProperty(parent_name) && !is_parent) {
                    if (parents_list.includes(parent_name)) {
                        if (!searchResult.includes(completion_item)) {
                            searchResult.push(completion_item);
                        }
                    }
                } else {
                    if (name.startsWith(searchTerm.trim())) {
                        if (!searchResult.includes(completion_item)) {
                            searchResult.push(completion_item);
                        }
                    }
                }



            }
        }

    } catch (err) {
        console.error(err);
    }

    return sortText(searchResult);
}

function get_search_results_for(searchTerm: string, jsonData: any) {
    const searchResult: vscode.CompletionItem[] = [];

    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            const item = jsonData[key];
            const type = item["type"];
            const name = item["name"];
            let prefix = item["prefix_kv"];

            if (isInsideComment()) {
                //prefix = item.prefix;
            }

            let completion_item: vscode.CompletionItem = new vscode.CompletionItem(name);
            completion_item.detail = type;

            if (inside_brackets()) {
                completion_item.insertText = name;
            } else {
                completion_item.insertText = prefix;
            }

            if (name.startsWith(searchTerm.trim())) {
                searchResult.push(completion_item);
            }
        }
    }
    return sortText(searchResult);
}

function sortText(items: vscode.CompletionItem[]): vscode.CompletionItem[] {
    return items.sort((a, b) => (b.label as string).length - (a.label as string).length);
}

export function searchKivyKeywords(searchTerm: string): vscode.CompletionItem[] {
    const searchResult: vscode.CompletionItem[] = [];

    if (isInsideStringPy()) {
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
                const type = item["type"];
                let prefix = item["prefix_py"];

                if (isInsideComment()) {
                    prefix = item.prefix;
                }

                if (key.includes(searchTerm)) {
                    let item: vscode.CompletionItem = new vscode.CompletionItem(prefix);
                    item.detail = type;
                    searchResult.push(item);
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

        if (searchTerm.startsWith(".\\") || searchTerm.startsWith("./")) {
            const activeEditor = vscode.window.activeTextEditor;
            let currentPath = searchTerm.startsWith(".\\") ? ".\\" : "./";
            if (activeEditor) {
                currentPath = path.dirname(activeEditor.document.uri.fsPath);
            }
            searchTerm = searchTerm.replace(".\\", "");
            searchTerm = path.join(currentPath, searchTerm);
        }

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


export function isInsideStringPy(): boolean {
    return is_inside("\"", "\"") || is_inside("'", "'");
}

export function isInsideStringKv(): boolean {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return false;
    }

    const document = editor.document;
    const selection = editor.selection;
    const currentPosition = editor.selection.start.character;
    const text = editor.document.lineAt(get_current_line_index()).text;

    let find_open = false;
    let find_close = false;

    for (let i = currentPosition - 1; i >= 0; i--) {
        const char = text.charAt(i);

        if (char === "\"" || char === "'") {
            find_open = true;
            break;
        }

    }


    for (let i = currentPosition; i < text.length; i++) {
        const char = text.charAt(i);

        if (char === "\"" || char === "'") {
            find_close = true;
            break;
        }

    }

    return find_open && find_close;
}

export function inside_brackets(): boolean {
    return is_inside("(", ")") || is_inside("{", "}") || is_inside("<", ">") || is_inside("[", "]");
}

function is_inside(open: string, close: string) {


    let find_open = false;
    let find_close = false;

    const line_text = get_line_text();
    const cursor_index_in_line = get_cursor_index_in_line();

    const open_index = line_text.indexOf(open);
    const close_index = line_text.indexOf(close) + 1;

    return open_index < cursor_index_in_line && cursor_index_in_line < close_index;
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

export function insert_text(text: string) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const currentPosition = activeEditor.selection.active;

    const edit = vscode.TextEdit.insert(currentPosition, text);

    const editBuilder = activeEditor.edit(editBuilder => {
        editBuilder.insert(currentPosition, text);
    });


}


export function handle_insertion_text(item: vscode.CompletionItem) {

    const searchTerm = (item.label as string).trim();

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData: any = JSON.parse(data);


        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const item = jsonData[key];
                const type = item["type"];
                const mtype = item["mtype"];
                let prefix = item["name"];

                if (inside_brackets()) {
                    return;
                }

                if (prefix === searchTerm.trim()) {

                    const func = types.parenths.includes(type) && fileExtension === "kv";

                    if (fileExtension === "kv" && mtype === "function") {
                        return;
                    }

                    if (types.strings.includes(type) || types.lists.includes(type) ||
                        func || types.dicts_and_set.includes(type) || types.parenths.includes(type)) {
                        move_cursor_back(1);
                    }


                }

            }
        }
    } catch (err) {

    }
}

export function get_word_before_parenths_py() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const currentPosition = getCursorIndex();


    if (!inside_brackets()) {
        return;
    }

    let word = "";
    let start_collect = false;


    for (let i = currentPosition; i >= 0; i--) {
        const char = text.charAt(i);
        if (char === " ") {
            continue;
        };

        if (char.match("[^\\w\\s]") && start_collect) {
            break;
        };

        if (start_collect) {
            word = char + word;
        }
        if (char === "(") {
            start_collect = true;
        };
    }

    vscode.window.showInformationMessage(`Word before opening parenthesis: ${word}`);
}


export function get_word_before_parenths_kv(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }

    const document = editor.document;
    const selection = editor.selection;
    const position = editor.selection.start;

    // Ensure a single character selection to get precise index
    if (selection.active.character !== selection.anchor.character) {
        return ""; // Not a single character selection
    }

    // Get the line at the cursor position
    const line = document.lineAt(selection.active.line).text;



    if (!inside_brackets()) {
        return "";
    }

    let word = "";
    let start_collect = false;

    for (let i = selection.active.character; i >= 0; i--) {
        const char = line.charAt(i);
        if (char === " ") {
            continue;
        };

        if (char.match("[^\\w\\s\\:]") && start_collect) {
            break;
        };

        if (start_collect) {
            word = char + word;
        }
        if (char === "(") {
            start_collect = true;
        };
    }

    return word.trim().replace(":", "");
}


export function get(index: number, which: number): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }

    if (which > 2) { return "get(col_num, key = 1 or value = 2)"; }

    const document = editor.document;

    const lines = document.getText().slice(0, index).split("\n");

    const line = document.lineAt(lines.length - 1).text.trim();

    if (!line.includes(":")) { return ""; }

    const indexOfFirstColon = line.indexOf(":");
    if (indexOfFirstColon !== -1) {
        let stringWithoutFirstColon = null;
        if (which === 1) {
            return line.slice(0, indexOfFirstColon).trim();
        }
        if (which === 2) {
            return line.slice(indexOfFirstColon + 1).trim();
        }
    }
    return line.split(":")[1];
}


export function get_attr(line: string, which: number): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }

    if (which > 2) { return "get(line text, key = 1 or value = 2)"; }

    if (!line.includes(":")) { return ""; }

    const indexOfFirstColon = line.indexOf(":");
    if (indexOfFirstColon !== -1) {
        let stringWithoutFirstColon = null;
        if (which === 1) {
            return line.slice(0, indexOfFirstColon).trim();
        }
        if (which === 2) {
            return line.slice(indexOfFirstColon + 1).trim();
        }
    }
    return line.split(":")[1].trim();
}


export function get_attribue_key(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }
    return get(getCursorIndex(), 1);
}


export function get_attribue_value(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }
    return get(getCursorIndex(), 2);
}

export function get_parent_of_child(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }



    const document = editor.document;
    const line_index = get_current_line_index();
    const line = document.lineAt(line_index).text;
    const current_tabs = get_tabs_number(line);

    if (current_tabs === 0) { return ""; }

    const tabs_number = get_default_tabs_number();
    console.log("default tab number:", tabs_number);

    if (tabs_number <= 0) {
        console.error("tabs number not determined !");
        return "";
    }



    for (let i = line_index; i >= 0; i--) {

        const line_loop = document.lineAt(i).text;

        const tabs_num = get_tabs_number(line_loop);

        if (tabs_num === current_tabs) {
            continue;
        }

        if (tabs_num === (current_tabs - tabs_number)) {
            if (line_loop.includes("@")) {
                const parent = line_loop.match("@\\w+");
                if (parent) {
                    return parent[0].replace("@", "");
                }
            } else if (line_loop.includes("<") && line_loop.includes(">")) {
                const parent = line_loop.match("<\\w+>");
                if (parent) {
                    return parent[0].replace(">", "").replace("<", "");
                }
            } else {
                return get_attr(line_loop, 1);
            }
        }

    }

    return "";
}

export function get_default_tabs_number(): number {
    const text = get_text().trim();
    const lines = text.split("\n");
    if (lines.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const tabs_num = get_tabs_number(line);
            console.log("tabs num", tabs_num, line);

            if (tabs_num === 0) { continue; }
            if (line.trim().length === 0) { continue; }
            if (line.trim().startsWith("#")) { continue; }
            return tabs_num;
        }
    }
    return -1;
}

export function get_tabs_number(line: string): number {
    if (line.trim() === "") { return 0; }
    const spaces = line.match("^\\s+");
    if (spaces) {
        return spaces[0].length;
    }
    return 0;
}

export function get_text(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }
    return editor.document.getText();
}

export function get_line_text() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return "";
    }
    return editor.document.lineAt(get_current_line_index()).text;
}

export function getCursorIndex(): number {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return -1;
    }

    if (editor) {
        const document = editor.document;
        const position = editor.selection.active;

        // Calculate the character offset from the beginning of the document
        const offset = document.offsetAt(position);

        return offset;
    } else {
    }
    return -1;
}


export function get_current_line_index(): number {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return -1;
    }
    const document = editor.document;
    const selection = editor.selection;
    const currentLineIndex = selection.active.line;
    return currentLineIndex;
}

export function get_cursor_index_in_line(): number {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor found.');
        return -1;
    }
    const document = editor.document;
    const selection = editor.selection;
    const currentLineIndex = selection.active.character;
    return currentLineIndex;
}


export function get_hover_for(searchTerm: string): string {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const jsonData: any = JSON.parse(data);


        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const item = jsonData[key];
                const type = item["type"];
                let prefix = item["name"];

                if (isInsideComment()) {
                    //prefix = item.prefix;
                }

                if (prefix === searchTerm.trim()) {
                    return item["name"] + " is a " + item["type"] + ". " + item["help"].trim();
                }

            }
        }
    } catch (err) {

    }
    return "";
}



class types {
    static readonly widgets = ["WidgetMetaclass"];
    static readonly classes = ["Class", "ABCMeta", "Pattern", "Interpolation", "ColorProperty", "VariableListProperty", "NoneType"]
    static readonly parenths = ["method_descriptor", "tuple", "function", "getset_descriptor"];
    static readonly numbers = ["int", "float", "NumericProperty", "BoundedNumericProperty"];
    static readonly lists = ["list", "ListProperty", "ReferenceListProperty"];
    static readonly booleans = ["BooleanProperty", "bool"];
    static readonly dicts_and_set = ["dict", "DictProperty", "set"];
    static readonly strings = ["str", "StringProperty", "OptionProperty"];
    static readonly others = ["property", "member_descriptor", "ObjectProperty"];
    static readonly not_use = ["_abc_data", "cython_function_or_method", "module", "builtin_function_or_method", "defaultdict", "object", "AliasProperty"];
}