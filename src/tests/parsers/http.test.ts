import { describe, it, expect } from "vitest";
import { GET, POST, PUT, DELETE } from "../../../plugins/http/index.js"; // Ensure this is the correct path

const TEST_URL = "https://jsonplaceholder.typicode.com/posts"; // Sample API

describe("HTTP Methods using Curl", () => {
  it("should perform a GET request", async () => {
    const response = await GET(TEST_URL);
    expect(response).toBeTruthy();
  });

  it("should perform a POST request", async () => {
    const response = await POST(TEST_URL, {
      title: "Test",
      body: "This is a test",
      userId: 1,
    });
    expect(response).toBeTruthy();
  });

  it("should perform a PUT request", async () => {
    const response = await PUT(`${TEST_URL}/1`, {
      title: "Updated Title",
      body: "Updated body",
    });
    expect(response).toBeTruthy();
  });

  it("should perform a DELETE request", async () => {
    const response = await DELETE(`${TEST_URL}/1`);
    expect(response).toBeTruthy();
  });
});
