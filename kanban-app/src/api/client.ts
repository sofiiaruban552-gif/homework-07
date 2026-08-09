const API = "http://localhost:4000";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API}${url}`, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

const jsonHeaders = {
  "Content-Type": "application/json",
};

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, data: unknown) =>
    request<T>(url, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  patch: <T>(url: string, data: unknown) =>
    request<T>(url, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};
