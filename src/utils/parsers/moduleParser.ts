export function extractModuleName(input: string): string | null {
    const modulePattern = /@module\s+(\S+)/;
    const match = input.match(modulePattern);
    return match ? match[1] : null;
}
