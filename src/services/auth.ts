import { api } from './api';

export interface AuthUser {
  id: string | number;
  dsNome: string;
  dsEmail: string;
  dsRole?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  async register(dsNome: string, dsEmail: string, dsSenha: string): Promise<void> {
    await api.post(
      '/auth/register',
      { nome: dsNome, email: dsEmail, senha: dsSenha, tipoUsuario: 'OPERACIONAL' },
      { skipAuth: true },
    );
  },

  async login(dsEmail: string, dsSenha: string): Promise<LoginResponse> {
    const data = await api.post<LoginResponse>(
      '/auth/login',
      { email: dsEmail, senha: dsSenha },
      { skipAuth: true },
    );

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));

    return data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
