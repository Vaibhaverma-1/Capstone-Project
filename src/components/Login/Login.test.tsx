import "src/test/mocks/axiosMock";
import "src/test/mocks/browserMocks";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./index";
import { renderWithProviders } from "src/test/test-utils";
import { getSummaryAPI } from "src/services/summaryAPi";
import { userStore } from "src/utils/userStore";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/services/summaryAPi", () => ({
  getSummaryAPI: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();

  userStore.registerUser({
    user_unique_id: "jai123",
    user_password: "Password!",
    user_first_name: "Jai",
    user_last_name: "Verma",
    user_email: "jai@example.com",
    registered_at: new Date().toISOString(),
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

  await userEvent.type(emailInput, "jai123");
  await userEvent.type(passwordInput, "Password!");
  await userEvent.click(loginButton);

  await waitFor(() => {
    expect(getSummaryAPI).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("assets");
  });
});
