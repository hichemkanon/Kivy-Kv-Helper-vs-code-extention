import * as vscode from "vscode";



export function showMessage(message: string) {
    vscode.window.showInformationMessage(message);
}

export function showErrorMessage(message: string) {
    vscode.window.showErrorMessage(message);
}