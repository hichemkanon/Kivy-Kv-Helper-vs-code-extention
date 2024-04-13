import * as vscode from "vscode";
import * as path from 'path';


const panel: vscode.WebviewPanel | undefined = undefined;


export function showMessage(message: string) {
    vscode.window.showInformationMessage(message);
}

export function showErrorMessage(message: string) {
    vscode.window.showErrorMessage(message);
}

export class CustomPanel {
    public static currentPanel: CustomPanel | undefined;
    public static readonly viewType = 'customPanel';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's HTML content
        this._panel.webview.html = this._getHtmlForWebview();
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.ViewColumn.Two;

        // If panel already exists, show it; otherwise, create a new panel
        if (CustomPanel.currentPanel) {
            CustomPanel.currentPanel._panel.reveal(column);
        } else {
            const panel = vscode.window.createWebviewPanel(
                'myPanel', // Panel ID (unique)
                'My Custom Panel', // Panel title
                vscode.ViewColumn.Beside, // Reveal in active column (keeps editor focus)
                {
                  enableScripts: true, // Allow scripts in the panel
                  retainContextWhenHidden: true,
                  
                },
              );
            

            CustomPanel.currentPanel = new CustomPanel(panel, extensionUri);
        }
    }

    private _getHtmlForWebview() {
        // Load your custom HTML content here
        return `<html><body><h1>Hello, World!</h1></body></html>`;
    }
}