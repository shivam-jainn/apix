import { describe, it, expect } from 'vitest';
import basicAuth from '../../utils/authentication/basic.js';

describe('basicAuth', () => {
  it('should return correct Basic Authorization header for valid credentials', () => {
    const username = 'testuser';
    const password = 'testpass';
    const expectedToken = Buffer.from(`${username}:${password}`).toString('base64');
    const result = basicAuth(username, password);
    expect(result).toEqual({
      Authorization: `Basic ${expectedToken}`
    });
  });

  it('should return correct header when username and password are empty', () => {
    const username = '';
    const password = '';
    const expectedToken = Buffer.from(`${username}:${password}`).toString('base64');
    const result = basicAuth(username, password);
    expect(result).toEqual({
      Authorization: `Basic ${expectedToken}`
    });
  });

  it('should handle special characters correctly', () => {
    const username = 'user:with:colon';
    const password = 'p@$$w0rd!';
    const expectedToken = Buffer.from(`${username}:${password}`).toString('base64');
    const result = basicAuth(username, password);
    expect(result).toEqual({
      Authorization: `Basic ${expectedToken}`
    });
  });

  it('should not include newline characters in the Authorization header', () => {
    const username = 'user\nwithNewline';
    const password = 'pass\r\nwithNewline';
    const result = basicAuth(username, password);
    expect(result.Authorization).not.toMatch(/[\r\n]/);
  });

  // it('should handle injection attempts safely', () => {
  //   const username = 'admin\r\nX-Injection: value';
  //   const password = 'password\r\nAnotherHeader: value';
  //   const result = basicAuth(username, password);
  //   expect(result.Authorization).toMatch(/^Basic [A-Za-z0-9+/]+=*$/);
  //   const decoded = Buffer.from(result.Authorization.split(' ')[1], 'base64').toString();
  //   expect(decoded).toBe(`${username.replace(/\r|\n/g, '')}:${password.replace(/\r|\n/g, '')}`);
  // });
});
