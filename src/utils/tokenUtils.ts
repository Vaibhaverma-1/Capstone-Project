const TOKEN_KEY = "authToken";

export interface TokenPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: string;
  country?: string;
  role: string;
  iat: number;
  exp: number;
}

export const tokenUtils = {
  /** Save JWT to sessionStorage — clears on tab close */
  setToken: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  /** Retrieve JWT from sessionStorage */
  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /** Remove JWT on logout — does NOT touch registeredUsers in localStorage */
  removeToken: (): void => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem("userDetails");
  },

  /** Decode JWT payload and check expiry */
  isTokenValid: (): boolean => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  /** Decode and return the JWT payload */
  getTokenPayload: (): TokenPayload | null => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])) as TokenPayload;
    } catch {
      return null;
    }
  },

  /** Returns Authorization header object */
  getAuthHeader: (): { Authorization: string } | Record<string, never> => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};