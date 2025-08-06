import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CreditCard, Clock, Loader2, AlertCircle, Plus } from 'lucide-react';
import { ordersApi, orderDetailsApi, searchOrders } from '../lib/ordersApi';
import OrderDetails from '../components/OrderDetails';

export default function Orders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        console.log('Orders state updated:', orders);
        console.log('Selected order updated:', selectedOrder);
    }, [orders, selectedOrder]);

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
    }, []);

    // Handle search
    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching orders...');
            const ordersData = await ordersApi.getAllOrders();
            console.log('Raw orders data from API:', ordersData);

            setOrders(ordersData || []);

            // Set first order as selected if available
            if (ordersData && ordersData.length > 0) {
                console.log('Setting first order as selected:', ordersData[0]);
                setSelectedOrder(ordersData[0]);
            } else {
                console.log('No orders available');
                setSelectedOrder(null);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchOrders();
            return;
        }

        try {
            setLoading(true);
            console.log('Searching for:', searchTerm);
            const searchResults = await searchOrders(searchTerm);
            console.log('Search results:', searchResults);
            setOrders(searchResults || []);

            // Update selected order if it's not in search results
            if (selectedOrder && !searchResults.find(order => order.id === selectedOrder.id)) {
                setSelectedOrder(searchResults.length > 0 ? searchResults[0] : null);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error searching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderSelect = async (order) => {
        try {
            console.log('Order selected:', order);
            setSelectedOrder(order);

            // Optionally fetch additional order details if needed
            // You might want to fetch more detailed data here
            // const orderWithDetails = await orderDetailsApi.getOrderDetails(order.id);
            // setSelectedOrder({...order, ...orderWithDetails});
        } catch (err) {
            console.error('Error selecting order:', err);
        }
    };


    const filterOrders = (ordersList, filter) => {
        if (filter === 'All') return ordersList;

        return ordersList.filter(order => {
            const status = order.status?.toLowerCase();
            switch (filter.toLowerCase()) {
                case 'open':
                    return status === 'pending' || status === 'processing';
                case 'shipped':
                    return status === 'shipped' || status === 'in_transit';
                case 'delivered':
                    return status === 'delivered' || status === 'completed';
                default:
                    return true;
            }
        });
    };

    const filteredOrders = filterOrders(orders, activeFilter);

    const OrdersList = () => (
        <div className="w-80 bg-white border-r border-gray-200 h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200">
                {['All', 'Open', 'Shipped', 'Delivered'].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 py-3 px-4 text-sm font-medium ${
                            tab === activeFilter
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Loading orders...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Orders List */}
            {!loading && !error && (
                <div className="overflow-y-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No orders found' : 'No orders yet'}
                            </h3>
                            <p className="text-sm">
                                {searchTerm
                                    ? 'Try adjusting your search terms.'
                                    : 'Orders will appear here once they are created.'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={fetchOrders}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    Refresh
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id || order.orderNumber}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                    selectedOrder?.id === order.id || selectedOrder?.orderNumber === order.orderNumber
                                        ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                                onClick={() => handleOrderSelect(order)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">
                                        {order.customerName || order.customer?.customerName || order.customer || 'Unknown Customer'}
                                    </h3>
                                    <span className="text-sm font-semibold text-gray-900">
                                        Ksh{order.totalAmount || order.total || '0.00'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">
                                    #{order.id || order.orderNumber || 'N/A'}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        order.status?.toLowerCase() === 'delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status?.toLowerCase() === 'shipped'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'No date'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );

    // Main content area - shows welcome screen when no orders exist
    const MainContent = () => {
        if (loading) {
            return (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-600">Loading orders...</p>
                    </div>
                </div>
            );
        }

        if (orders.length === 0 && !searchTerm) {
            return (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8 max-w-md">
                        <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>



                    </div>
                </div>
            );
        }

        return <OrderDetails selectedOrder={selectedOrder} />;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <OrdersList />
            <MainContent />
        </div>
    );
}