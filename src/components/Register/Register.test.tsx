import "src/test/mocks/axiosMock";
import "src/test/mocks/browserMocks";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./index";
import { renderWithProviders } from "src/test/test-utils";
import { validateUsername } from "src/services/validateUsernameAPI";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/services/validateUsernameAPI", () => ({
  validateUsername: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();

  (validateUsername as jest.Mock).mockResolvedValue({
    success: true,
    usernameValidation: { exists: false },
  });
});

test("renders Step 1 fields on initial load", () => {
  renderWithProviders(<RegisterPage />);

  const usernameInput = screen.getByLabelText(/user name/i);
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const genderSelect = screen.getByLabelText(/gender/i);
  const dobPicker = screen.getByLabelText(/date of birth/i);
  const nextButton = screen.getByRole("button", { name: /next/i });
  const backButton = screen.getByRole("button", { name: /back to login/i });

  expect(usernameInput).toBeInTheDocument();
  expect(firstNameInput).toBeInTheDocument();
  expect(lastNameInput).toBeInTheDocument();
  expect(genderSelect).toBeInTheDocument();
  expect(dobPicker).toBeInTheDocument();
  expect(nextButton).toBeInTheDocument();
  expect(backButton).toBeInTheDocument();
});

test("navigates back to login page on clicking back button", async () => {
  renderWithProviders(<RegisterPage />);

  const backButton = screen.getByRole("button", { name: /back to login/i });
  await userEvent.click(backButton);

  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("does not transition to Step 2 when clicking Next with empty fields", async () => {
  renderWithProviders(<RegisterPage />);

  const nextButton = screen.getByRole("button", { name: /next/i });
  await userEvent.click(nextButton);

  await waitFor(() => {
    const emailInput = screen.queryByLabelText(/e-mail/i);
    const phoneInput = screen.queryByLabelText(/phone number/i);
    const passwordInput = screen.queryByLabelText(/password/i);

    expect(emailInput).not.toBeInTheDocument();
    expect(phoneInput).not.toBeInTheDocument();
    expect(passwordInput).not.toBeInTheDocument();

    const usernameInput = screen.getByLabelText(/user name/i);
    expect(usernameInput).toBeInTheDocument();
  });
});

test("calls username validation API on blur", async () => {
  renderWithProviders(<RegisterPage />);

  const usernameInput = screen.getByLabelText(/user name/i);
  await userEvent.type(usernameInput, "jai123");
  await userEvent.tab();

  await waitFor(() => {
    expect(validateUsername).toHaveBeenCalledWith("jai123");
  });
});
