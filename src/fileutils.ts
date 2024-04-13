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

export function saveStringToFile(content: string, filePath: string): void {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('String saved to file successfully.');
      }
    });
  } 