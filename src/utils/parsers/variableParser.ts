import * as fs from "fs";
import * as path from "path";

/**
 * Parses variable assignments in the format:
 *   @@variableName = variable_value
 *
 * If any assignment has an empty value (after trimming and removing quotes),
 * the parser throws an exception.
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
      // Remove the "@@" prefix and trim the rest.
      const assignmentLine = trimmedLine.slice(2).trim();
      // Regex to capture variable name and value (value may be empty).
      const match = assignmentLine.match(/^([^\s=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if present.
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1).trim();
        }
        // Throw an exception if the value is empty.
        if (!value) {
          throw new Error(`Empty value for variable '${key}' not allowed.`);
        }
        variables[key] = value;
      }
    }
  }

  return variables;
}

/**
 * Reads an assignment file from disk and parses its contents.
 *
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
