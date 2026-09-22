const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE = rawApiBase.replace(/\/+$/, '');

const TOKEN_KEY = 'mini_canvas_jwt_token';
const USER_KEY = 'mini_canvas_user_data';

export const authStorage = {
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser(user) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

function getAuthHeaders() {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      console.warn('Backend offline:', err);
      return { status: 'offline' };
    }
  },

  // Authentication
  async register({ name, email, password }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
    }
    return data;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
    }
    return data;
  },

  async getMe() {
    const token = authStorage.getToken();
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      // If token expired or invalid, clear local auth
      authStorage.clear();
      return null;
    }
    const data = await res.json();
    if (data.user) {
      authStorage.setUser(data.user);
    }
    return data.user;
  },

  logout() {
    authStorage.clear();
  },

  // Canvases
  async getCanvases() {
    const res = await fetch(`${API_BASE}/canvases`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch canvases');
    return data.data;
  },

  async getCanvasById(id) {
    const res = await fetch(`${API_BASE}/canvases/${id}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch canvas');
    return data.data;
  },

  async createCanvas(canvasData) {
    const res = await fetch(`${API_BASE}/canvases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(canvasData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save canvas');
    return data.data;
  },

  async updateCanvas(id, canvasData) {
    const res = await fetch(`${API_BASE}/canvases/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(canvasData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update canvas');
    return data.data;
  },

  async deleteCanvas(id) {
    const res = await fetch(`${API_BASE}/canvases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete canvas');
    return data.data;
  },
};
