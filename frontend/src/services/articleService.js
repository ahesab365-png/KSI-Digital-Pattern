const BASE_URL = 'http://localhost:7000';
const ARTICLES_URL = `${BASE_URL}/articles`;

export const articleService = {
  // Upload Image to Cloudinary
  uploadImage: async (file) => {
    try {
        const token = localStorage.getItem('admin_token');
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${BASE_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!res.ok) throw new Error('فشل رفع الصورة');
        const data = await res.json();
        return data.imageUrl; // Cloudinary URL
    } catch (error) {
        console.error("articleService uploadImage error:", error);
        throw error;
    }
  },

  // Get all articles
  getAll: async () => {
    try {
        const res = await fetch(ARTICLES_URL);
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error("articleService getAll error:", error);
        return [];
    }
  },

  // Save new article
  save: async (article) => {
    try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(ARTICLES_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(article)
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to save article');
        }
        
        const data = await res.json();
        return data.article;
    } catch (error) {
        console.error("articleService save error:", error);
        throw error;
    }
  },

  // Get articles by program and main category
  getByCategory: async (programId, mainCategory) => {
    try {
        const res = await fetch(`${ARTICLES_URL}?program=${programId}&mainCategory=${mainCategory}`);
        if (!res.ok) throw new Error('Failed to fetch filtered articles');
        const data = await res.json();
        return (data.articles || []).filter(a => a.isPublic);
    } catch (error) {
        console.error("articleService getByCategory error:", error);
        return [];
    }
  },

  // Get unique subcategories
  getSubCategories: async (programId, mainCategory) => {
    const articles = await articleService.getByCategory(programId, mainCategory);
    
    const subCatsMap = {};
    articles.forEach(art => {
      if (!subCatsMap[art.category]) {
        subCatsMap[art.category] = art._id;
      }
    });
    
    return Object.keys(subCatsMap).map(cat => ({
      name: cat,
      articleId: subCatsMap[cat]
    }));
  },

  // Get article by ID
  getById: async (id) => {
    try {
        const res = await fetch(`${ARTICLES_URL}/${id}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        return data.article;
    } catch (error) {
        console.error("articleService getById error:", error);
        return null;
    }
  },

  // Update article
  update: async (id, updatedData) => {
    try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${ARTICLES_URL}/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });
        if (!res.ok) throw new Error('Failed to update article');
        const data = await res.json();
        return data.article;
    } catch (error) {
        console.error("articleService update error:", error);
        throw error;
    }
  },

  // Remove article
  remove: async (id) => {
    try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`${ARTICLES_URL}/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        });
        return res.ok;
    } catch (error) {
        console.error("articleService remove error:", error);
        return false;
    }
  }
};
