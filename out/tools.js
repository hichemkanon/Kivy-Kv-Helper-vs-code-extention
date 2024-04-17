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
exports.sleep = exports.getPlatform = exports.is_pip_package_installed = exports.executeCmd = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function executeCmd(cmd) {
    // Get the active terminal or create a new one if none is active
    const activeTerminal = vscode.window.createTerminal('Kv Viewer');
    // Show the terminal
    activeTerminal.show();
    // Send the command to the terminal
    activeTerminal.sendText(cmd);
}
exports.executeCmd = executeCmd;
function is_pip_package_installed(package_name) {
    const pythonScript = path.join(path.dirname(__dirname), "tools/checkpackage.py"); // Path to the Python script
    const pythonProcess = (0, child_process_1.spawn)('python', [pythonScript, package_name]);
    let packagePath = '';
    pythonProcess.stdout.on('data', (data) => {
        packagePath = data.toString();
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error("error", data.toString() || "error");
    });
    pythonProcess.on('close', (code) => {
        if (code === 0) {
        }
        else {
        }
    });
    return packagePath.includes("is installed.");
}
exports.is_pip_package_installed = is_pip_package_installed;
function getPlatform() {
    if (process.platform === "win32") {
        return "windows";
    }
    else if (process.platform === "linux") {
        return "linux";
    }
    else if (process.platform === "darwin") {
        return "mac";
    }
    else {
        return "Unknown";
    }
}
exports.getPlatform = getPlatform;
async function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000); // Convert seconds to milliseconds
    });
}
exports.sleep = sleep;
//# sourceMappingURL=tools.js.map