// src/services/validateUsernameAPI.ts

import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { devEnv } from "src/utils/constants";

const isDevEnv: boolean = process.env.REACT_APP_ENVIRONMENT === devEnv.DEV;

export const validateUsername = async (username: string) => {
  console.log("Checking username:", username);
  try {
    // In dev (stubs), query params break the .json file lookup — skip them
    // In prod, append the query param so the real backend receives the username
    const url = isDevEnv
      ? Endpoints.VALIDATE_USERNAME
      : `${Endpoints.VALIDATE_USERNAME}?${new URLSearchParams({ user_unique_id: username }).toString()}`;

    const response = await apiClient("get", url);
    return response.data;
  } catch (error) {
    console.error("Error validating username details:", error);
    throw new Error("Error validating username details");
  }
};