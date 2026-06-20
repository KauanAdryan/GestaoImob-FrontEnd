import { api } from './api';
import { tokenStorage } from './tokenStorage';

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

  async login(dsEmail: string, dsSenha: string, lembrarDeMim = false): Promise<LoginResponse> {
    const data = await api.post<LoginResponse>(
      '/auth/login',
      { email: dsEmail, senha: dsSenha },
      { skipAuth: true },
    );

    tokenStorage.save(data.token, data.user, lembrarDeMim);

    return data;
  },

  logout() {
    tokenStorage.clear();
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email }, { skipAuth: true });
  },

  async verifyResetCode(email: string, codigo: string): Promise<void> {
    await api.post('/auth/verify-reset-code', { email, codigo }, { skipAuth: true });
  },

  async resetPassword(email: string, codigo: string, novaSenha: string): Promise<void> {
    await api.post('/auth/reset-password', { email, codigo, novaSenha }, { skipAuth: true });
  },

  getToken(): string | null {
    return tokenStorage.getToken();
  },

  getUser(): AuthUser | null {
    // Try localStorage/sessionStorage first (populated when backend returns user in login response)
    const raw = tokenStorage.getRawUser();
    if (raw && raw !== 'undefined' && raw !== 'null') {
      try {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.id) return parsed;
      } catch {}
    }
    // Fallback: decode JWT payload to extract user info
    const token = tokenStorage.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload?.sub) return null;
      return {
        id:      payload.id ?? payload.userId ?? payload.user_id ?? payload.sub,
        dsNome:  payload.nome  ?? payload.name   ?? payload.dsNome  ?? '',
        dsEmail: payload.email ?? payload.dsEmail ?? payload.sub   ?? '',
        dsRole:  payload.role  ?? payload.dsRole,
      };
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
