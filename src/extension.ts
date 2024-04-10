import * as vscode from 'vscode';
import { get_selected_text, init_textutils, get_cursor_index, get_cursor_start_end_offsets } from './textutils';
import { searchKvKeywords, searchKivyKeywords, isInsideComment, isInsideString } from './textutils';

import * as w from "./windowutil";

export function activate(context: vscode.ExtensionContext) {


    let disposable = vscode.commands.registerCommand('kivy-kv-helper.helloWorld', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }


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
            }
        }
    );


     function activate(context: vscode.ExtensionContext) {
        // Define the language configuration to enable quick suggestions for strings
        const languageConfiguration: vscode.LanguageConfiguration = {
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\<\>\/\?\s]+)/g,
            autoClosingPairs: [
                { open: '"', close: '"' },
                { open: "b", close: "b" }
            ]
        };
        // Set the language configuration for the desired language (e.g., Python)
        vscode.languages.setLanguageConfiguration('python', languageConfiguration);
    }
    
        
    
        const config = vscode.workspace.getConfiguration();

        config.update('editor.quickSuggestions', {
            other: true,
            comments: true,
            strings: true
        }, vscode.ConfigurationTarget.Global);


        



    init_textutils();



    context.subscriptions.push(completionProvider);
    context.subscriptions.push(disposable);

}

export function deactivate() {
}
