// src/services/validateEmailAPI.ts

import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

const isDevEnv: boolean = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;

export const validateEmail = async (email: string) => {
  console.log("Checking email:", email);
  try {
    const url = isDevEnv
      ? Endpoints.VALIDATE_EMAIL
      : `${Endpoints.VALIDATE_EMAIL}?${new URLSearchParams({ user_email: email }).toString()}`;

    const response = await apiClient("get", url);
    return response.data;
  } catch (error) {
    console.error("Error validating email details:", error);
    throw new Error("Error validating email details");
  }
};