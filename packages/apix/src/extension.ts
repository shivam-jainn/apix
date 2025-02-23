import * as vscode from 'vscode';
const { exec } = require('child_process');
import { ApixCodeLensProvider } from './codelens';

let responsePanel: vscode.WebviewPanel | undefined;

function parseRequestBlock(document: vscode.TextDocument, line: number): {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
} {
  const lines = document.getText().split('\n');
  let method = '';
  let url = '';
  let headers: Record<string, string> = {};
  let body = '';
  let inBody = false;

  for (let i = line; i < lines.length; i++) {
    const currentLine = lines[i].trim();

    if (!method && !url) {
      const methodMatch = currentLine.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.*)/i);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
        url = methodMatch[2].trim();
        continue;
      }
    }

    const headerMatch = currentLine.match(/^([^:]+):\s*(.*)$/);
    if (headerMatch && !inBody) {
      headers[headerMatch[1].trim()] = headerMatch[2].trim();
      continue;
    }

    if (currentLine.startsWith('{') || currentLine.startsWith('[')) {
      inBody = true;
    }

    if (inBody) {
      body += currentLine + '\n';
    }

    if (currentLine === '' || currentLine.startsWith('###')) {
      break;
    }
  }

  return { method, url, headers, body: body.trim() };
}

function buildCurlCommand(request: {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}): string {
  let command = `curl -X ${request.method} -s -S`;

  Object.entries(request.headers).forEach(([key, value]) => {
    command += ` -H "${key}: ${value}"`;
  });

  if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    command += ` -d '${request.body}'`;
  }

  command += ` "${request.url}"`;
  return command;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('APIX extension activated!');

  const codeLensProvider = new ApixCodeLensProvider();
  const codeLensRegistration = vscode.languages.registerCodeLensProvider(
    { language: 'apix' },
    codeLensProvider
  );
  context.subscriptions.push(codeLensRegistration);

  context.subscriptions.push(
    vscode.commands.registerCommand("apix.executeRequest", async (uri: vscode.Uri, line: number) => {
      try {
        const document = await vscode.workspace.openTextDocument(uri);
        const request = parseRequestBlock(document, line);

        if (!request.method || !request.url) {
          vscode.window.showErrorMessage("Invalid API request format.");
          return;
        }

        if (!responsePanel) {
          responsePanel = vscode.window.createWebviewPanel(
            "apiResponse",
            "API Response",
            vscode.ViewColumn.Beside,
            {
              enableScripts: true,
              retainContextWhenHidden: true,
            }
          );

          responsePanel.onDidDispose(() => {
            responsePanel = undefined;
          });
        }

        responsePanel.webview.html = getWebviewContent("Loading...");

        const curlCommand = buildCurlCommand(request);
        console.log("Executing curl command:", curlCommand);

        exec(curlCommand, { maxBuffer: 1024 * 1024 }, (error: any, stdout: string, stderr: string) => {
          if (error) {
            const errorMessage = `Request failed (${error.code}): ${error.message}`;
            if (responsePanel) {
              responsePanel.webview.html = getWebviewContent(errorMessage);
            }
            vscode.window.showErrorMessage(errorMessage);
            return;
          }

          if (stderr) {
            console.log('CURL stderr:', stderr);
          }

          if (responsePanel) {
            responsePanel.webview.html = getWebviewContent(stdout.trim());
          }
          vscode.window.showInformationMessage("Request successful!");
        });
      } catch (error) {
        console.error("Command handler error:", error);
        vscode.window.showErrorMessage(`Error executing API request: ${error}`);
      }
    })
  );
}

function getWebviewContent(response: string): string {
  return `
    <html>
      <body>
        <pre>${response}</pre>
      </body>
    </html>
  `;
}

export function deactivate() {
  if (responsePanel) {
    responsePanel.dispose();
  }
}
