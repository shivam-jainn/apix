import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { parseConfig } from "../../utils/parsers/configParser.js";
import { writeFileSync, unlinkSync } from "fs";

const testConfigPath = "test.apix.config.json";

describe("parseConfig", () => {
  beforeAll(() => {
    // Create a mock config file before tests
    const mockConfig = {
      baseUrl: "src",
      paths: {
        "@app/*": ["app/*"],
        "@config/*": ["app/_config/*"],
        "@helpers/*": ["helpers/*"]
      }
    };
    writeFileSync(testConfigPath, JSON.stringify(mockConfig, null, 2));
  });

  afterAll(() => {
    // Clean up mock config file after tests
    unlinkSync(testConfigPath);
  });

  it("should parse a valid config file correctly", () => {
    const config = parseConfig(testConfigPath);

    expect(config.baseUrl).toBe("src");
    expect(config.paths).toHaveProperty("@app/*", ["app/*"]);
    expect(config.paths).toHaveProperty("@config/*", ["app/_config/*"]);
  });

  it("should resolve alias paths correctly", () => {
    const config = parseConfig(testConfigPath);

    expect(config.paths["@app/*"][0]).toBe("app/*");
    expect(config.paths["@config/*"][0]).toBe("app/_config/*");
  });

  it("should throw an error if `baseUrl` is missing", () => {
    const invalidConfig = { paths: { "@app/*": ["app/*"] } };
    writeFileSync(testConfigPath, JSON.stringify(invalidConfig, null, 2));

    expect(() => parseConfig(testConfigPath)).toThrow("Invalid configuration: Missing `baseUrl` or `paths`.");
  });

  it("should throw an error if `paths` is missing", () => {
    const invalidConfig = { baseUrl: "src" };
    writeFileSync(testConfigPath, JSON.stringify(invalidConfig, null, 2));

    expect(() => parseConfig(testConfigPath)).toThrow("Invalid configuration: Missing `baseUrl` or `paths`.");
  });

  it("should throw an error if config file is not found", () => {
    expect(() => parseConfig("nonexistent.apix.config.json")).toThrow("Failed to parse config");
  });

  it("should throw an error for invalid JSON format", () => {
    writeFileSync(testConfigPath, "{ invalidJson: true, }"); // Malformed JSON

    expect(() => parseConfig(testConfigPath)).toThrow();
  });
});
