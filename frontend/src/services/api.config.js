/**
 * Centralized API configuration for the frontend.
 * This makes it easier to switch between local and production backend URLs.
 */

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000';

export const AUTH_URL = `${BASE_URL}/auth`;
export const USER_URL = `${BASE_URL}/user`;
export const ARTICLES_URL = `${BASE_URL}/articles`;
export const CATEGORIES_URL = `${BASE_URL}/categories`;
export const UPLOAD_URL = `${BASE_URL}/upload`;

export default {
  BASE_URL,
  AUTH_URL,
  USER_URL,
  ARTICLES_URL,
  CATEGORIES_URL,
  UPLOAD_URL,
};
