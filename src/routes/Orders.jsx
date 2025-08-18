import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CreditCard, Clock, Loader2, AlertCircle, Plus, Bell, ChevronDown, Filter, FileText, Download, Printer, Upload, Copy, Edit3 } from 'lucide-react';
import { ordersApi, orderDetailsApi, searchOrders } from '../lib/ordersApi';
import OrderDetails from '../components/OrderDetails';

export default function Orders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isNewOrderDropdownOpen, setIsNewOrderDropdownOpen] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);

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

    const handleNewOrderAction = (action) => {
        console.log('New order action:', action);
        setIsNewOrderDropdownOpen(false);

        switch (action) {
            case 'manual':
                break;
            case 'csv':
                break;
            case 'template':
                break;
            case 'duplicate':
                break;
            default:
                break;
        }
    };

    const handleExportAction = (format) => {
        console.log('Export action:', format);
        setIsExportDropdownOpen(false);

        switch (format) {
            case 'pdf':
                break;
            case 'csv':
                break;
            case 'excel':
                break;
            case 'print':
                break;
            default:
                break;
        }
    };

    const OrdersList = () => (
        <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Improved Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
                {/* Top Header Row with better spacing */}
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

                        {/* Top Right Actions - Well Spaced */}
                        <div className="flex items-center space-x-3">
                            {/* Notifications */}
                            <div className="relative">
                                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Bell className="w-5 h-5" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                            {notifications}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Export Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </button>

                                {isExportDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="py-2">
                                            <button
                                                onClick={() => handleExportAction('pdf')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <FileText className="w-4 h-4 mr-3" />
                                                Export to PDF
                                            </button>
                                            <button
                                                onClick={() => handleExportAction('csv')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Download className="w-4 h-4 mr-3" />
                                                Export to CSV
                                            </button>
                                            <button
                                                onClick={() => handleExportAction('excel')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <FileText className="w-4 h-4 mr-3" />
                                                Export to Excel
                                            </button>
                                            <button
                                                onClick={() => handleExportAction('print')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Printer className="w-4 h-4 mr-3" />
                                                Print Orders
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* New Order Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsNewOrderDropdownOpen(!isNewOrderDropdownOpen)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Order
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </button>

                                {isNewOrderDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="py-2">
                                            <button
                                                onClick={() => handleNewOrderAction('manual')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Edit3 className="w-4 h-4 mr-3" />
                                                Create Manual Order
                                            </button>
                                            <button
                                                onClick={() => handleNewOrderAction('csv')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Upload className="w-4 h-4 mr-3" />
                                                Import from CSV
                                            </button>
                                            <button
                                                onClick={() => handleNewOrderAction('template')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <FileText className="w-4 h-4 mr-3" />
                                                Use Template
                                            </button>
                                            <button
                                                onClick={() => handleNewOrderAction('duplicate')}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Copy className="w-4 h-4 mr-3" />
                                                Duplicate Order
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, products..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-gray-200 bg-white">
                    {['All', 'Open', 'Shipped', 'Delivered'].map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                                tab === activeFilter
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Loading orders...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex-shrink-0 p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
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

            {/* Orders List - Improved spacing and status positioning */}
            {!loading && !error && (
                <div className="flex-1 overflow-y-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center">
                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No orders found' : 'No orders yet'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {searchTerm
                                    ? 'Try adjusting your search terms.'
                                    : 'Orders will appear here once they are created.'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={fetchOrders}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                                >
                                    Refresh
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id || order.orderNumber}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    selectedOrder?.id === order.id || selectedOrder?.orderNumber === order.orderNumber
                                        ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                                onClick={() => handleOrderSelect(order)}
                            >
                                {/* Improved Order Item Layout */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-sm truncate">
                                            {order.customerName || order.customer?.customerName || order.customer || 'Unknown Customer'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            #{order.id || order.orderNumber || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            Ksh{order.totalAmount || order.total || '0.00'}
                                        </span>
                                    </div>
                                </div>

                                {/* Better Status and Date Layout */}
                                <div className="flex justify-between items-center">
                                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                                        order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status?.toLowerCase() === 'shipped'
                                                ? 'bg-blue-100 text-blue-800'
                                                : order.status?.toLowerCase() === 'processing' || order.status?.toLowerCase() === 'in process'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
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

    // Main content area
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
                        <p className="text-gray-600 mb-6">Start by creating your first order to get started with order management.</p>
                        <button
                            onClick={() => handleNewOrderAction('manual')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Order
                        </button>
                    </div>
                </div>
            );
        }

        return <OrderDetails selectedOrder={selectedOrder} />;
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setIsNewOrderDropdownOpen(false);
                setIsExportDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <OrdersList />
            <MainContent />
        </div>
    );
}