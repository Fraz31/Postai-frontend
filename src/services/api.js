// Global API wrapper for PostAI frontend
// Pure JS, no build tools. Use via <script type="module"> if you want ES modules,
// or include functions on window if you want classic script tags.

const API_BASE_URL = window.BACKEND_URL || 'https://postai-backend-q8u9.onrender.com/api';

const ACCESS_TOKEN_KEY = 'postai_access_token';
const REFRESH_TOKEN_KEY = 'postai_refresh_token';

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem('postai_token') || null;
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
}

function saveTokens(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    // Backwards compat for existing code
    localStorage.setItem('postai_token', accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

async function refreshTokenIfNeeded() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await res.json();
    if (data && data.accessToken) {
      saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }
  } catch (e) {
    // On any refresh error, clear tokens
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('postai_token');
  }

  return null;
}

async function authorizedFetch(path, options = {}) {
  let token = getAccessToken();
  const headers = options.headers ? { ...options.headers } : {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  let res = await fetch(`${API_BASE_URL}${path}`, finalOptions);

  if (res.status === 401) {
    // Try refresh once
    const newToken = await refreshTokenIfNeeded();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      const retryOptions = {
        ...finalOptions,
        headers
      };
      res = await fetch(`${API_BASE_URL}${path}`, retryOptions);
    }
  }

  // If still unauthorized, redirect to login
  if (res.status === 401) {
    window.location.href = '/login.html';
    return Promise.reject(new Error('Unauthorized'));
  }

  return res;
}

export async function apiGet(path) {
  const res = await authorizedFetch(path, { method: 'GET' });
  return res.json();
}

export async function apiPost(path, body) {
  const res = await authorizedFetch(path, {
    method: 'POST',
    body: JSON.stringify(body || {})
  });
  return res.json();
}

export async function apiPut(path, body) {
  const res = await authorizedFetch(path, {
    method: 'PUT',
    body: JSON.stringify(body || {})
  });
  return res.json();
}

export const apiAuthStorage = { saveTokens, getAccessToken, getRefreshToken };
