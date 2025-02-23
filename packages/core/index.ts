import fs from 'fs';
import path from 'path';
import { importParser } from './utils/parsers/importParser.js';
import { parseVariableAssignments } from './utils/parsers/variableParser.js';
import { extractNameRequest } from './utils/parsers/nameParser.js';
import { parseConfig } from './utils/parsers/configParser.js';
import { loadEnv } from './utils/parsers/envParser.js';
import { sendRequest } from '../plugins/http/src/sendRequest.js';
import basicAuth from './utils/authentication/basic.js';
import bearerAuth from './utils/authentication/bearerToken.js';
import { ContentType } from '@apix/types';

interface RequestBlock {
    name: string | null;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
    url: string;
    authType: 'basicAuth' | 'bearerAuth' | null;
    contentType: ContentType;
    body: Record<string, any>;
    headers: Record<string, string>;
}

export default class RequestProcessor {
    private variables: Record<string, string> = {};
    private importedMethods: string[] = [];
    private env;
    private config;
    private outputs: any[] = [];

    constructor() {
        this.config = parseConfig('/Users/shivamjain/Code/apix/apix.config.json');
        this.env = loadEnv('/Users/shivamjain/Code/apix/.env');
    }

    private substituteVariables(text: string): string {
        return Object.entries(this.variables).reduce((result, [key, value]) => {
            const regex = new RegExp(`\\b${key}\\b`, 'g');
            return result.replace(regex, value);
        }, text);
    }

    private async executeRequest(request: RequestBlock) {
        if (request.method === 'WS') {
            console.log('WebSocket requests not implemented yet');
            return;
        }

        try {
            const response = await sendRequest(
                request.method,
                request.url,
                request.body,
                request.headers,
                request.contentType
            );
            console.log('Response:', response);
        } catch (error) {
            console.error('Request Error:', error);
            throw error;
        }
    }

