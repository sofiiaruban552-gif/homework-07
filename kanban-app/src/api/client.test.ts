import { afterEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";

import { api, API } from "./client";
import { server } from "@/test/server";
import { API_ERROR_MESSAGES } from "@/constants/error-messages";

describe("API client", () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it("throws an error when the response is not OK (500)", async () => {
    server.use(
      http.get(`${API}/test-error`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(api.get("/test-error")).rejects.toThrow(
      API_ERROR_MESSAGES.INTERNAL_SERVER,
    );
  });

  it("throws an error when the resource is not found (404)", async () => {
    server.use(
      http.get(`${API}/test-not-found`, () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    await expect(api.get("/test-not-found")).rejects.toThrow(
      API_ERROR_MESSAGES.NOT_FOUND,
    );
  });

  it("returns undefined when the response status is 204", async () => {
    server.use(
      http.delete(`${API}/test-no-content`, () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const result = await api.delete<undefined>("/test-no-content");

    expect(result).toBeUndefined();
  });
});
