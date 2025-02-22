import { ContentType } from "../../src/types/contentsType.js";

export async function sendRequest(
  method: string,
  url: string,
  body: any = {},
  headers: Record<string, string> = {},
  contentType: ContentType = ContentType.JSON
): Promise<any> {
  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': contentType,
        ...headers
      }
    };

    // Only add body for non-GET methods
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      requestOptions.body = Object.keys(body).length > 0 ? JSON.stringify(body) : undefined;
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
