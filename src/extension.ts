import * as vscode from 'vscode';
import { get_selected_text, init_textutils, get_cursor_index, get_cursor_start_end_offsets } from './textutils';
import { searchKvKeywords, searchKivyKeywords, isInsideComment, isInsideStringKv } from './textutils';
import {move_cursor_back, handle_insertion_text, get_hover_for } from './textutils';


import * as w from "./windowutil";

export function activate(context: vscode.ExtensionContext) {



    const disposable = vscode.commands.registerTextEditorCommand('extension.handleCompletionInsertion', (textEditor, edit, completionItem) => {
        handle_insertion_text(completionItem);
    });



    const completionProvider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file' },
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

                const wordRange = document.getWordRangeAtPosition(position);
                const currentWord = document.getText(wordRange);
                const fileExtension = document.fileName.split(".").pop()?.toLowerCase();

                if (fileExtension === "py") {
                    if (wordRange) {
                        const suggestions = searchKivyKeywords(currentWord);
                        return suggestions;
                    }
                } else if (fileExtension === "kv") {
                    if (wordRange) {
                        const suggestions = searchKvKeywords(currentWord);
                        return suggestions;
                    }
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

    context.subscriptions.push(
        vscode.languages.registerHoverProvider({ scheme: 'file' }, {
            provideHover(document, position, token) {
                // Logic to provide hover information
                const hoveredWord = document.getText(document.getWordRangeAtPosition(position));
                const hover = get_hover_for(hoveredWord);
                if (hover.trim() == ""){
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






    init_textutils(context);


    context.subscriptions.push(completionProvider);
    context.subscriptions.push(disposable);


}

export function deactivate() {
}



