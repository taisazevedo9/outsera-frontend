import { ApiClient, ApiError } from "../api-client";

describe("ApiClient", () => {
  let apiClient: ApiClient;
  const baseUrl = "https://api.example.com";

  beforeEach(() => {
    apiClient = new ApiClient(baseUrl);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("get", () => {
    it("should make a GET request and return data", async () => {
      const mockData = { id: 1, name: "Test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get("/users");

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockData);
    });

    it("should append query parameters to URL", async () => {
      const mockData = { results: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        params: { page: 1, size: 10, active: true },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users?page=1&size=10&active=true`,
        expect.any(Object)
      );
    });

    it("should skip undefined parameters", async () => {
      const mockData = { results: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        params: { page: 1, size: undefined, active: true },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users?page=1&active=true`,
        expect.any(Object)
      );
    });

    it("should include custom headers", async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        headers: { Authorization: "Bearer token123" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users`,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer token123",
          },
        })
      );
    });

    it("should throw ApiError when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(apiClient.get("/users")).rejects.toThrow(ApiError);
      await expect(apiClient.get("/users")).rejects.toThrow("Not Found");
    });

    it("should handle 500 server errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      try {
        await apiClient.get("/users");
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).message).toBe("Internal Server Error");
      }
    });

    it("should handle empty params object", async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", { params: {} });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users`,
        expect.any(Object)
      );
    });

    it("should convert non-string parameters to strings", async () => {
      const mockData = { results: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        params: { id: 123, active: false, rating: 4.5 },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users?id=123&active=false&rating=4.5`,
        expect.any(Object)
      );
    });

    it("should work without options", async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get("/health");

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/health`,
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("buildUrl", () => {
    it("should build URL without params", () => {
      // Testing through the public get method
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      apiClient.get("/users");

      expect(global.fetch).toHaveBeenCalledWith(
        `${baseUrl}/users`,
        expect.any(Object)
      );
    });

    it("should handle special characters in params", async () => {
      const mockData = { results: [] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/search", {
        params: { query: "hello world", filter: "a&b" },
      });

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("query=hello+world");
      expect(calledUrl).toContain("filter=a%26b");
    });
  });

  describe("getHeaders", () => {
    it("should return default Content-Type header", async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("should merge custom headers with default headers", async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        headers: { "X-Custom-Header": "value" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": "value",
          },
        })
      );
    });

    it("should allow overriding Content-Type", async () => {
      const mockData = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiClient.get("/users", {
        headers: { "Content-Type": "text/plain" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "Content-Type": "text/plain" },
        })
      );
    });
  });
});

describe("ApiError", () => {
  it("should create an error with status and message", () => {
    const error = new ApiError(404, "Not Found");

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not Found");
    expect(error.name).toBe("ApiError");
  });

  it("should be throwable", () => {
    expect(() => {
      throw new ApiError(500, "Internal Server Error");
    }).toThrow(ApiError);
  });

  it("should preserve error stack trace", () => {
    const error = new ApiError(403, "Forbidden");
    expect(error.stack).toBeDefined();
  });

  it("should work with different HTTP status codes", () => {
    const error400 = new ApiError(400, "Bad Request");
    const error401 = new ApiError(401, "Unauthorized");
    const error500 = new ApiError(500, "Server Error");

    expect(error400.status).toBe(400);
    expect(error401.status).toBe(401);
    expect(error500.status).toBe(500);
  });
});
