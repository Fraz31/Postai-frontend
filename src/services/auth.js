import { apiGet, apiPost, apiAuthStorage } from './api.js';

const USER_KEY = 'postai_user';

export async function login(email) {
  const data = await apiPost('/auth/login', { email });
  if (data && data.accessToken) {
    apiAuthStorage.saveTokens(data.accessToken, data.refreshToken);
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  }
  return data;
}

export async function register(email) {
  const data = await apiPost('/auth/register', { email });
  if (data && data.accessToken) {
    apiAuthStorage.saveTokens(data.accessToken, data.refreshToken);
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  }
  return data;
}

export async function me() {
  const data = await apiGet('/auth/me');
  if (data && data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  return data;
}

export async function refresh() {
  const refreshToken = apiAuthStorage.getRefreshToken();
  if (!refreshToken) return null;
  const data = await apiPost('/auth/refresh', { refreshToken });
  if (data && data.accessToken) {
    apiAuthStorage.saveTokens(data.accessToken, data.refreshToken);
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  }
  return data;
}

export function logout() {
  localStorage.removeItem('postai_token');
  localStorage.removeItem('postai_access_token');
  localStorage.removeItem('postai_refresh_token');
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login.html';
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
