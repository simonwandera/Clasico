// src/services/productLineService.js

import { apiRequest, ENDPOINTS, HTTP_METHODS } from '../lib/api';

class ProductLineService {
  
  /**
   * Get all product lines with optional pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (0-based)
   * @param {number} params.size - Page size
   * @param {string} params.sort - Sort field
   * @param {string} params.direction - Sort direction (asc/desc)
   */
  async getAllProductLines(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page !== undefined) queryParams.append('page', params.page);
      if (params.size !== undefined) queryParams.append('size', params.size);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.direction) queryParams.append('direction', params.direction);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `${ENDPOINTS.PRODUCT_LINES}?${queryString}` : ENDPOINTS.PRODUCT_LINES;
      
      return await apiRequest(endpoint, {
        method: HTTP_METHODS.GET
      });
    } catch (error) {
      console.error('Error fetching product lines:', error);
      throw new Error('Failed to fetch product lines. Please try again.');
    }
  }

  /**
   * Get product line by ID
   * @param {number} id - Product line ID
   */
  async getProductLineById(id) {
    try {
      return await apiRequest(ENDPOINTS.PRODUCT_LINE_BY_ID(id), {
        method: HTTP_METHODS.GET
      });
    } catch (error) {
      console.error('Error fetching product line:', error);
      throw new Error(`Failed to fetch product line with ID ${id}`);
    }
  }

  /**
   * Create new product line
   * @param {Object} productLineData - Product line data
   */
  async createProductLine(productLineData) {
  try {
    this.validateProductLineData(productLineData);
    
    return await apiRequest(ENDPOINTS.PRODUCT_LINES, {
      method: HTTP_METHODS.POST,
      body: productLineData, // Don't stringify - pass FormData directly
      headers: {
        // Let the browser set the Content-Type with boundary
      }
    });
  } catch (error) {
    console.error('Error creating product line:', error);
    throw new Error('Failed to create product line. Please check your data and try again.');
  }
}

  /**
   * Update existing product line
   * @param {number} id - Product line ID
   * @param {Object} productLineData - Updated product line data
   */
  async updateProductLine(id, productLineData) {
    try {
      // Validate required fields
      this.validateProductLineData(productLineData);
      
      return await apiRequest(ENDPOINTS.PRODUCT_LINE_BY_ID(id), {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify(productLineData)
      });
    } catch (error) {
      console.error('Error updating product line:', error);
      throw new Error(`Failed to update product line with ID ${id}`);
    }
  }

  /**
   * Delete product line
   * @param {number} id - Product line ID
   */
  async deleteProductLine(id) {
    try {
      await apiRequest(ENDPOINTS.PRODUCT_LINE_BY_ID(id), {
        method: HTTP_METHODS.DELETE
      });
      return true;
    } catch (error) {
      console.error('Error deleting product line:', error);
      throw new Error(`Failed to delete product line with ID ${id}`);
    }
  }

  /**
   * Search product lines
   * @param {string} searchTerm - Search query
   * @param {Object} params - Additional search parameters
   */
  async searchProductLines(searchTerm, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchTerm);
      
      // Add additional search parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const endpoint = `${ENDPOINTS.SEARCH_PRODUCT_LINES}?${queryParams.toString()}`;
      
      return await apiRequest(endpoint, {
        method: HTTP_METHODS.GET
      });
    } catch (error) {
      console.error('Error searching product lines:', error);
      throw new Error('Failed to search product lines. Please try again.');
    }
  }

  /**
   * Upload image file
   * @param {File} file - Image file to upload
   */
  async uploadImage(file) {
    try {
      // Validate file
      this.validateImageFile(file);
      
      const formData = new FormData();
      formData.append('image', file);
      
      return await apiRequest(ENDPOINTS.UPLOAD_IMAGE, {
        method: HTTP_METHODS.POST,
        body: formData,
        headers: {} // Remove Content-Type to let browser set it for FormData
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  /**
   * Validate product line data
   * @param {Object} data - Product line data to validate
   */
  validateProductLineData(data) {
    const errors = [];
    
    if (!data.productLine || !data.productLine.trim()) {
      errors.push('Product line name is required');
    }
    
    if (!data.textDescription || !data.textDescription.trim()) {
      errors.push('Text description is required');
    }
    
    if (data.productLine && data.productLine.length > 100) {
      errors.push('Product line name must be less than 100 characters');
    }
    
    if (data.textDescription && data.textDescription.length > 500) {
      errors.push('Text description must be less than 500 characters');
    }
    
    if (data.htmlDescription && data.htmlDescription.length > 2000) {
      errors.push('HTML description must be less than 2000 characters');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Validate image file
   * @param {File} file - Image file to validate
   */
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload images smaller than 5MB.');
    }

    return true;
  }

  /**
   * Batch operations
   */
  async bulkCreateProductLines(productLinesArray) {
    try {
      return await apiRequest(`${ENDPOINTS.PRODUCT_LINES}/bulk`, {
        method: HTTP_METHODS.POST,
        body: JSON.stringify(productLinesArray)
      });
    } catch (error) {
      console.error('Error bulk creating product lines:', error);
      throw new Error('Failed to create multiple product lines');
    }
  }

  async bulkDeleteProductLines(ids) {
    try {
      return await apiRequest(`${ENDPOINTS.PRODUCT_LINES}/bulk-delete`, {
        method: HTTP_METHODS.DELETE,
        body: JSON.stringify({ ids })
      });
    } catch (error) {
      console.error('Error bulk deleting product lines:', error);
      throw new Error('Failed to delete multiple product lines');
    }
  }
}

export default new ProductLineService();