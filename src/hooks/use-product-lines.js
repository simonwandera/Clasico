// src/hooks/use-product-lines.js

import { useState, useEffect } from 'react';
import productLineService from '../services/ProductLineService';

export const useProductLines = () => {
  const [productLines, setProductLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all product lines
  const fetchProductLines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productLineService.getAllProductLines();
      setProductLines(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product lines:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new product line
  const addProductLine = async (productLineData) => {
    try {
      const newProductLine = await productLineService.createProductLine(productLineData);
      setProductLines(prev => [...prev, newProductLine]);
      return newProductLine;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update existing product line
  const updateProductLine = async (id, productLineData) => {
    try {
      const updatedProductLine = await productLineService.updateProductLine(id, productLineData);
      setProductLines(prev => 
        prev.map(line => line.id === id ? updatedProductLine : line)
      );
      return updatedProductLine;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete product line
  const deleteProductLine = async (id) => {
    try {
      await productLineService.deleteProductLine(id);
      setProductLines(prev => prev.filter(line => line.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Search product lines
  const searchProductLines = async (searchTerm) => {
    try {
      setLoading(true);
      const results = await productLineService.searchProductLines(searchTerm);
      setProductLines(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProductLines();
  }, []);

  return {
    productLines,
    loading,
    error,
    fetchProductLines,
    addProductLine,
    updateProductLine,
    deleteProductLine,
    searchProductLines,
    setError
  };
};