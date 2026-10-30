import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoginPage from "./LoginPage";

import { API } from "@/api/client";
import { ROUTES } from "@/constants/routes";
import { ERROR_DETAILS, ERROR_MESSAGES } from "@/constants/error-messages";

import useAuthStore from "@/store/useAuthStore";
import useUsersStore from "@/store/useUsersStore";
import { mockUsers, server } from "@/test/server";

const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
      <ToastContainer />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.BOARD} element={<h1>Board page</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe("LoginPage integration tests", () => {
  beforeEach(() => {
    useUsersStore.setState({
      users: [],
      loading: false,
      error: null,
    });

    useAuthStore.getState().logout();
  });

  it("loads users, logs in the selected user, and navigates to the board", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    expect(
      await screen.findByRole("heading", { name: "Who are you?" }),
    ).toBeInTheDocument();

    await user.click(await screen.findByLabelText("John Doe"));

    expect(
      await screen.findByRole("heading", { name: "Board page" }),
    ).toBeInTheDocument();

    expect(useAuthStore.getState().currentUser).toEqual(mockUsers[0]);
  });

  it("displays an error toast when fetching users returns HTTP 500", async () => {
    server.use(
      http.get(`${API}/users`, () =>
        HttpResponse.json(
          { message: ERROR_DETAILS.INTERNAL_SERVER },
          { status: 500 },
        ),
      ),
    );

    renderLoginPage();

    expect(
      await screen.findByText(ERROR_MESSAGES.LOAD_USERS),
    ).toBeInTheDocument();

    expect(useAuthStore.getState().currentUser).toBeNull();

    expect(
      screen.queryByRole("heading", { name: "Board page" }),
    ).not.toBeInTheDocument();
  });
});
