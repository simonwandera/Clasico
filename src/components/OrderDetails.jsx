import React, { useState, useEffect } from 'react';
import { Package, Truck, CreditCard, Clock, User, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { orderDetailsApi } from '../lib/ordersApi';

const OrderDetails = ({ selectedOrder }) => {
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch order details when selectedOrder changes
    useEffect(() => {
        if (selectedOrder) {
            fetchOrderDetails(selectedOrder.id || selectedOrder.orderNumber);
        }
    }, [selectedOrder]);

    const fetchOrderDetails = async (orderId) => {
        try {
            setLoading(true);
            const details = await orderDetailsApi.getOrderDetails(orderId);
            setOrder(details.order || selectedOrder);
            setOrderItems(details.orderItems || []);
        } catch (error) {
            console.error('Error fetching order details:', error);
            // Fallback to selected order data
            setOrder(selectedOrder);
            setOrderItems([
                // Mock data for demonstration - replace with actual data
                {
                    productName: "1957 Ford Mustang",
                    quantity: 1,
                    price: 8201,
                    total: 8201
                },
                {
                    productName: "1957 Chevrolet Corvette",
                    quantity: 1,
                    price: 890,
                    total: 890
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `$${(amount || 0).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.total || (item.quantity * item.price) || 0), 0);
    };

    if (!selectedOrder) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Select an Order</h3>
                    <p className="text-gray-500">Choose an order from the list to view details</p>
                </div>
            </div>
        );
    }

    const orderData = order || selectedOrder;

    return (
        <div className="flex-1 bg-white overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order #{orderData?.orderNumber || orderData?.id || '123456'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Created on {formatDate(orderData?.orderDate || new Date())}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            orderData?.status?.toLowerCase() === 'delivered' || orderData?.status?.toLowerCase() === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : orderData?.status?.toLowerCase() === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : orderData?.status?.toLowerCase() === 'processing'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                        }`}>
                            {orderData?.status || 'Pending'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-600" />
                            Customer Information
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Name</h3>
                                <p className="text-gray-900">
                                    {orderData?.customerName || orderData?.customer?.customerName || 'Emily Carter'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Email</h3>
                                <p className="text-gray-900 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                    {orderData?.customerEmail || 'emily.carter@email.com'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Phone</h3>
                                <p className="text-gray-900 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                    {orderData?.customerPhone || '+1 (555) 123-4567'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                                <p className="text-gray-900 flex items-start">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                    {orderData?.customerAddress || '123 Oak Street, Anytown, USA'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-gray-600" />
                            Order Items
                        </h2>
                    </div>
                    <div className="overflow-hidden">
                        {loading ? (
                            <div className="px-6 py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-500">Loading order items...</p>
                            </div>
                        ) : orderItems && orderItems.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {item.productName || item.product?.name || 'Unknown Product'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                    {item.quantity || item.quantityOrdered || 0}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                                                    {formatCurrency(item.price || item.priceEach || item.unitPrice || 0)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                                    {formatCurrency(item.total || (item.quantity * item.price) || (item.quantityOrdered * item.priceEach) || 0)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex justify-end">
                                        <div className="text-lg font-semibold text-gray-900">
                                            Total: {formatCurrency(calculateTotal())}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No items found for this order</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row - Shipping, Payment, History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Information */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Truck className="w-5 h-5 mr-2 text-gray-600" />
                                Shipping Information
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Method</h3>
                                <p className="text-gray-900 mt-1">Standard</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Tracking Number</h3>
                                <p className="text-blue-600 mt-1">1Z9834821943823</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Address</h3>
                                <p className="text-gray-900 mt-1">
                                    123 Oak Street<br />
                                    Anytown, USA
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                                Payment Information
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Method</h3>
                                <p className="text-gray-900 mt-1">Credit Card</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Amount</h3>
                                <p className="text-gray-900 mt-1 font-semibold">
                                    {formatCurrency(orderData?.totalAmount || orderData?.total || calculateTotal())}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Date</h3>
                                <p className="text-gray-900 mt-1">
                                    {formatDate(orderData?.orderDate)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                                Order History
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">Order Placed</p>
                                        <p className="text-gray-500">{formatDate(orderData?.orderDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">Order Shipped</p>
                                        <p className="text-gray-500">{formatDate(orderData?.shippedDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;