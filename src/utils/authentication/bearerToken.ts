export default function bearerAuth(input: unknown): { Authorization: string } {
  if (input === null || input === undefined) {
    throw new Error("Token is required");
  }
  if (typeof input !== "string") {
    throw new Error("Token must be a string");
  }

  if (/[\n\r\t]/.test(input) || /[\x00-\x08\x0B-\x0C\x0E-\x1F]/.test(input)) {
    throw new Error("Token contains invalid characters");
  }

  const token = input.trim();

  if (!token) {
    throw new Error("Token is required");
  }
  
  if (token.length > 1_000_000) {
    throw new Error("Token is too large");
  }
  
  if (token.startsWith("Bearer ")) {
    throw new Error("Token must not contain 'Bearer ' prefix");
  }
  
  if (/\s/.test(token)) {
    throw new Error("Token contains invalid characters");
  }
  
  return { Authorization: `Bearer ${token}` };
}
