import {useEffect, useState} from 'react';
import productLineService from '../services/ProductLineService';

export const useProductLines = () => {
    const [productLines, setProductLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            setLoading(true);
            const newProductLine = await productLineService.createProductLine(productLineData);
            // Option 1: Optimistic update
            setProductLines(prev => [...prev, newProductLine]);

            // Option 2: Force complete refresh (better if you need latest server state)
            setRefreshTrigger(prev => prev + 1);

            return newProductLine;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update existing product line
    const updateProductLine = async (id, productLineData) => {
        try {
            setLoading(true);
            const updatedProductLine = await productLineService.updateProductLine(id, productLineData);
            setProductLines(prev =>
                prev.map(line => line.id === id ? updatedProductLine : line)
            );
            return updatedProductLine;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete product line
    const deleteProductLine = async (id) => {
        try {
            setLoading(true);
            await productLineService.deleteProductLine(id);
            setProductLines(prev => prev.filter(line => line.id !== id));
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and refresh when trigger changes
    useEffect(() => {
        fetchProductLines();
    }, [refreshTrigger]);

    return {
        productLines,
        loading,
        error,
        refreshTrigger,
        fetchProductLines,
        addProductLine,
        updateProductLine,
        deleteProductLine,
        triggerRefresh: () => setRefreshTrigger(prev => prev + 1)
    };
};