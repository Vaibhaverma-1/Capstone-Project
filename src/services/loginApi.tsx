import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

interface LoginFormData {
  user_unique_id: string;
  user_password: string;
}

interface LoginResponseData {
  token: string;       // JWT returned by the backend on successful login
  sessionId?: string;  // kept for backwards compatibility if backend still sends it
}

export const loginAPI = async (formData: LoginFormData) => {
  try {
    const response = await apiClient<LoginResponseData>(
      "post",
      Endpoints.LOGIN,
      formData
    );
    return response;
  } catch (error) {
<<<<<<< HEAD
    //Need to add global notification for errors.  TODO
    console.log("----", error);
    throw new Error("Error logging in");
=======
    console.error("Login error:", error);
    throw error; // re-throw so the Login component catch block runs
>>>>>>> origin/main
  }
};