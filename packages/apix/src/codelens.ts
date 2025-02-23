import * as vscode from 'vscode';
import { getConfig } from './config';

export class ApixCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    const config = getConfig();

    for (let line = 0; line < document.lineCount; line++) {
      const lineText = document.lineAt(line).text.trim();

      if (lineText.startsWith('GET') || lineText.startsWith('POST') || lineText.startsWith('WS')) {
        const range = document.lineAt(line).range;
        codeLenses.push(
            new vscode.CodeLens(
              range,
              { 
                command: 'apix.executeRequest', 
                title: 'Execute',
                arguments: [document.uri, line]
              }
            )
        );

        if (config.codLens.generate) {
          codeLenses.push(
              new vscode.CodeLens(
                new vscode.Range(line + 1, 0, line + 1, 0),
                { 
                  command: 'apix.generateCode', 
                  title: 'Generate Code'
                }
              )
          );
        }
      }

      if (lineText.startsWith('env =') && config.codLens.showVariables) {
        codeLenses.push(
            new vscode.CodeLens(
              document.lineAt(line).range,
              { 
                command: 'apix.showVariables', 
                title: 'Show Variables'
              }
            )
        );
      }
    }

    return codeLenses;
  }

  resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.CodeLens {
    return codeLens;
  }
}