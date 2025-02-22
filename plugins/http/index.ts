import { spawn } from "child_process";

// Function to execute curl commands
async function executeCurl(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("curl", args);

    let output = "";
    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (error) =>
      console.error("Error:", error.toString())
    );

    process.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(`Request failed with exit code ${code}`);
    });
  });
}

// ✅ GET request
export async function GET(
  url: string,
  headers: Record<string, string> = {}
): Promise<string> {
  const args = ["-s", "-X", "GET", url];

  Object.entries(headers).forEach(([key, value]) => {
    args.push("-H", `${key}: ${value}`);
  });

  return executeCurl(args);
}

// ✅ POST request
export async function POST(
  url: string,
  data: any,
  headers: Record<string, string> = {}
): Promise<string> {
  const args = ["-s", "-X", "POST", url, "-d", JSON.stringify(data)];

  Object.entries(headers).forEach(([key, value]) => {
    args.push("-H", `${key}: ${value}`);
  });

  return executeCurl(args);
}

// ✅ PUT request
export async function PUT(
  url: string,
  data: any,
  headers: Record<string, string> = {}
): Promise<string> {
  const args = ["-s", "-X", "PUT", url, "-d", JSON.stringify(data)];

  Object.entries(headers).forEach(([key, value]) => {
    args.push("-H", `${key}: ${value}`);
  });

  return executeCurl(args);
}

// ✅ DELETE request
export async function DELETE(
  url: string,
  headers: Record<string, string> = {}
): Promise<string> {
  const args = ["-s", "-X", "DELETE", url];

  Object.entries(headers).forEach(([key, value]) => {
    args.push("-H", `${key}: ${value}`);
  });

  return executeCurl(args);
}
