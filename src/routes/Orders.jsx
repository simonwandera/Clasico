import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CreditCard, Clock } from 'lucide-react';

export default function Orders() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - replace with your API call
    const mockOrders = [
        {
            id: '#123456',
            customer: 'Emily Carter',
            email: 'emily.carter@gmail.com',
            date: '2024-01-15',
            status: 'Delivered',
            total: 250,
            phone: '+1-202-555-0143',
            address: '123 Oak Street Anytown, USA',
            items: [
                { product: 'Wireless Headphones', quantity: 1, price: 150, total: 150 },
                { product: 'USB-C Cable', quantity: 2, price: 50, total: 100 }
            ],
            shipping: {
                method: 'Standard',
                trackingNumber: '1Z9E4920394829834920',
                carrier: 'FedEx'
            },
            payment: {
                method: 'Credit Card',
                cardLast4: '4562',
                date: 'January 15, 2024'
            },
            history: [
                { status: 'Order Placed', date: 'January 15, 2024' },
                { status: 'Order Shipped', date: 'January 16, 2024' }
            ]
        }
        // Add more mock orders here
    ];

    useEffect(() => {
        // Replace with actual API call
        setOrders(mockOrders);
        setSelectedOrder(mockOrders[0]);
    }, []);

    const OrdersList = () => (
        <div className="w-80 bg-white border-r border-gray-200 h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search"
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
                            tab === 'All'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="overflow-y-auto">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedOrder?.id === order.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{order.customer}</h3>
                            <span className="text-sm font-semibold text-gray-900">${order.total}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{order.id}</p>
                        <div className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const OrderDetails = () => {
        if (!selectedOrder) return <div className="flex-1 flex items-center justify-center text-gray-500">Select an order to view details</div>;

        return (
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order {selectedOrder.id}</h1>
                        <p className="text-gray-600">Placed on {selectedOrder.date}</p>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Name</p>
                                <p className="text-gray-900">{selectedOrder.customer}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <p className="text-gray-900">{selectedOrder.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone</p>
                                <p className="text-gray-900">{selectedOrder.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                <p className="text-gray-900">{selectedOrder.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Package className="w-5 h-5 mr-2" />
                            Order Items
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-sm text-gray-900">{item.product}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">${item.price}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">${item.total}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Truck className="w-5 h-5 mr-2" />
                                Shipping Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Shipping Method</p>
                                    <p className="text-gray-900">{selectedOrder.shipping.method}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                                    <p className="text-gray-900">{selectedOrder.shipping.trackingNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Carrier</p>
                                    <p className="text-gray-900">{selectedOrder.shipping.carrier}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Payment Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                    <p className="text-gray-900">{selectedOrder.payment.method}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Card</p>
                                    <p className="text-gray-900">•••• •••• •••• {selectedOrder.payment.cardLast4}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="text-gray-900">{selectedOrder.payment.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            Order History
                        </h2>
                        <div className="space-y-4">
                            {selectedOrder.history.map((event, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Package className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <OrdersList />
            <OrderDetails />
        </div>
    );
};

