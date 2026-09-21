const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

  async getCanvases() {
    const res = await fetch(`${API_BASE}/canvases`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch canvases');
    return data.data;
  },

  async getCanvasById(id) {
    const res = await fetch(`${API_BASE}/canvases/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch canvas');
    return data.data;
  },

  async createCanvas(canvasData) {
    const res = await fetch(`${API_BASE}/canvases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(canvasData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save canvas');
    return data.data;
  },

  async updateCanvas(id, canvasData) {
    const res = await fetch(`${API_BASE}/canvases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(canvasData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update canvas');
    return data.data;
  },

  async deleteCanvas(id) {
    const res = await fetch(`${API_BASE}/canvases/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete canvas');
    return data.data;
  },
};
