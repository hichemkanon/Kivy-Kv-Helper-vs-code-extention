import * as vscode from 'vscode';

// Access custom settings
const customSettings = vscode.workspace.getConfiguration('typeScriptExtension.customSettings');

export const auto_indent = customSettings.get<boolean>('kvAutoIndent', true);
