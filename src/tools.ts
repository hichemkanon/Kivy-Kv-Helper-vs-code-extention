import * as vscode from 'vscode';
import * as path from 'path';
import { exec, spawn } from 'child_process';

export function executeCmd(cmd:string) {
        // Get the active terminal or create a new one if none is active
        const activeTerminal = vscode.window.createTerminal('Kv Viewer');
        // Show the terminal
        activeTerminal.show();
        // Send the command to the terminal
        activeTerminal.sendText(cmd);
}


export function is_pip_package_installed(package_name: string): boolean{


    const pythonScript = path.join(path.dirname(__dirname), "tools/checkpackage.py"); // Path to the Python script
    const pythonProcess = spawn('python', [pythonScript, package_name]);

    let packagePath = '';

    pythonProcess.stdout.on('data', (data) => {
        packagePath = data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error("error",data.toString() || "error");
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
        } else {
        }
    });
    return packagePath.includes("is installed.");
}

