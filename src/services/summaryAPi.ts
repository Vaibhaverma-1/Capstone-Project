import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";
import { tokenUtils } from "src/utils/tokenUtils";

export const getSummaryAPI = async () => {
  const token = tokenUtils.getToken();

  // Guard: if no token or token expired, clear storage and go to login
  if (!token || !tokenUtils.isTokenValid()) {
    tokenUtils.removeToken();
    window.location.href = "/";
    return null;
  }

  try {
    const response = await apiClient(
      "get",
      Endpoints.GET_SUMMARY,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get summary error:", error);
    throw error;
  }
};