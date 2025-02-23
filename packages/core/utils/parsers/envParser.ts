import * as fs from 'fs';

class Env {
  private env: { [key: string]: string } = {};

  constructor(envPath: string) {
    this.loadEnv(envPath);
  }

  private loadEnv(envPath: string) {
    try {
      const envFileContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envFileContent.split("\n");

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue;
        }

        const [key, ...valueParts] = trimmedLine.split("="); // Handle values with '='
        if (key) {
          const trimmedKey = key.trim();
          let trimmedValue = valueParts.join("=").trim(); // Preserve "=" in values

          // Handle empty values explicitly
          if (trimmedValue === undefined) {
            trimmedValue = "";
          }

          // Remove surrounding quotes
          if (
            (trimmedValue.startsWith(`"`) && trimmedValue.endsWith(`"`)) ||
            (trimmedValue.startsWith(`'`) && trimmedValue.endsWith(`'`))
          ) {
            trimmedValue = trimmedValue.slice(1, -1);
          }

          this.env[trimmedKey.toUpperCase()] = trimmedValue;
        }
      }
    } catch (error) {
      console.error(`Error: .env file not found at ${envPath}`);
    }
  }

  get(key: string): string | undefined {
    return this.env[key.toUpperCase()];
  }
}

function loadEnv(envPath: string): Env {
  return new Env(envPath);
}

export { Env, loadEnv };
