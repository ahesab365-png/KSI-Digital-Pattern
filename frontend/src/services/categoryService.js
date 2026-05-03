import { CATEGORIES_URL } from './api.config';

export const categoryService = {
  getAll: async () => {
    try {
      const res = await fetch(CATEGORIES_URL);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories || [];
    } catch (error) {
      console.error("categoryService getAll error:", error);
      return [];
    }
  },

  upsert: async (categoryData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${CATEGORIES_URL}/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save category');
      }
      const data = await res.json();
      return data.category;
    } catch (error) {
      console.error("categoryService upsert error:", error);
      throw error;
    }
  },

  remove: async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${CATEGORIES_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return res.ok;
    } catch (error) {
      console.error("categoryService remove error:", error);
      return false;
    }
  }
};
