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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const textutils_1 = require("./textutils");
const textutils_2 = require("./textutils");
const textutils_3 = require("./textutils");
const textutils_4 = require("./textutils");
const tools = __importStar(require("./tools"));
const path_1 = __importDefault(require("path"));
let customProvider;
let defaultProvider;
function activate(context) {
    const disposable = vscode.commands.registerTextEditorCommand('extension.handleCompletionInsertion', (textEditor, edit, completionItem) => {
        (0, textutils_3.handle_insertion_text)(completionItem);
    });
    vscode.workspace.onDidChangeTextDocument((event) => {
        (0, textutils_3.handleTextDocumentChange)(event);
        if (!defaultProvider) {
            set_up_suggestions(context);
        }
    });
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme: 'file' }, {
        provideHover(document, position, token) {
            // Logic to provide hover information
            const hoveredWord = document.getText(document.getWordRangeAtPosition(position));
            const hover = (0, textutils_3.get_hover_for)(hoveredWord);
            if (hover.trim() === "") {
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
    let runKvCmd = vscode.commands.registerCommand('extension.runKvFile', () => {
        vscode.window.showInformationMessage('Running .kv file...');
        run_kv();
    });
    let show_suggestions = vscode.commands.registerCommand('extension.displaySuggestions', () => {
        show_up_cust_suggestions(context);
    });
    (0, textutils_1.init_textutils)(context);
    exports.activate = function () {
        console.log(`I am active!`);
        vscode.commands.registerCommand('type', (args) => {
            console.log(`type with args`, args);
            return vscode.commands.executeCommand('default:type', args);
        });
    };
    context.subscriptions.push(disposable);
    context.subscriptions.push(runKvCmd);
    context.subscriptions.push(show_suggestions);
}
exports.activate = activate;
function run_kv() {
    const editor = vscode.window.activeTextEditor;
    let script = path_1.default.join(path_1.default.dirname(__dirname), "tools/kvviewer.py");
    if ((0, textutils_4.kivymd_exist)()) {
        script = path_1.default.join(path_1.default.dirname(__dirname), "tools/kvmdviewer.py");
    }
    if (editor && editor.document.languageId === 'kv') {
        const filePath = "'" + editor.document.uri.fsPath + "'";
        if (tools.is_pip_package_installed("watchdog")) {
            tools.executeCmd("python " + script + " " + filePath);
        }
        else {
            tools.executeCmd("pip install watchdog");
            tools.executeCmd("python " + script + " " + filePath);
        }
    }
}
function set_up_suggestions(context) {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
    }
    defaultProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file' }, {
        provideCompletionItems(document, position) {
            const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
            if (fileExtension === "kv") {
                const suggestions = (0, textutils_2.searchKvKeywords)();
                return suggestions;
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
    context.subscriptions.push(defaultProvider);
}
function handle_enter_press(context) {
}
function show_up_cust_suggestions(context) {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
        defaultProvider = undefined;
    }
    const sugs = (0, textutils_3.get_suggestions)();
    // Register a new completion provider with the updated custom completion items
    customProvider = vscode.languages.registerCompletionItemProvider({ scheme: 'file' }, {
        provideCompletionItems(document, position) {
            const fileExtension = document.fileName.split(".").pop()?.toLowerCase();
            if (fileExtension === "kv") {
                const suggestions = (0, textutils_3.get_suggestions)();
                return suggestions;
            }
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
    // Trigger the suggestion panel
    if (sugs.length > 0) {
        context.subscriptions.push(customProvider);
        vscode.commands.executeCommand('editor.action.triggerSuggest');
    }
    else {
        vscode.window.showInformationMessage('No suggestions found');
        set_up_suggestions(context);
    }
}
function deactivate() {
    if (defaultProvider) {
        defaultProvider.dispose();
        defaultProvider = undefined;
    }
    if (customProvider) {
        customProvider.dispose();
        defaultProvider = undefined;
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map