import { describe, test, expect, beforeEach, afterEach } from "vitest";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(__dirname, ".env");

// Helper function to create a .env file dynamically
const setEnvFile = (content: any) => {
  fs.writeFileSync(ENV_PATH, content);
  // Override ensures reloading values for each test
  dotenv.config({ path: ENV_PATH, override: true });
};

describe("Environment Parser (dotenv) Tests", () => {
  beforeEach(() => {
    // Clear process.env before each test
    delete process.env.USERNAME;
    delete process.env.PASSWORD;
    delete process.env.Username;
    delete process.env.Password;

    if (fs.existsSync(ENV_PATH)) {
      fs.unlinkSync(ENV_PATH);
    }
  });

  afterEach(() => {
    // Cleanup after tests
    if (fs.existsSync(ENV_PATH)) {
      fs.unlinkSync(ENV_PATH);
    }
  });

  test("TC_01: Valid .env file with all required keys", () => {
    setEnvFile("USERNAME=validUser\nPASSWORD=validPass");

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_02: .env file missing USERNAME", () => {
    setEnvFile("PASSWORD=validPass");

    expect(process.env.USERNAME).toBeUndefined();
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_03: .env file missing PASSWORD", () => {
    setEnvFile("USERNAME=validUser");

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBeUndefined();
  });

  test("TC_04: Empty .env file", () => {
    setEnvFile("");

    expect(process.env.USERNAME).toBeUndefined();
    expect(process.env.PASSWORD).toBeUndefined();
  });

  test("TC_05: Invalid formatting in .env file", () => {
    setEnvFile("USERNAMEvalidUser\nPASSWORDvalidPass");

    expect(process.env.USERNAME).toBeUndefined();
    expect(process.env.PASSWORD).toBeUndefined();
  });

  test("TC_06: .env file with special characters", () => {
    setEnvFile('USERNAME=user@123\nPASSWORD="p@$$w0rd"');

    expect(process.env.USERNAME).toBe("user@123");
    expect(process.env.PASSWORD).toBe("p@$$w0rd");
  });

  test("TC_07: .env file with empty values", () => {
    setEnvFile("USERNAME=\nPASSWORD=");

    expect(process.env.USERNAME).toBe("");
    expect(process.env.PASSWORD).toBe("");
  });

  test("TC_08: .env file with extra spaces", () => {
    setEnvFile("USERNAME = validUser  \nPASSWORD =  validPass  ");

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_09: .env file with long values", () => {
    const longUsername = "a".repeat(1000);
    const longPassword = "b".repeat(1000);

    setEnvFile(`USERNAME=${longUsername}\nPASSWORD=${longPassword}`);

    expect(process.env.USERNAME).toBe(longUsername);
    expect(process.env.PASSWORD).toBe(longPassword);
  });

  test("TC_10: .env file with quotes around values", () => {
    setEnvFile('USERNAME="validUser"\nPASSWORD="validPass"');

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_11: .env file contains comments", () => {
    setEnvFile("# This is a comment\nUSERNAME=validUser\nPASSWORD=validPass");

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_12: .env file with newlines between values", () => {
    setEnvFile("USERNAME=validUser\n\nPASSWORD=validPass");

    expect(process.env.USERNAME).toBe("validUser");
    expect(process.env.PASSWORD).toBe("validPass");
  });

  test("TC_13: .env file containing SQL injection-like input", () => {
    setEnvFile("USERNAME=' OR '1'='1'\nPASSWORD='password'");
    // dotenv strips the wrapping quotes, so expect the value without the leading and trailing quotes.
    expect(process.env.USERNAME).toBe(" OR '1'='1");
    expect(process.env.PASSWORD).toBe("password");
  });

  test("TC_14: .env file not found", () => {
    // When the .env file does not exist, no values should be loaded.
    dotenv.config({ path: ENV_PATH });
    expect(process.env.USERNAME).toBeUndefined();
    expect(process.env.PASSWORD).toBeUndefined();
  });
});
