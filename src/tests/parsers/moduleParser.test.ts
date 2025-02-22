import { describe, it, expect } from 'vitest';
import { extractModuleName } from '../../utils/parsers/moduleParser.js';

describe('extractModuleName', () => {
  it('should extract Module name from valid input', () => {
    const input = '@module JiraAPI';
    const expectedOutput = 'JiraAPI';
    expect(extractModuleName(input)).toEqual(expectedOutput);
  });

  it('should handle extra spaces in input', () => {
    const input = '@module   JiraAPI';
    const expectedOutput = 'JiraAPI';
    expect(extractModuleName(input)).toEqual(expectedOutput);
  });

  it('should return null for completely invalid input', () => {
    const invalidCases = [
      '',
      'random text',
      'module JiraAPI', // Missing @
      '@moduleJiraAPI' // Missing space after @module
    ];
    invalidCases.forEach(input => {
      expect(extractModuleName(input)).toBeNull();
    });
  });
});