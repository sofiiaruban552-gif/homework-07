import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { API_BASE_URL } from "@/api/client";
import { mockUsers } from "./fixtures";

export const handlers = [
  http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(mockUsers)),
];

export const server = setupServer(...handlers);


