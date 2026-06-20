const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const tokenStorage = {
  save(token: string, user: unknown, remember: boolean) {
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
    target.setItem(TOKEN_KEY, token);
    target.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  },

  getRawUser(): string | null {
    return localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
