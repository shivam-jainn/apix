import path from "path";
import { parseConfig } from "./configParser.js";

const config = parseConfig("apix.config.json");

function resolveAlias(modulePath: string): string {
  if (modulePath.startsWith("@/")) {
    return "./" + path.join(config.baseUrl, modulePath.substring(2));
  }
  for (const alias in config.paths) {
    const aliasKey = alias.replace("/*", "");
    if (modulePath.startsWith(aliasKey)) {
      const resolvedPart = config.paths[alias][0].replace("/*", "");
      const relativePath = modulePath.replace(aliasKey, resolvedPart);
      return "./" + path.join(config.baseUrl, relativePath);
    }
  }
  return modulePath;
}

export function importParser(input: string) {
  const importRegex =
    /^\s*import\s+(?:(?<defaultImport>[a-zA-Z_$][\w$]*)\s*(?:,\s*)?)?(?:(?<wildcardImport>\* as [a-zA-Z_$][\w$]*)|\{(?<namedImports>[^}]+)\})?\s+from\s+["'](?<module>[^"']+)["']\s*;?\s*(\/\/.*)?$/;
  
  const match = input.match(importRegex);
  if (!match || !match.groups) return null;
  
  const { defaultImport, wildcardImport, namedImports, module: modulePath } = match.groups;
  const resolvedModulePath = resolveAlias(modulePath);
  
  const imports: string[] = [];
  if (defaultImport) {
    imports.push(defaultImport);
  }
  
  if (namedImports) {
    namedImports.split(",").forEach((imp) => {
      const trimmed = imp.trim();
      const aliasMatch = trimmed.match(/^([a-zA-Z_$][\w$]*)\s+as\s+([a-zA-Z_$][\w$]*)$/);
      if (aliasMatch) {
        // Use the alias name
        imports.push(aliasMatch[2]);
      } else if (trimmed !== "") {
        imports.push(trimmed);
      }
    });
  }
  
  if (wildcardImport) {
    // Expect format: "* as alias"
    const parts = wildcardImport.split(" ");
    const aliasName = parts[2];
    return { type: "Import", module: resolvedModulePath, imports: [aliasName], wildcard: true };
  }
  
  const result: any = { type: "Import", module: resolvedModulePath, imports };
  if (defaultImport) {
    result.default = true;
  }
  return result;
}
