import * as vscode from 'vscode';
const { exec } = require('child_process');
import { ApixCodeLensProvider } from './codelens';


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

  // Parse from the request line
  for (let i = line; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    
    // Find method and URL
    if (!method && !url) {
      const methodMatch = currentLine.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.*)/i);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
        url = methodMatch[2].trim();
        continue;
      }
    }

    // Parse headers
    const headerMatch = currentLine.match(/^([^:]+):\s*(.*)$/);
    if (headerMatch && !inBody) {
      headers[headerMatch[1].trim()] = headerMatch[2].trim();
      continue;
    }

    // Detect JSON body
    if (currentLine.startsWith('{') || currentLine.startsWith('[')) {
      inBody = true;
    }

    if (inBody) {
      body += currentLine + '\n';
    }

    // Stop parsing at empty line or next request
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

  // Add headers
  Object.entries(request.headers).forEach(([key, value]) => {
    command += ` -H "${key}: ${value}"`;
  });

  // Add body for POST/PUT/PATCH
  if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
    command += ` -d '${request.body}'`;
  }

  command += ` "${request.url}"`;
  return command;
}


export function activate(context: vscode.ExtensionContext) {
  console.log('APIX extension activated!');

  // Register Code Lens provider
  const codeLensProvider = new ApixCodeLensProvider();
  const codeLensRegistration = vscode.languages.registerCodeLensProvider(
    { language: 'apix' },
    codeLensProvider
  );
  context.subscriptions.push(codeLensRegistration);

  // Register API execution command
  context.subscriptions.push(
<<<<<<< Updated upstream
    vscode.commands.registerCommand('apix.executeRequest', async (uri: vscode.Uri, line: number) => {
      try {
        console.log("ExecuteRequest command triggered for:", uri.fsPath, "line:", line);
  
        const document = await vscode.workspace.openTextDocument(uri);
        console.log("Document opened:", document.fileName);
        const lineText = document.lineAt(line).text.trim();
        console.log("Line content:", lineText);
  
        const methodMatch = lineText.match(/^(GET|POST|WS)\s+(.*)/i);
        if (!methodMatch) {
          console.error("Invalid API request format on line:", line);
          vscode.window.showErrorMessage('Invalid API request format on this line.');
          return;
=======
    vscode.commands.registerCommand(
      "apix.executeRequest",
      async (uri: vscode.Uri, line: number) => {
        try {
          const document = await vscode.workspace.openTextDocument(uri);
          const request = parseRequestBlock(document, line);

          if (!request.method || !request.url) {
            vscode.window.showErrorMessage("Invalid API request format.");
            return;
          }

          // Create or show response panel
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
          exec(
            curlCommand,
            { maxBuffer: 1024 * 1024 },
            (error: any, stdout: string, stderr: string) => {
              if (error) {
                const errorMessage = `Request failed (${error.code}): ${error.message}`;
                if (responsePanel) {
                  responsePanel.webview.html = getWebviewContent(errorMessage);
                }
                vscode.window.showErrorMessage(errorMessage);
                return;
              }

              if (stderr) {
                console.log('CURL stderr:', stderr); // For debugging
              }

              if (responsePanel) {
                const cleanResponse = stdout.trim();
                responsePanel.webview.html = getWebviewContent(cleanResponse);
              }
              vscode.window.showInformationMessage("Request successful!");
            }
          );
        } catch (error) {
          console.error("Command handler error:", error);
          vscode.window.showErrorMessage(
            `Error executing API request: ${error}`
          );
>>>>>>> Stashed changes
        }
  
        const method = methodMatch[1].toUpperCase();
        const url = methodMatch[2].trim();
        console.log("URL extracted:", url);
  
        const timeout = 10;
        console.log("Executing curl command:", `curl -X ${method} --max-time ${timeout} "${url}"`);
  
        exec(
          `curl -X ${method} --max-time ${timeout} "${url}"`,
          (error: any, stdout: string, stderr: string) => {
            console.log("Curl command response:", stdout, stderr);
            if (error || stderr) {
              let message = 'Request failed.';
              if (error) message += ` Error: ${error.message}`;
              if (stderr) message += `\nStderr: ${stderr}`;
              vscode.window.showErrorMessage(message);
            } else {
              vscode.window.showInformationMessage(
                `Request successful!\nResponse: ${stdout.trim() || 'No response content'}`,
                { modal: true }
              );
            }
          }
        );
      } catch (error) {
        console.error("Command handler error:", error);
        vscode.window.showErrorMessage(`Error executing API request: ${error}`);
      }
    })
  );
}

<<<<<<< Updated upstream
export function deactivate() { }
=======
export function deactivate() {
  if (responsePanel) {
    responsePanel.dispose();
  }
}
>>>>>>> Stashed changes
