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
exports.CustomPanel = exports.showErrorMessage = exports.showMessage = void 0;
const vscode = __importStar(require("vscode"));
const panel = undefined;
function showMessage(message) {
    vscode.window.showInformationMessage(message);
}
exports.showMessage = showMessage;
function showErrorMessage(message) {
    vscode.window.showErrorMessage(message);
}
exports.showErrorMessage = showErrorMessage;
class CustomPanel {
    static currentPanel;
    static viewType = 'customPanel';
    _panel;
    _extensionUri;
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's HTML content
        this._panel.webview.html = this._getHtmlForWebview();
    }
    static createOrShow(extensionUri) {
        const column = vscode.ViewColumn.Two;
        // If panel already exists, show it; otherwise, create a new panel
        if (CustomPanel.currentPanel) {
            CustomPanel.currentPanel._panel.reveal(column);
        }
        else {
            const panel = vscode.window.createWebviewPanel('myPanel', // Panel ID (unique)
            'My Custom Panel', // Panel title
            vscode.ViewColumn.Beside, // Reveal in active column (keeps editor focus)
            {
                enableScripts: true, // Allow scripts in the panel
                retainContextWhenHidden: true,
            });
            CustomPanel.currentPanel = new CustomPanel(panel, extensionUri);
        }
    }
    _getHtmlForWebview() {
        // Load your custom HTML content here
        return `<html><body><h1>Hello, World!</h1></body></html>`;
    }
}
exports.CustomPanel = CustomPanel;
//# sourceMappingURL=windowutil.js.map