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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const textutils_1 = require("./textutils");
const textutils_2 = require("./textutils");
const textutils_3 = require("./textutils");
function activate(context) {
    const disposable = vscode.commands.registerTextEditorCommand('extension.handleCompletionInsertion', (textEditor, edit, completionItem) => {
        (0, textutils_3.handle_insertion_text)(completionItem);
    });
    const completionProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file' }, {
        provideCompletionItems(document, position) {
            const wordRange = document.getWordRangeAtPosition(position);
            const currentWord = document.getText(wordRange);
            const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
            if (fileExtension === "py") {
                if (wordRange) {
                    const suggestions = (0, textutils_2.searchKivyKeywords)(currentWord);
                    return suggestions;
                }
            }
            else if (fileExtension === "kv") {
                if (wordRange) {
                    const suggestions = (0, textutils_2.searchKvKeywords)(currentWord);
                    return suggestions;
                }
            }
            return [];
        },
        resolveCompletionItem(item, token) {
            item.command = {
                command: 'extension.handleCompletionInsertion',
                title: 'Handle Completion Insertion',
                arguments: [item],
            };
            return item;
        }
    });
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, {
        provideHover(document, position, token) {
            // Logic to provide hover information
            const hoveredWord = document.getText(document.getWordRangeAtPosition(position));
            const hover = (0, textutils_3.get_hover_for)(hoveredWord);
            if (hover.trim() == "") {
                return null;
            }
            return new vscode.Hover(hover);
        }
    }));
    const config = vscode.workspace.getConfiguration();
    config.update('editor.quickSuggestions', {
        other: true,
        comments: true,
        strings: true
    }, vscode.ConfigurationTarget.Global);
    (0, textutils_1.init_textutils)(context);
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map