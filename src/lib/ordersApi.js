// API base URL - updated to your backend URL
import  API_BASE_URL  from '../Config.js'; // Fixed import syntax

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
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Orders API functions
export const ordersApi = {
    // Get all orders with pagination support
    getAllOrders: async (page = 0, size = 25, sortBy = 'createdAt', sortDir = 'desc') => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: `${sortBy},${sortDir}`
        });

        return await apiRequest(`/orders?${params.toString()}`);
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

    // Update order status specifically
    updateOrderStatus: async (orderId, status) => {
        return await apiRequest(`/orders/${orderId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: status.toUpperCase() }),
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

    // Get orders by status (when you add the endpoint)
    getOrdersByStatus: async (status, page = 0, size = 25) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        return await apiRequest(`/orders/status/${status.toLowerCase()}?${params.toString()}`);
    },

    // Search orders
    searchOrders: async (query, page = 0, size = 25) => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString(),
        });

        return await apiRequest(`/orders/search?${params.toString()}`);
    },

    // Get order statistics
    getOrderStats: async () => {
        return await apiRequest('/orders/stats');
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

// Enhanced search function with frontend filtering fallback
export const searchOrders = async (searchTerm, page = 0, size = 25) => {
    try {
        // Try backend search first (if endpoint exists)
        try {
            return await ordersApi.searchOrders(searchTerm, page, size);
        } catch (backendError) {
            console.log('Backend search not available, falling back to frontend filtering');

            // Fallback to frontend filtering
            const allOrders = await ordersApi.getAllOrders(0, 1000); // Get more records for searching
            const orders = allOrders.content || allOrders.data || allOrders;

            if (!searchTerm) return allOrders;

            const filtered = orders.filter(order =>
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id?.toString().includes(searchTerm) ||
                order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderNumber?.toString().includes(searchTerm)
            );

            // Simulate pagination for frontend filtering
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedResults = filtered.slice(startIndex, endIndex);

            return {
                content: paginatedResults,
                totalElements: filtered.length,
                totalPages: Math.ceil(filtered.length / size),
                number: page,
                size: size
            };
        }
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

// Default export for compatibility with your Orders page component
const defaultOrdersApi = {
    getAllOrders: ordersApi.getAllOrders,
    getOrderById: ordersApi.getOrderById,
    createOrder: ordersApi.createOrder,
    updateOrder: ordersApi.updateOrder,
    updateOrderStatus: ordersApi.updateOrderStatus,
    deleteOrder: ordersApi.deleteOrder,
    getOrdersByStatus: ordersApi.getOrdersByStatus,
    searchOrders: ordersApi.searchOrders,
    getOrderStats: ordersApi.getOrderStats,
};

export default defaultOrdersApi;