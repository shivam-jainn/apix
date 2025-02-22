export function parseVariableAssignments(input: string): Record<string, string> {
  const variables: Record<string, string> = {};

  // Remove the "@@" prefix and trim the rest.
  const assignmentLine = input.trimStart().slice(2);
  console.log('assignmentLine:', assignmentLine);
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

  return variables;
}
