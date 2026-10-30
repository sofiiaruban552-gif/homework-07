import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { API } from "@/api/client";
import { mockUsers } from "./fixtures";

export const handlers = [
  http.get(`${API}/users`, () => HttpResponse.json(mockUsers)),
];

export const server = setupServer(...handlers);
export { mockUsers };

