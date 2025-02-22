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

        const [key, value] = trimmedLine.split("=");
        if (key && value) {
          const trimmedKey = key.trim();
          let trimmedValue = value.trim();

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
