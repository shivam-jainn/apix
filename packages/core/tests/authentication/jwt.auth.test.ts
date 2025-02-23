import { describe, expect, test } from "vitest";
import bearerAuth from "../../utils/authentication/bearerToken.js";

describe("Bearer Authentication Tests", () => {
  test("Returns correct Authorization header for a valid token", () => {
    expect(bearerAuth("abc123")).toEqual({ Authorization: "Bearer abc123" });
  });

  test("Throws error for empty token", () => {
    expect(() => bearerAuth("")).toThrowError("Token is required");
  });

  test("Trims spaces from token", () => {
    expect(bearerAuth("   abc123   ")).toEqual({ Authorization: "Bearer abc123" });
  });

  test("Throws error for whitespace-only token", () => {
    expect(() => bearerAuth("   ")).toThrowError("Token is required");
  });

  test("Handles special characters in token", () => {
    const specialToken = "@!$%^&*()";
    expect(bearerAuth(specialToken)).toEqual({ Authorization: `Bearer ${specialToken}` });
  });

  test("Throws error for null token", () => {
    expect(() => bearerAuth(null as unknown as string)).toThrowError("Token is required");
  });

  test("Throws error for undefined token", () => {
    expect(() => bearerAuth(undefined as unknown as string)).toThrowError("Token is required");
  });

  test("Handles long token", () => {
    const longToken = "a".repeat(5000);
    expect(bearerAuth(longToken)).toEqual({ Authorization: `Bearer ${longToken}` });
  });

  test("Throws error for extremely large token (potential DoS attack prevention)", () => {
    const hugeToken = "a".repeat(10_000_000); // 10MB token
    expect(() => bearerAuth(hugeToken)).toThrowError("Token is too large");
  });

  test("Handles numeric token as string", () => {
    expect(bearerAuth("123456")).toEqual({ Authorization: "Bearer 123456" });
  });

  test("Throws error for non-string numbers", () => {
    expect(() => bearerAuth(123456 as unknown as string)).toThrowError("Token must be a string");
  });

  test("Throws error for object as token", () => {
    expect(() => bearerAuth({ key: "value" } as unknown as string)).toThrowError("Token must be a string");
  });

  test("Throws error for array as token", () => {
    expect(() => bearerAuth(["token123"] as unknown as string)).toThrowError("Token must be a string");
  });

  test("Handles token with newline characters", () => {
    expect(() => bearerAuth("\nabc123\n")).toThrowError("Token contains invalid characters");
  });

  test("Handles token with carriage return", () => {
    expect(() => bearerAuth("\rabc123\r")).toThrowError("Token contains invalid characters");
  });

  test("Handles token with tab characters", () => {
    expect(() => bearerAuth("\tabc123\t")).toThrowError("Token contains invalid characters");
  });

  test("Throws error for token containing 'Bearer ' prefix (possible injection attempt)", () => {
    expect(() => bearerAuth("Bearer other_token")).toThrowError("Token must not contain 'Bearer ' prefix");
  });

  test("Handles Unicode characters in token", () => {
    const unicodeToken = "тест-токен"; // Russian word for "test token"
    expect(bearerAuth(unicodeToken)).toEqual({ Authorization: `Bearer ${unicodeToken}` });
  });

  test("Handles emoji in token", () => {
    const emojiToken = "🔑🔒";
    expect(bearerAuth(emojiToken)).toEqual({ Authorization: `Bearer ${emojiToken}` });
  });

  test("Throws error for control characters in token", () => {
    expect(() => bearerAuth("\x00\x01\x02")).toThrowError("Token contains invalid characters");
  });

  test("Handles JSON Web Token (JWT) format correctly", () => {
    const jwtToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    expect(bearerAuth(jwtToken)).toEqual({ Authorization: `Bearer ${jwtToken}` });
  });

  test("Throws error for non-string JWT format", () => {
    expect(() => bearerAuth(12345 as unknown as string)).toThrowError("Token must be a string");
  });

  test("Throws error for deeply nested token (potential prototype pollution attack)", () => {
    expect(() => bearerAuth((Object.create(null) as unknown) as string)).toThrowError("Token must be a string");
  });
});
