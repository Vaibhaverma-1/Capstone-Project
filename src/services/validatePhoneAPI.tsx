// src/services/validatePhoneAPI.ts

import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

const isDevEnv: boolean = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;

export const validatePhone = async (phone: string) => {
  console.log("Checking phone:", phone);
  try {
    const url = isDevEnv
      ? Endpoints.VALIDATE_PHONE
      : `${Endpoints.VALIDATE_PHONE}?${new URLSearchParams({ user_phone: phone }).toString()}`;
      // Fixed: was sending user_unique_id for phone — now correctly sends user_phone

    const response = await apiClient("get", url);
    return response.data;
  } catch (error) {
    console.error("Error validating phone details:", error);
    throw new Error("Error validating phone details");
  }
};