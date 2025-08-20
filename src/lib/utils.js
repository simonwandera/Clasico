import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Please upload images smaller than 5MB.');
  }

  return true;
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate placeholder image URL
export const getPlaceholderImage = (width = 200, height = 200, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(text)}`;
};

// Strip HTML tags from text
export const stripHtmlTags = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Validate form data
export const validateProductLineForm = (data) => {
  const errors = {};

  if (!data.productLine?.trim()) {
    errors.productLine = 'Product line name is required';
  } else if (data.productLine.length > 100) {
    errors.productLine = 'Product line name must be less than 100 characters';
  }

  if (!data.textDescription?.trim()) {
    errors.textDescription = 'Text description is required';
  } else if (data.textDescription.length > 500) {
    errors.textDescription = 'Text description must be less than 500 characters';
  }

  if (data.htmlDescription && data.htmlDescription.length > 1000) {
    errors.htmlDescription = 'HTML description must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if URL is valid
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Generate unique ID (for offline usage)
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};