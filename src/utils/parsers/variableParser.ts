import * as fs from "fs";
import * as path from "path";

/**
 * Parses variable assignments in the format:
 *   @@variableName = variable_value
 *
 * Ignores lines that do not start with the "@@" prefix.
 *
 * @param input A string containing one or more variable assignments.
 * @returns An object mapping variable names to their assigned values.
 */
export function parseVariableAssignments(
  input: string
): Record<string, string> {
  const lines = input.split("\n");
  const variables: Record<string, string> = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("@@")) {
      // Remove the "@@" prefix and trim the rest
      const assignmentLine = trimmedLine.slice(2).trim();
      // Use regex to capture the variable name and its value.
      // This regex matches a variable name (non-space, non-"=" characters) followed by "=" and then any value.
      const match = assignmentLine.match(/^([^\s=]+)\s*=\s*(.+)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        variables[key] = value;
      }
    }
  }

  return variables;
}

/**
 * (Optional) Reads an assignment file from disk and parses its contents.
 * @param filePath The path to the assignment file.
 * @returns An object mapping variable names to their assigned values.
 */
export function parseVariableAssignmentsFromFile(
  filePath: string
): Record<string, string> {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  const content = fs.readFileSync(fullPath, "utf-8");
  return parseVariableAssignments(content);
}
