import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { API } from "@/api/client";

export const handlers = [
  http.get(`${API}/cards`, () => HttpResponse.json([])),

  http.get(`${API}/cards/:id`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id),
      title: "Test card",
    }),
  ),

  http.post(`${API}/cards`, async ({ request }) =>
    HttpResponse.json(await request.json(), { status: 201 }),
  ),

  http.patch(`${API}/cards/:id`, async ({ request }) =>
    HttpResponse.json(await request.json()),
  ),

  http.delete(
    `${API}/cards/:id`,
    () => new HttpResponse(null, { status: 204 }),
  ),

  http.get(`${API}/users`, () => HttpResponse.json([])),

  http.get(`${API}/columns`, () => HttpResponse.json([])),
];

export const server = setupServer(...handlers);
