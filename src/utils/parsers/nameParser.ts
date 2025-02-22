export function extractApiName(input: string): string | null {
    const namePattern = /#\s@name\s+(\S+)/;
    const match = input.match(namePattern);
    return match ? match[1] : null;
}
