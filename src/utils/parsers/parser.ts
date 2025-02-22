import fs from 'fs';
import path from 'path';

const rootPath = process.cwd();
const filePath = path.join(rootPath, 'src', 'tests', 'test.apix');

// Read file contents
const fileContent = fs.readFileSync(filePath, 'utf8');
const FC = fileContent.split("\n");

// Process each line
FC.forEach((line) => { 
    const splitLine = line.trim().split(/\s+/); // Use regex to split by spaces/tabs
    const firstToken = splitLine[0];

    switch (firstToken) {
        case '@name':
            // Handle name case
            break;
        case '@description':
            // Handle description case
            break;
        case '@group':
            // Handle group case
            break;
        case 'import':
            parseImports(line);
            break;
        default:
            break;
    }
});

function parseImports(importStatement: string) {
    const importParts = importStatement.trim().split(/\s+/); 

    if (importParts.length > 2) {
        const pathMatch = importStatement.match(/['"]([^'"]+)['"]/);
        if (!pathMatch) {
            console.error("Invalid import statement:", importStatement);
            return;
        }
    
        const rawImportPath = pathMatch[1]; // Extracted path from quotes
        const importFilePath = path.join(rootPath, 'src', 'tests', rawImportPath);

        if (!fs.existsSync(importFilePath)) {
            console.error("File not found:", importFilePath);
            return;
        }

        // Read the imported file
        const importFileContent = fs.readFileSync(importFilePath, 'utf8');
        console.log(`Imported Content from ${rawImportPath}:\n`, importFileContent);
    }
}
