import * as vscode from 'vscode';
const { exec } = require('child_process');
import { ApixCodeLensProvider } from './codelens';

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

export function deactivate() { }