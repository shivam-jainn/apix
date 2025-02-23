import { describe, it, expect } from 'vitest';
import { importParser } from '../../utils/parsers/importParser.js';

describe('Import Parser', () => {
  it('should parse a valid named import statement', () => {
    const input = 'import { something } from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle default imports', () => {
    const input = 'import something from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'], default: true };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle multiple named imports', () => {
    const input = 'import { one, two } from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['one', 'two'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle named imports with aliases', () => {
    const input = 'import { one as first, two as second } from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['first', 'second'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle default and named imports together', () => {
    const input = 'import defaultExport, { named1, named2 } from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['defaultExport', 'named1', 'named2'], default: true };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle wildcard imports', () => {
    const input = 'import * as alias from "module";';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['alias'], wildcard: true };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle import statements with extra spaces', () => {
    const input = '  import   { something }   from   "module" ;  ';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle import statements with new lines', () => {
    const input = `import { 
      something 
    } from "module";`;
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle import statements using single quotes', () => {
    const input = "import { something } from 'module';";
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle import statements without semicolons', () => {
    const input = 'import { something } from "module"';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should return null for invalid import statements', () => {
    const invalidCases = [
      'invalid import statement',
      'import "module";', // No bindings
      'import something "module";', // Missing 'from'
      'import { something', // Incomplete
      'from "module";' // No import keyword
    ];
    invalidCases.forEach(input => {
      expect(importParser(input)).toBeNull();
    });
  });

  it('should handle import statements with comments', () => {
    const input = 'import { something } from "module"; // comment';
    const expectedOutput = { type: 'Import', module: 'module', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });

  it('should handle @ in paths for base path', ()=>{
    const input = 'import { something } from "@/tests/test_assets/github.apix";';
    const expectedOutput = { type: 'Import', module: './src/tests/test_assets/github.apix', imports: ['something'] };
    expect(importParser(input)).toEqual(expectedOutput);
  });
});
