import "src/test/mocks/axiosMock";
import "src/test/mocks/browserMocks";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "./index";
import { renderWithProviders } from "src/test/test-utils";
import { userStore } from "src/utils/userStore";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

test("renders Step 1 (username input)", () => {
  renderWithProviders(<ForgotPasswordPage />);

  expect(screen.getByText("Forgot Password — Step 1 of 3")).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
});

test("navigates back to login page on click", async () => {
  renderWithProviders(<ForgotPasswordPage />);

  const backButton = screen.getByRole("button", { name: /back to login/i });
  await userEvent.click(backButton);

  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("successfully walks through the forgot password steps", async () => {
  userStore.registerUser({
    user_unique_id: "testuser",
    user_password: "OldPassword1!",
    user_first_name: "Test",
    user_last_name: "User",
    user_email: "test@example.com",
    security_question: "What is your pet name?",
    security_answer: "Buddy",
    registered_at: new Date().toISOString(),
  });

  renderWithProviders(<ForgotPasswordPage />);

  const usernameInput = screen.getByLabelText(/username/i);
  const nextBtn = screen.getByRole("button", { name: /next/i });

  await userEvent.type(usernameInput, "testuser");
  await userEvent.click(nextBtn);

  await waitFor(() => {
    expect(
      screen.getByText("Forgot Password — Step 2 of 3"),
    ).toBeInTheDocument();
    expect(screen.getByText("What is your pet name?")).toBeInTheDocument();
  });

  const answerInput = screen.getByLabelText(/your answer/i);
  const verifyBtn = screen.getByRole("button", { name: /verify/i });

  await userEvent.type(answerInput, "Buddy");
  await userEvent.click(verifyBtn);

  await waitFor(() => {
    expect(
      screen.getByText("Forgot Password — Step 3 of 3"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  const newPasswordInput = screen.getByLabelText("New Password");
  const confirmPasswordInput = screen.getByLabelText("Confirm Password");
  const resetBtn = screen.getByRole("button", { name: /reset password/i });

  await userEvent.type(newPasswordInput, "NewPassword2!");
  await userEvent.type(confirmPasswordInput, "NewPassword2!");
  await userEvent.click(resetBtn);

  await waitFor(() => {
    const updatedUser = userStore.getUser("testuser");
    expect(updatedUser?.user_password).toBe("NewPassword2!");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
