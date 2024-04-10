import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export function listFilesInPath(folderPath: string): string[] {
    try {
        const files = fs.readdirSync(folderPath);
        return files;
    } catch (err) {
        return [];
    }
}

