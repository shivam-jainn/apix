import { existsSync } from "fs";
import path from "path";
import { spawn } from "child_process";
import { ContentType } from "../../src/types/contentsType.js";

export async function sendRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data: Record<string, any> = {},
  headers: Record<string, string> = {},
  contentType: ContentType = ContentType.JSON
): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ["-s", "-X", method, url];

    // Add headers dynamically (except for multipart/form-data)
    if (contentType !== ContentType.FORM_DATA) {
      args.push("-H", `Content-Type: ${contentType}`);
    }

    Object.entries(headers).forEach(([key, value]) => {
      args.push("-H", `${key}: ${value}`);
    });

    if (method !== "GET" && Object.keys(data).length > 0) {
      if (contentType === ContentType.JSON) {
        args.push("-d", JSON.stringify(data));
      } else if (contentType === ContentType.URL_ENCODED) {
        args.push("-d", new URLSearchParams(data).toString());
      } else if (contentType === ContentType.FORM_DATA) {
        // Handle only the supported file types
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "string" && value.startsWith("tests/")) {
            const filePath = path.resolve(value);

            if (!existsSync(filePath)) {
              reject(`❌ Error: File not found - ${filePath}`);
              return;
            }

            // Ensure only allowed file types are uploaded
            if (
              filePath.endsWith(".csv") ||
              filePath.endsWith(".json") ||
              filePath.endsWith(".txt") ||
              filePath.endsWith(".xml") ||
              filePath.endsWith(".zip")
            ) {
              args.push("-F", `${key}=@${filePath}`);
            } else {
              reject(`❌ Error: Unsupported file type - ${filePath}`);
              return;
            }
          } else {
            args.push("-F", `${key}=${value}`);
          }
        });
      }
    }

    const process = spawn("curl", args);

    let output = "";
    process.stdout.on("data", (data) => (output += data.toString()));
    process.stderr.on("data", (error) =>
      console.error("❌ Error:", error.toString())
    );

    process.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(`❌ Request failed with exit code ${code}`);
    });
  });
}
