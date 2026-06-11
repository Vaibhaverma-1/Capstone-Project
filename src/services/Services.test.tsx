import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { loginAPI } from "./loginApi";
import { getSummaryAPI } from "./summaryAPi";

import { registerAPI } from "./registerAPI";
import { validateUsername } from "./validateUsernameAPI";
import { validateEmail } from "./validateEmailAPI";
import { validatePhone } from "./validatePhoneAPI";
import { updateProfileAPI } from "./updateProfileAPI";

jest.mock("src/api/apiClient", () => ({
  apiClient: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("loginAPI calls login endpoint", async () => {
  const formData = {
    user_unique_id: "jai123",
    user_password: "encrypted-password",
  };

  (apiClient as jest.Mock).mockResolvedValue({
    status: 200,
    data: { sessionId: "session-1" },
  });

  const response = await loginAPI(formData);

  expect(apiClient).toHaveBeenCalledWith("post", Endpoints.LOGIN, formData);
  expect(response).toEqual({
    status: 200,
    data: { sessionId: "session-1" },
  });
});

test("loginAPI throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = loginAPI({
    user_unique_id: "jai123",
    user_password: "password",
  });
  await expect(response).rejects.toThrow("Error logging in");
});

test("getSummaryAPI calls summary endpoint with auth header", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { userSummary: {} },
  });

  const response = await getSummaryAPI("session-1");

  expect(apiClient).toHaveBeenCalledWith(
    "get",
    Endpoints.GET_SUMMARY,
    {},
    {
      headers: {
        Authorization: "Bearer session-1",
      },
    },
  );
  expect(response).toEqual({ userSummary: {} });
});

test("getSummaryAPI throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = getSummaryAPI("session-1");
  await expect(response).rejects.toThrow("Error fetching summary");
});

test("registerAPI calls register endpoint", async () => {
  const formData = {
    user_unique_id: "jai123",
    user_active: true,
    user_org_limit: 1,
  };

  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  const response = await registerAPI(formData);

  expect(apiClient).toHaveBeenCalledWith("post", Endpoints.SIGN_UP, formData);
  expect(response).toEqual({ success: true });
});

test("registerAPI throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const formData = {
    user_unique_id: "jai123",
    user_active: true,
    user_org_limit: 1,
  };

  const response = registerAPI(formData);
  await expect(response).rejects.toThrow("Error registering user");
});

test("validateUsername calls username validation endpoint", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  const response = await validateUsername("jai123");

  expect(apiClient).toHaveBeenCalledWith(
    "get",
    `${Endpoints.VALIDATE_USERNAME}?user_unique_id=jai123`,
  );

  expect(response).toEqual({
    success: true,
  });
});

test("validateEmail calls email validation endpoint on success", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true, emailValidation: { exists: false } },
  });

  const response = await validateEmail("test@example.com");

  expect(apiClient).toHaveBeenCalledWith(
    "get",
    `${Endpoints.VALIDATE_EMAIL}?user_email=test%40example.com`,
  );
  expect(response).toEqual({
    success: true,
    emailValidation: { exists: false },
  });
});

test("validateEmail throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = validateEmail("test@example.com");
  await expect(response).rejects.toThrow("Error validating email details");
});

test("validatePhone calls phone validation endpoint on success", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true, phoneValidation: { exists: false } },
  });

  const response = await validatePhone("1234567890");

  expect(apiClient).toHaveBeenCalledWith(
    "get",
    `${Endpoints.VALIDATE_PHONE}?user_unique_id=1234567890`,
  );
  expect(response).toEqual({
    success: true,
    phoneValidation: { exists: false },
  });
});

test("validatePhone throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = validatePhone("1234567890");
  await expect(response).rejects.toThrow("Error validating phone details");
});

test("validateUsername throws an error on failure", async () => {
  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = validateUsername("jai123");
  await expect(response).rejects.toThrow("Error validating username details");
});
