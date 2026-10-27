import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { API } from "@/api/client";

export const mockUsers = [
  { id: 1, name: "John Doe", color: "#ff0000" },
  { id: 2, name: "Jane Smith", color: "#00ff00" },
];

export const handlers = [
  http.get(`${API}/users`, () => HttpResponse.json(mockUsers)),
];

export const server = setupServer(...handlers);
