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

    try {
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
            signal: AbortSignal.timeout(10000), // 10s timeout
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({
              success: false,
              message: `HTTP ${response.status}`,
              data: null,
              errors: [response.statusText]
            }));
            return errorData;
          }

          return response.json();
        } else {
          // For POST/PUT/PATCH, send URL and data in body
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
            signal: AbortSignal.timeout(10000), // 10s timeout
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({
              success: false,
              message: `HTTP ${response.status}`,
              data: null,
              errors: [response.statusText]
            }));
            return errorData;
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
        signal: AbortSignal.timeout(10000), // 10s timeout
      };

      const response = await fetch(targetUrl, { ...defaultOptions, ...options });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          success: false,
          message: `HTTP ${response.status}`,
          data: null,
          errors: [response.statusText]
        }));
        return errorData;
      }

      return response.json();
    } catch (error) {
      // Handle network errors, timeout, etc.
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: 'Request timeout',
            data: null as any,
            errors: ['The request took too long to complete']
          };
        }
        
        return {
          success: false,
          message: 'Network error',
          data: null as any,
          errors: [error.message || 'Failed to connect to server']
        };
      }
      
      return {
        success: false,
        message: 'Unknown error',
        data: null as any,
        errors: ['An unexpected error occurred']
      };
    }
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

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Export with direct API calls (no proxy)
// API Gateway Configuration - All requests route through Gateway
const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080';
const PROJECT_SERVICE = process.env.NEXT_PUBLIC_PROJECT_SERVICE || '/project-management-service';
const API_URL = `${GATEWAY_URL}${PROJECT_SERVICE}`;

// Export a client that routes through the Next.js proxy by default so
// credentials/cookies are forwarded from the browser to backend services.
export const apiClient = new ApiClient(API_URL, true);

export type { ApiResponse };
