import * as vscode from 'vscode';
import * as textutils from './textutils';
import * as ed from './editor';
import { kivymd_exist, get_all_sugestions} from './textutils';
import * as w from "./windowutil";
import * as tools from "./tools";
import path from 'path';

let customProvider: vscode.Disposable | undefined;
let defaultProvider: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {



    const disposable = vscode.commands.registerTextEditorCommand('extension.handleCompletionInsertion', (textEditor, edit, completionItem) => {
        textutils.handle_insertion_text(completionItem);
    });


    vscode.workspace.onDidChangeTextDocument((event) => {
        textutils.handleTextDocumentChange(event);
        if (!defaultProvider) {
            set_up_suggestions(context);
        }
    });


    context.subscriptions.push(
        vscode.languages.registerHoverProvider({ scheme: 'file' }, {
            provideHover(document, position, token) {
                // Logic to provide hover information
                const hoveredWord = document.getText(document.getWordRangeAtPosition(position));
                const hover = textutils.get_hover_for(hoveredWord);
                if (hover.trim() === "") {
                    return null;
                }
                return new vscode.Hover(hover);
            }
        })
    );





    const config = vscode.workspace.getConfiguration();

    config.update('editor.quickSuggestions', {
        other: true,
        comments: true,
        strings: true
    }, vscode.ConfigurationTarget.Global);



    let runKvCmd = vscode.commands.registerCommand('extension.runKvFile', () => {
        vscode.window.showInformationMessage('Running .kv file...');
        run_kv();
    });



    let show_suggestions = vscode.commands.registerCommand('extension.displaySuggestions', () => {
        show_up_cust_suggestions(context);
    });




    textutils.init_textutils(context);



    context.subscriptions.push(disposable);
    context.subscriptions.push(runKvCmd);
    context.subscriptions.push(show_suggestions);


}


function run_kv() {
    const editor = vscode.window.activeTextEditor;
    let script = "'" + path.join(path.dirname(__dirname), "tools/kvviewer.py") + "'";

    let cmd = "python3";

    if (tools.getPlatform() === "windows") {
        cmd = "python";
    }

    if (kivymd_exist()) {
        script = "'" + path.join(path.dirname(__dirname), "tools/kvmdviewer.py") + "'";
    }

    if (editor && editor.document.languageId === 'kv') {
        const filePath = "'" + editor.document.uri.fsPath + "'";

        tools.executeCmd(cmd + " " + script + " " + filePath);

    }
}




function set_up_suggestions(context: vscode.ExtensionContext) {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
    }
    defaultProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

                const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
                if (fileExtension === "kv") {
                    const suggestions = get_all_sugestions();
                    return suggestions;
                }

                return [];
            },
            resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
                item.command = {
                    command: 'extension.handleCompletionInsertion',
                    title: 'Handle Completion Insertion',
                    arguments: [item],
                };
                return item;
            }
        }
    );
    context.subscriptions.push(defaultProvider);
}


function handle_enter_press(context: vscode.ExtensionContext) {

}


function show_up_cust_suggestions(context: vscode.ExtensionContext) {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
        defaultProvider = undefined;
    }

    const sugs = textutils.get_suggestions();


    // Register a new completion provider with the updated custom completion items
    customProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file' }, {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
            if (fileExtension === "kv") {
                const suggestions = textutils.get_suggestions();
                return suggestions;
            }
        },
        resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
            item.command = {
                command: 'extension.handleCompletionInsertion',
                title: 'Handle Completion Insertion',
                arguments: [item],
            };
            return item;
        }
    }
    );

    // Trigger the suggestion panel
    if (sugs.length > 0) {
        context.subscriptions.push(customProvider);
        vscode.commands.executeCommand('editor.action.triggerSuggest');
    } else {
        vscode.window.showInformationMessage('No suggestions found');
        set_up_suggestions(context);
    }
}

export function deactivate() {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
        defaultProvider = undefined;
    }
}

