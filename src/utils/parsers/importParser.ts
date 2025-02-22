export function importParser(input: string) {
    const importRegex = /^\s*import\s+(?:(?<defaultImport>[a-zA-Z_$][\w$]*)\s*(?:,\s*)?)?(?:(?:\*\s+as\s+(?<wildcardImport>[a-zA-Z_$][\w$]*))|\{\s*(?<namedImports>[^\}]+)\s*\})?\s+from\s+["'](?<module>[^"']+)["']\s*;?\s*(\/\/.*)?$/;
    const match = input.match(importRegex);
    if (!match || !match.groups) return null;
  
    const { defaultImport, wildcardImport, namedImports, module } = match.groups;
    const imports: string[] = [];
  
    if (defaultImport) {
      imports.push(defaultImport);
    }
  
    if (wildcardImport) {
      imports.push(wildcardImport);
    }
  
    if (namedImports) {
      const cleanedImports = namedImports
        .split(',')
        .map(imp => imp.trim().split(/\s+as\s+/).pop())
        .filter((imp): imp is string => !!imp);
      imports.push(...cleanedImports);
    }
  
    return {
      type: 'Import',
      module,
      imports,
      ...(defaultImport ? { default: true } : {}),
      ...(wildcardImport ? { wildcard: true } : {}),
    };
  }
  