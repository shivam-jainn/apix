import * as vscode from 'vscode';

export interface Config {
  codLens: {
    send: boolean;
    generate: boolean;
    showVariables: boolean;
  };
}

export function getConfig(): Config {
  const apixConfig = vscode.workspace.getConfiguration('apix');
  return {
    codLens: {
      send: apixConfig.get('codLens.send', true),
      generate: apixConfig.get('codLens.generate', true),
      showVariables: apixConfig.get('codLens.showVariables', true),
    },
  };
}