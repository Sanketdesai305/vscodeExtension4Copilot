// File: src/extension.ts
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('azureDevOps');
  const command = config.get<string>('command');
  const args = config.get<string[]>('args');
  const env = config.get<any>('env');

  console.log('[MCP EXTENSION] Activating...');

  if (!command || !args || !env) {
    vscode.window.showErrorMessage('❌ Missing azureDevOps configuration in settings.json');
    return;
  }

  console.log(`[MCP EXTENSION] Starting server: ${command} ${args.join(' ')}`);

  const serverOptions: ServerOptions = {
    command,
    args,
    options: {
      env: {
        ...process.env,
        ...env
      }
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: '*' }],
    synchronize: { configurationSection: 'azureDevOps' }
  };

  client = new LanguageClient(
    'sanketsMcpServer',
    'Sanket MCP Server',
    serverOptions,
    clientOptions
  );

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
          vscode.window.showInformationMessage(`✅ ${(result as { message: string }).message}`);
        } else {
          vscode.window.showInformationMessage('✅ Command executed, no message returned.');
        }
      } catch (err: any) {
        console.error('[MCP EXTENSION] Pipeline creation error:', err);
        vscode.window.showErrorMessage(`❌ Failed to create pipeline: ${err.message || err}`);
      }
    });

    context.subscriptions.push(disposable);
  } catch (error) {
    console.error('[MCP EXTENSION] Server startup error:', error);
    vscode.window.showErrorMessage('❌ Failed to start MCP server.');
  }
}

export function deactivate(): Thenable<void> | undefined {
  return client ? client.stop() : undefined;
}
