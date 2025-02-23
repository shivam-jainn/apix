import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import { Env,loadEnv } from '../../utils/parsers/envParser';
const TEST_ENV_PATH = './test.env';

describe('Env class', () => {
  beforeEach(() => {
    // Create a temporary .env file
    const envContent = `
      # This is a comment
      FOO=bar
      SPACED_VALUE = hello world  
      QUOTED_VALUE="quoted text"
      SINGLE_QUOTED='single quoted'
      EMPTY_VALUE=
    `;

    fs.writeFileSync(TEST_ENV_PATH, envContent);
  });

  afterEach(() => {
    // Cleanup test env file
    fs.unlinkSync(TEST_ENV_PATH);
  });

  it('should load environment variables from file', () => {
    const env = new Env(TEST_ENV_PATH);
    expect(env.get('FOO')).toBe('bar');
    expect(env.get('SPACED_VALUE')).toBe('hello world');
  });

  it('should handle quoted values correctly', () => {
    const env = new Env(TEST_ENV_PATH);
    expect(env.get('QUOTED_VALUE')).toBe('quoted text');
    expect(env.get('SINGLE_QUOTED')).toBe('single quoted');
  });

  it('should handle empty values', () => {
    const env = new Env(TEST_ENV_PATH);
    expect(env.get('EMPTY_VALUE')).toBe('');
  });

  it('should ignore comments and empty lines', () => {
    const env = new Env(TEST_ENV_PATH);
    expect(env.get('# This is a comment')).toBeUndefined();
  });

  it('should return undefined for non-existent keys', () => {
    const env = new Env(TEST_ENV_PATH);
    expect(env.get('NON_EXISTENT')).toBeUndefined();
  });

  it('should load environment variables using loadEnv function', () => {
    const env = loadEnv(TEST_ENV_PATH);
    expect(env.get('FOO')).toBe('bar');
  });

  it('should handle missing .env file gracefully', () => {
    const missingPath = './missing.env';
    const env = new Env(missingPath);
    expect(env.get('FOO')).toBeUndefined();
  });
});
