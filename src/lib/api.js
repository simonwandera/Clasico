// src/lib/api.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Generic API request handler
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  const config = {
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
    signal: controller.signal,
    ...options, // spread after so it can override headers if needed
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Handle different status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle empty responses (e.g., DELETE)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return response;
  } catch (error) {
    // Defensive error logging
    console.error("API Request failed:", error instanceof Error ? error.message : error);
    throw error;
  }
};

// API endpoints
export const ENDPOINTS = {
  PRODUCT_LINES: "/product-lines",
  PRODUCT_LINE_BY_ID: (id) => `/product-lines/${id}`,
  SEARCH_PRODUCT_LINES: "/product-lines/search",
  UPLOAD_IMAGE: "/upload/image",
};

// HTTP methods helper
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};
