interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

class ApiClient {
  private baseURL: string;
  private useProxy: boolean;

  constructor(baseURL: string, useProxy = true) {
    this.baseURL = baseURL;
    this.useProxy = useProxy;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const targetUrl = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    // If proxy is enabled, route through Next.js API route
    if (this.useProxy) {
      const method = options.method || 'GET';
      
      if (method === 'GET' || method === 'DELETE') {
        // For GET/DELETE, pass URL as query param
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
        const response = await fetch(proxyUrl, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
      } else {
        // For POST/PUT, send URL and data in body
        const response = await fetch('/api/proxy', {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify({
            url: targetUrl,
            data: options.body ? JSON.parse(options.body as string) : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
      }
    }

    // Original direct fetch (fallback)
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(targetUrl, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export with proxy enabled (hides from Network tab)
export const apiClient = new ApiClient('', true);

// Export without proxy if needed
export const apiClientDirect = new ApiClient('', false);

export type { ApiResponse };
