// src/components/Login/Login.test.tsx

import "src/test/mocks/axiosMock";
import "src/test/mocks/browserMocks";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./index";
import { renderWithProviders } from "src/test/test-utils";
import { loginAPI } from "src/services/loginApi";
import { getSummaryAPI } from "src/services/summaryAPi";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/services/loginApi", () => ({
  loginAPI: jest.fn(),
}));

jest.mock("src/services/summaryAPi", () => ({
  getSummaryAPI: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();

  (loginAPI as jest.Mock).mockResolvedValue({
    status: 200,
    data: { sessionId: "session-1" },
  });

  (getSummaryAPI as jest.Mock).mockResolvedValue({
    userSummary: {
      user_first_name: "Jai",
      services: ["Services"],
    },
  });
});

test("renders login form", () => {
  renderWithProviders(<LoginPage />);

  const emailInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole("button", { name: /submit/i });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

test("successful login calls API and redirects", async () => {
  renderWithProviders(<LoginPage />);

  const emailInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole("button", { name: /submit/i });

  userEvent.type(emailInput, "jai123");
  userEvent.type(passwordInput, "Password!");
  userEvent.click(loginButton);

  await waitFor(() => {
    expect(loginAPI).toHaveBeenCalled();
    expect(getSummaryAPI).toHaveBeenCalledWith("session-1");
    expect(mockNavigate).toHaveBeenCalledWith("assets");
  });
});
