const REGISTERED_USERS_KEY = "registeredUsers";

export interface StoredUser {
  user_unique_id: string;
  user_password: string;
  user_first_name: string;
  user_middle_name?: string;
  user_last_name: string;
  user_email: string;
  prefix?: string;
  user_phone?: string;
  user_dob?: string;
  user_gender?: string;
  user_bio?: string;
  user_img?: string;
  user_country?: string;
  user_state?: string;
  user_city?: string;
  user_pincode?: string;
  user_landmark?: string;
  user_address?: string;
  user_agreement?: boolean;
  user_active?: boolean;
  user_org_limit?: number | null;
  user_verified?: string;
  user_selected_org?: string | null;
  user_created_date?: string;
  user_last_login?: string;
  user_is_active?: boolean;
  registered_at: string;
  // Security question for forgot password
  security_question?: string;
  security_answer?: string;
}

export const userStore = {
  /** Save a newly registered user to sessionStorage */
  registerUser: (user: StoredUser): void => {
    const existing = userStore.getAllUsers();
    existing.push(user);
    sessionStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
  },

  /** Get all registered users */
  getAllUsers: (): StoredUser[] => {
    try {
      const data = sessionStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /** Get a single user by username */
  getUser: (user_unique_id: string): StoredUser | null => {
    return (
      userStore.getAllUsers().find((u) => u.user_unique_id === user_unique_id) ?? null
    );
  },

  /** Check if a username already exists */
  usernameExists: (user_unique_id: string): boolean => {
    return userStore.getAllUsers().some((u) => u.user_unique_id === user_unique_id);
  },

  /** Check if an email already exists */
  emailExists: (email: string): boolean => {
    return userStore.getAllUsers().some((u) => u.user_email === email);
  },

  /** Validate login — returns full user if credentials match, null otherwise */
  validateLogin: (user_unique_id: string, user_password: string): StoredUser | null => {
    const user = userStore.getUser(user_unique_id);
    if (!user) return null;
    if (user.user_password !== user_password) return null;
    return user;
  },

  /** Update password after forgot password reset */
  updatePassword: (user_unique_id: string, new_password: string): boolean => {
    const all = userStore.getAllUsers();
    const index = all.findIndex((u) => u.user_unique_id === user_unique_id);
    if (index === -1) return false;
    all[index].user_password = new_password;
    sessionStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(all));
    return true;
  },

  /** Validate security question answer */
  validateSecurityAnswer: (user_unique_id: string, answer: string): boolean => {
    const user = userStore.getUser(user_unique_id);
    if (!user) return false;
    return user.security_answer?.toLowerCase() === answer.toLowerCase();
  },
};

// Uses sessionStorage only — data clears on tab close.