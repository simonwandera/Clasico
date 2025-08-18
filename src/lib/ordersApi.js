// API base URL - updated to your backend URL
import { API_BASE_URL } from '../Config';
// Generic API request handler with error handling
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // Add any auth headers here if needed
            // 'Authorization': `Bearer ${getAuthToken()}`
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        // Handle different response statuses
        if (response.status === 204) {
            return null; // No content (for DELETE operations)
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Orders API functions
export const ordersApi = {
    // Get all orders
    getAllOrders: async () => {
        return await apiRequest('/orders');
    },

    // Get specific order by ID
    getOrderById: async (id) => {
        return await apiRequest(`/orders/${id}`);
    },

    // Create new order
    createOrder: async (orderData) => {
        return await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Update existing order
    updateOrder: async (id, orderData) => {
        return await apiRequest(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(orderData),
        });
    },

    // Create or update order (using your custom endpoint)
    createOrUpdateOrder: async (orderData) => {
        return await apiRequest('/orders/createOrUpdateOrders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Delete order
    deleteOrder: async (id) => {
        return await apiRequest(`/orders/${id}`, {
            method: 'DELETE',
        });
    },
};

// Order Details API functions
export const orderDetailsApi = {
    // Get all order details
    getAllOrderDetails: async () => {
        return await apiRequest('/orderDetails');
    },

    // Get specific order detail by ID
    getOrderDetailById: async (id) => {
        return await apiRequest(`/orderDetails/${id}`);
    },

    // Create new order detail
    createOrderDetail: async (orderDetailData) => {
        return await apiRequest('/orderDetails', {
            method: 'POST',
            body: JSON.stringify(orderDetailData),
        });
    },

    // Create or update order detail (using your custom endpoint)
    createOrUpdateOrderDetail: async (orderDetailData) => {
        return await apiRequest('/orderDetails/createOrUpdateOrderDetails', {
            method: 'POST',
            body: JSON.stringify(orderDetailData),
        });
    },

    // Delete order detail
    deleteOrderDetail: async (id) => {
        return await apiRequest(`/orderDetails/${id}`, {
            method: 'DELETE',
        });
    },

    // Get order details by order ID (you might want to add this endpoint to your backend)
    getOrderDetailsByOrderId: async (orderId) => {
        // This assumes you'll add a filter parameter to your backend
        // Alternative: get all and filter on frontend (less efficient)
        const allDetails = await apiRequest('/orderDetails');
        return allDetails.filter(detail => detail.orderId === orderId);
    },
};

// Combined function to get order with its details
export const getOrderWithDetails = async (orderId) => {
    try {
        const [order, orderDetails] = await Promise.all([
            ordersApi.getOrderById(orderId),
            orderDetailsApi.getOrderDetailsByOrderId(orderId)
        ]);

        return {
            ...order,
            orderDetails: orderDetails || []
        };
    } catch (error) {
        console.error('Error fetching order with details:', error);
        throw error;
    }
};

// Search orders function (you might want to add search endpoint to backend)
export const searchOrders = async (searchTerm) => {
    try {
        const allOrders = await ordersApi.getAllOrders();

        if (!searchTerm) return allOrders;

        // Frontend filtering - consider adding backend search for better performance
        const filtered = allOrders.filter(order =>
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toString().includes(searchTerm) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    } catch (error) {
        console.error('Error searching orders:', error);
        throw error;
    }
};

// Utility function to handle loading states
export const withLoading = (apiFunction) => {
    return async (...args) => {
        try {
            const result = await apiFunction(...args);
            return { data: result, error: null, loading: false };
        } catch (error) {
            return { data: null, error: error.message, loading: false };
        }
    };
};