import { apiClient } from "src/api/apiClient";
import Endpoints from "src/api/endpoints";

interface RegisterFormData {
  user_unique_id?: string;
  user_first_name?: string;
  user_middle_name?: string;
  user_last_name?: string;
  user_email?: string;
  user_password?: string; // plain text — backend hashes with bcrypt/argon2
  prefix?: string;
  user_phone?: string;
  user_dob?: any;
  user_gender?: string;
  user_bio?: string;
  user_img?: string;
  user_country?: string;
  user_state?: string;
  user_city?: string;
  user_pincode?: string;
  user_landmark?: string;
  user_address?: string; // fixed: string not string[]
  user_agreement?: boolean;
  user_role?: string;
  user_verified?: string;
  user_active: boolean;
  user_org_limit: number;
}

export const registerAPI = async (formData: RegisterFormData) => {
  try {
    const response = await apiClient("post", Endpoints.SIGN_UP, formData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
