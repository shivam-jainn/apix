import { describe, test, expect } from "vitest";
import { parseVariableAssignments } from "../../utils/parsers/variableParser.js";

describe("Variable Assignment Parser", () => {
  test("parses a single assignment", () => {
    const input = "@@variableName = variable_value";
    const result = parseVariableAssignments(input);
    expect(result).toEqual({ variableName: "variable_value" });
  });


  test("handles values with equals signs", () => {
    const input = "@@var = value=with=equals";
    const result = parseVariableAssignments(input);
    expect(result).toEqual({ var: "value=with=equals" });
  });

  test("handles extra spaces around key and value", () => {
    const input = "   @@key    =     value    ";
    const result = parseVariableAssignments(input);
    expect(result).toEqual({ key: "value" });
  });

  test("throws exception on empty assignment", () => {
    const input = "@@empty = ";
    expect(() => parseVariableAssignments(input)).toThrowError(
      "Empty value for variable 'empty' not allowed."
    );
  });

  test("throws exception when quotes result in an empty value", () => {
    const input = '@@foo = ""';
    expect(() => parseVariableAssignments(input)).toThrowError(
      "Empty value for variable 'foo' not allowed."
    );
  });

  test("returns an empty object if no valid assignments are present", () => {
    const input = "This is not a variable assignment";
    const result = parseVariableAssignments(input);
    expect(result).toEqual({});
  });
});
