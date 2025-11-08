interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(options?.headers),
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json();
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    return {
      "Content-Type": "application/json",
      ...customHeaders,
    };
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
