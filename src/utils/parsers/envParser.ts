#!/usr/bin/env ts-node

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(__dirname, ".env");

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error(`Error: .env file not found at ${ENV_PATH}`);
    return;
  }

  const result = dotenv.config({ path: ENV_PATH, override: true });
  if (result.error) {
    console.error("Error parsing .env file:", result.error);
    return;
  }

  if (result.parsed) {
    for (const key in result.parsed) {
      const trimmedKey = key.trim();
      let trimmedValue = result.parsed[key].trim();

      if (
        (trimmedValue.startsWith(`"`) && trimmedValue.endsWith(`"`)) ||
        (trimmedValue.startsWith(`'`) && trimmedValue.endsWith(`'`))
      ) {
        trimmedValue = trimmedValue.slice(1, -1);
      }

      process.env[trimmedKey.toUpperCase()] = trimmedValue;

      if (trimmedKey !== key) {
        delete process.env[key];
      }
    }
  }
}

if (require.main === module) {
  loadEnv();
  console.log("Parsed environment variables:");
  console.log("USERNAME:", process.env.USERNAME);
  console.log("PASSWORD:", process.env.PASSWORD);
}

export { loadEnv };