    private processMemoryLine(line: string) {
        if (line.startsWith('import')) {
            const importResult = importParser(line);
            if (importResult) {
                if (importResult.module.startsWith('parsers/')) {
                    this.importedMethods.push(...importResult.imports);
                }
                console.log(`Processed import from ${importResult.module}`);
            }
        } else if (line.startsWith('@@')) {
            try {
                const newVars = parseVariableAssignments(line);
                Object.assign(this.variables, newVars);
                console.log('Updated variables:', this.variables);
            } catch (error) {
                console.error('Error parsing variable assignment:', error);
            }
        } else if (line.startsWith('env_')) {
            const match = line.match(/env_\w+\s*=\s*loadenv\(['"](.+?)['"]\)/);
            if (match) {
                try {
                    this.env = loadEnv(match[1]);
                    console.log('Loaded environment variables');
                } catch (error) {
                    console.error('Error loading environment file:', error);
                }
            }
        }
    }

    private processRequestLine(line: string, currentRequest: RequestBlock): void {
        if (line.startsWith('# @name')) {
            currentRequest.name = extractNameRequest(line);
        } else {
            // Method and URL parsing
            const methodMatch = line.match(/^(GET|POST|PUT|DELETE|WS)\s+(\S+)/i);
            if (methodMatch) {
                currentRequest.method = methodMatch[1].toUpperCase() as RequestBlock['method'];
                const urlPath = methodMatch[2];
                const substitutedPath = this.substituteVariables(urlPath);
                currentRequest.url = substitutedPath;
                console.log('Constructed URL:', currentRequest.url);
            }

            // Parse basic auth directly
            if (line.startsWith('basicAuth')) {
                const authMatch = line.match(/basicAuth\((.*?),(.*?)\)/);
                if (authMatch) {
                    currentRequest.authType = 'basicAuth';
                    const envUsername = authMatch[1].trim().split('.')[1];
                    const envPassword = authMatch[2].trim().split('.')[1];
                    
                    const username = this.env.get(envUsername);
                    const password = this.env.get(envPassword);
                    
                    if (!username || !password) {
                        throw new Error(`Missing ${envUsername} or ${envPassword} in environment`);
                    }
                    
                    const authHeader = basicAuth(username, password);
                    currentRequest.headers['Authorization'] = authHeader.Authorization;
                    console.log('Added Basic Auth header');
                }
            }
        }
    }

    public async processFile(filePath: string) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const lines = fileContent.split('\n').map(line => line.trim());
            
            let currentRequest: RequestBlock | null = null;
            let isInBlock = false;
            let isInBody = false;
            let bodyLines: string[] = [];

            for (const line of lines) {
                if (!line) continue;

                if (line === '---') {
                    if (isInBlock && currentRequest) {
                        // Process the completed block
                        if (bodyLines.length > 0) {
                            try {
                                const bodyText = bodyLines.join('\n');
                                const substitutedBody = this.substituteVariables(bodyText);
                                currentRequest.body = JSON.parse(substitutedBody);
                            } catch (e) {
                                console.error('Invalid JSON body:', e);
                            }
                        }
                        
                        await this.executeRequest(currentRequest);
                    }
                    
                    isInBlock = !isInBlock;
                    bodyLines = [];
                    isInBody = false;
                    currentRequest = isInBlock ? {
                        name: null,
                        method: 'GET',
                        url: '',
                        authType: null,
                        contentType: ContentType.JSON,
                        body: {},
                        headers: {}
                    } : null;
                    continue;
                }

                if (!isInBlock) {
                    this.processMemoryLine(line);
                } else if (currentRequest) {
                    if (isInBody || line.trimLeft().startsWith('{')) {
                        isInBody = true;
                        bodyLines.push(line);
                    } else {
                        this.processRequestLine(line, currentRequest);
                    }
                }
            }

            // Handle last block if needed
            if (isInBlock && currentRequest && bodyLines.length > 0) {
                const bodyText = bodyLines.join('\n');
                const substitutedBody = this.substituteVariables(bodyText);
                currentRequest.body = JSON.parse(substitutedBody);
                await this.executeRequest(currentRequest);
            }

        } catch (error) {
            console.error('Error processing file:', error);
            throw error;
        }
    }

    private async finalizeRequest(request: RequestBlock | null, bodyLines: string[]): Promise<void> {
        if (request) {
            // Substitute variables in the body
            const bodyText = bodyLines.join('\n');
            const substitutedBody = this.substituteVariables(bodyText);
    
            // Parse body as JSON
            try {
                request.body = JSON.parse(substitutedBody);
            } catch (error) {
                console.error('Invalid JSON body:', error);
                return;
            }
    
            // Execute the request and capture output
            try {
                const response = await this.executeRequest(request);
                this.outputs.push(response); // Store response for rendering
            } catch (error) {
                console.error('Request execution error:', error);
            }
        }
    }

    public async processCode(code: string): Promise<any[]> {
        const lines = code.split('\n').map(line => line.trim());
        let outputs: any[] = [];
        let currentRequest: RequestBlock | null = null;
        let isInBlock = false;
        let bodyLines: string[] = [];
    
        for (const line of lines) {
            if (line === '---') {
                if (isInBlock) {
                    await this.finalizeRequest(currentRequest, bodyLines);
                    isInBlock = false;
                    currentRequest = null;
                    bodyLines = [];
                } else {
                    isInBlock = true;
                    currentRequest = {
                        name: null,
                        method: 'GET',
                        url: '',
                        authType: null,
                        contentType: ContentType.JSON,
                        body: {},
                        headers: {},
                    };
                }
                continue;
            }
    
            if (!isInBlock) {
                this.processMemoryLine(line);
            } else {
                this.processRequestLine(line, currentRequest);
                if (line.trimLeft().startsWith('{')) {
                    bodyLines.push(line);
                }
            }
        }
    
        if (isInBlock && currentRequest) {
            await this.finalizeRequest(currentRequest, bodyLines);
        }
    
        return outputs;
    }
}

// Execute
const processor = new RequestProcessor();
const filePath = path.join(__dirname, 'tests', 'test_assets', 'test.apix');
processor.processFile(filePath).catch(console.error);