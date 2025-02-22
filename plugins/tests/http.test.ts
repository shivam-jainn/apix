import { describe, it, expect } from "vitest";
import { sendRequest } from "../../plugins/http/sendRequest.js";
import { ContentType } from "../../src/types/contentsType.js";

const TEST_URL = "https://jsonplaceholder.typicode.com/posts";

describe("HTTP Requests with Different File Types", () => {
  it("should perform a GET request", async () => {
    const response = await sendRequest("GET", TEST_URL);
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with JSON data", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { title: "Test", body: "This is a test", userId: 1 },
      {},
      ContentType.JSON
    );
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with a text file", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { file: "assets/tests/sample.txt" }, // Fixed path
      {},
      ContentType.FORM_DATA
    );
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with a CSV file", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { file: "assets/tests/sample.csv" },
      {},
      ContentType.FORM_DATA
    );
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with a ZIP file", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { file: "assets/tests/sample.zip" },
      {},
      ContentType.FORM_DATA
    );
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with an XML file", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { file: "assets/tests/sample.xml" },
      {},
      ContentType.FORM_DATA
    );
    expect(response).toBeTruthy();
  });

  it("should perform a POST request with URL-Encoded data", async () => {
    const response = await sendRequest(
      "POST",
      TEST_URL,
      { username: "testuser", password: "secure123" },
      {},
      ContentType.URL_ENCODED
    );
    expect(response).toBeTruthy();
  });

  it("should perform a PUT request with JSON", async () => {
    const response = await sendRequest(
      "PUT",
      `${TEST_URL}/1`,
      { title: "Updated Title", body: "Updated Content" },
      {},
      ContentType.JSON
    );
    expect(response).toBeTruthy();
  });

  it("should perform a DELETE request", async () => {
    const response = await sendRequest("DELETE", `${TEST_URL}/1`);
    expect(response).toBeTruthy();
  });
});
