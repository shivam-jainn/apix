import { describe, it, expect } from 'vitest';
import { extractApiName } from '../../utils/parsers/nameParser.js';

describe('extractApiName', () => {
  it('should extract API name from valid input', () => {
    const input = '#@name "FetchJiraIssue"\n"jira/issues/fetch"';
    const expectedOutput = 'FetchJiraIssue';
    expect(extractApiName(input)).toEqual(expectedOutput);
  });

  it('should return null if @name is missing', () => {
    const input = '"jira/issues/fetch"';
    expect(extractApiName(input)).toBeNull();
  });

  it('should handle extra spaces in input', () => {
    const input = '#@   name   "FetchJiraIssue"  \n  "jira/issues/fetch"  ';
    const expectedOutput = 'FetchJiraIssue';
    expect(extractApiName(input)).toEqual(expectedOutput);
  });

  it('should return null for completely invalid input', () => {
    const invalidCases = [
      '',
      'random text',
      '@name FetchJiraIssue', // Missing quotes
      '@name "FetchJiraIssue"', // Missing #
      'name "FetchJiraIssue"', // Missing @
    ];
    invalidCases.forEach(input => {
      expect(extractApiName(input)).toBeNull();
    });
  });

  it('should handle multiple lines correctly', () => {
    const input = `Some text before\n#@name "MyApiName"\n"some/endpoint"`;
    const expectedOutput = 'MyApiName';
    expect(extractApiName(input)).toEqual(expectedOutput);
  });
});