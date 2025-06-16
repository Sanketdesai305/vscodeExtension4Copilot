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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// File: src/extension.ts
const vscode = __importStar(require("vscode"));
const node_1 = require("vscode-languageclient/node");
let client;
async function activate(context) {
    const config = vscode.workspace.getConfiguration('azureDevOps');
    const command = config.get('command');
    const args = config.get('args');
    const env = config.get('env');
    console.log('[MCP EXTENSION] Activating...');
    if (!command || !args || !env) {
        vscode.window.showErrorMessage('❌ Missing azureDevOps configuration in settings.json');
        return;
    }
    console.log(`[MCP EXTENSION] Starting server: ${command} ${args.join(' ')}`);
    const serverOptions = {
        command,
        args,
        options: {
            env: {
                ...process.env,
                ...env
            }
        }
    };
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: '*' }],
        synchronize: { configurationSection: 'azureDevOps' }
    };
    client = new node_1.LanguageClient('sanketsMcpServer', 'Sanket MCP Server', serverOptions, clientOptions);
    try {
        await client.start();
        console.log('[MCP EXTENSION] Language client started.');
        const disposable = vscode.commands.registerCommand('sanketMcp.create_pipeline', async () => {
            if (!client || !client.isRunning()) {
                vscode.window.showErrorMessage('❌ MCP Client is not running.');
                return;
            }
            try {
                const result = await client.sendRequest('workspace/executeCommand', {
                    command: 'create_pipeline'
                });
                if (result && typeof result === 'object' && 'message' in result) {
                    vscode.window.showInformationMessage(`✅ ${result.message}`);
                }
                else {
                    vscode.window.showInformationMessage('✅ Command executed, no message returned.');
                }
            }
            catch (err) {
                console.error('[MCP EXTENSION] Pipeline creation error:', err);
                vscode.window.showErrorMessage(`❌ Failed to create pipeline: ${err.message || err}`);
            }
        });
        context.subscriptions.push(disposable);
    }
    catch (error) {
        console.error('[MCP EXTENSION] Server startup error:', error);
        vscode.window.showErrorMessage('❌ Failed to start MCP server.');
    }
}
function deactivate() {
    return client ? client.stop() : undefined;
}
//# sourceMappingURL=extension.js.map