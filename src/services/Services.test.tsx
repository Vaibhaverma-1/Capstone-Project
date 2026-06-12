import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { loginAPI } from "./loginApi";
import { getSummaryAPI } from "./summaryAPi";

import { registerAPI } from "./registerAPI";
import { validateUsername } from "./validateUsernameAPI";
import { validateEmail } from "./validateEmailAPI";
import { validatePhone } from "./validatePhoneAPI";
import { updateProfileAPI } from "./updateProfileAPI";
import { tokenUtils } from "src/utils/tokenUtils";

jest.mock("src/api/apiClient", () => ({
  apiClient: jest.fn(),
}));

jest.mock("src/utils/tokenUtils", () => ({
  tokenUtils: {
    getToken: jest.fn(),
    isTokenValid: jest.fn(),
    removeToken: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("getSummaryAPI calls summary endpoint with auth header", async () => {
  (tokenUtils.getToken as jest.Mock).mockReturnValue("session-1");
  (tokenUtils.isTokenValid as jest.Mock).mockReturnValue(true);

  (apiClient as jest.Mock).mockResolvedValue({
    data: { userSummary: {} },
  });

  const response = await getSummaryAPI();

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
  (tokenUtils.getToken as jest.Mock).mockReturnValue("session-1");
  (tokenUtils.isTokenValid as jest.Mock).mockReturnValue(true);

  (apiClient as jest.Mock).mockRejectedValue(new Error("Network Error"));

  const response = getSummaryAPI();
  await expect(response).rejects.toThrow("Network Error");
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
  await expect(response).rejects.toThrow("Network Error");
});

test("validateUsername calls username validation endpoint", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true },
  });

  const response = await validateUsername("jai123");

  const isDevEnv = process.env.REACT_APP_ENVIRONMENT === "development";
  const expectedUrl = isDevEnv
    ? Endpoints.VALIDATE_USERNAME
    : `${Endpoints.VALIDATE_USERNAME}?user_unique_id=jai123`;

  expect(apiClient).toHaveBeenCalledWith("get", expectedUrl);

  expect(response).toEqual({
    success: true,
  });
});

test("validateEmail calls email validation endpoint on success", async () => {
  (apiClient as jest.Mock).mockResolvedValue({
    data: { success: true, emailValidation: { exists: false } },
  });

  const response = await validateEmail("test@example.com");

  const isDevEnv = process.env.REACT_APP_ENVIRONMENT === "development";
  const expectedUrl = isDevEnv
    ? Endpoints.VALIDATE_EMAIL
    : `${Endpoints.VALIDATE_EMAIL}?user_email=test%40example.com`;

  expect(apiClient).toHaveBeenCalledWith("get", expectedUrl);
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

  const isDevEnv = process.env.REACT_APP_ENVIRONMENT === "development";
  const expectedUrl = isDevEnv
    ? Endpoints.VALIDATE_PHONE
    : `${Endpoints.VALIDATE_PHONE}?user_phone=1234567890`;

  expect(apiClient).toHaveBeenCalledWith("get", expectedUrl);
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
