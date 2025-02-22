import { describe, it, expect } from 'vitest';
import { extractNameRequest } from '../../utils/parsers/nameParser.js';

describe('extractNameRequest', () => {
  it('should extract API name from valid input', () => {
    const input = '# @name FetchJiraIssue';
    const expectedOutput = 'FetchJiraIssue';
    expect(extractNameRequest(input)).toEqual(expectedOutput);
  });

  it('should return null if @name is missing', () => {
    const input = 'GET /jira/issues/fetch';
    expect(extractNameRequest(input)).toBeNull();
  });

  it('should handle extra spaces in input', () => {
    const input = '# @name   FetchJiraIssue';
    const expectedOutput = 'FetchJiraIssue';
    expect(extractNameRequest(input)).toEqual(expectedOutput);
  });

  it('should return null for completely invalid input', () => {
    const invalidCases = [
      '',
      'random text',
      '@name FetchJiraIssue', // Missing #
      '# name FetchJiraIssue', // Missing @
      '# @nameFetchJiraIssue' // Missing space after @name
    ];
    invalidCases.forEach(input => {
      expect(extractNameRequest(input)).toBeNull();
    });
  });

  it('should handle multiple lines correctly', () => {
    const input = `Some text before\n# @name MyApiName`;
    const expectedOutput = 'MyApiName';
    expect(extractNameRequest(input)).toEqual(expectedOutput);
  });
});