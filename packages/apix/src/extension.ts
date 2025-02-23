import * as vscode from "vscode";
const { exec } = require("child_process");
import { ApixCodeLensProvider } from "./codelens";

let responsePanel: vscode.WebviewPanel | undefined;

function getWebviewContent(response: string): string {
  let formattedResponse = response;
  try {
    // Only try to parse if it looks like JSON
    if (response.trim().startsWith("{") || response.trim().startsWith("[")) {
      const jsonData = JSON.parse(response);
      formattedResponse = JSON.stringify(jsonData, null, 2);
    }
  } catch {
    // If parsing fails, use the original response
    formattedResponse = response;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            padding: 10px; 
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-editor-background);
          }
          pre { 
            background-color: var(--vscode-editor-background);
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            margin: 0;
          }
          .json-response {
            font-size: 14px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <pre class="json-response">${formattedResponse}</pre>
      </body>
    </html>
  `;
}

export function activate(context: vscode.ExtensionContext) {
  console.log("APIX extension activated!");

  const codeLensProvider = new ApixCodeLensProvider();
  const codeLensRegistration = vscode.languages.registerCodeLensProvider(
    { language: "apix" },
    codeLensProvider
  );
  context.subscriptions.push(codeLensRegistration);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "apix.executeRequest",
      async (uri: vscode.Uri, line: number) => {
        try {
          const document = await vscode.workspace.openTextDocument(uri);
          const lineText = document.lineAt(line).text.trim();

          const methodMatch = lineText.match(/^(GET|POST|WS)\s+(.*)/i);
          if (!methodMatch) {
            vscode.window.showErrorMessage(
              "Invalid API request format on this line."
            );
            return;
          }

          const method = methodMatch[1].toUpperCase();
          const url = methodMatch[2].trim();
          const timeout = 10;

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

          // Updated curl command with silent flag and better output handling
          exec(
            `curl -X ${method} -s -S --max-time ${timeout} "${url}"`,
            { maxBuffer: 1024 * 1024 }, // Increase buffer size for larger responses
            (error: any, stdout: string, stderr: string) => {
              if (error || stderr) {
                const message = error ? error.message : stderr;
                if (responsePanel) {
                  responsePanel.webview.html = getWebviewContent(
                    `Request failed: ${message}`
                  );
                }
                vscode.window.showErrorMessage(`Request failed: ${message}`);
              } else {
                if (responsePanel) {
                  // Clean and format the response
                  const cleanResponse = stdout.trim();
                  responsePanel.webview.html = getWebviewContent(cleanResponse);
                }
                vscode.window.showInformationMessage("Request successful!");
              }
            }
          );
        } catch (error) {
          console.error("Command handler error:", error);
          vscode.window.showErrorMessage(
            `Error executing API request: ${error}`
          );
        }
      }
    )
  );
}

export function deactivate() {
  if (responsePanel) {
    responsePanel.dispose();
  }
}
