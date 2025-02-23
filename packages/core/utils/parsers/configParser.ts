import { readFileSync, existsSync } from "fs";

interface Config {
  baseUrl: string;
  paths: Record<string, string[]>;
}

export function parseConfig(configPath: string): Config {
  if (!existsSync(configPath)) {
    throw new Error(`Failed to parse config: File not found at "${configPath}"`);
  }

  try {
    const fileContent = readFileSync(configPath, "utf-8");
    const config: Config = JSON.parse(fileContent);

    if (!config.baseUrl || !config.paths) {
      throw new Error("Invalid configuration: Missing `baseUrl` or `paths`.");
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse config: ${error.message}`);
    } else {
      throw new Error("Failed to parse config: Unknown error");
    }
  }
}
