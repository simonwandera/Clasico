import React from 'react';
import { Package, Truck, CreditCard, Clock } from 'lucide-react';

export default function OrderDetails({ selectedOrder }) {
    if (!selectedOrder) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select an order to view details
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Order {selectedOrder.orderNumber}
                    </h1>
                    <p className="text-gray-600">
                        Placed on {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : 'No date available'}
                    </p>
                    <div className="mt-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                            selectedOrder.status?.toLowerCase() === 'delivered' || selectedOrder.status?.toLowerCase() === 'shipped'
                                ? 'bg-green-100 text-green-800'
                                : selectedOrder.status?.toLowerCase() === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {selectedOrder.status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Order Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Order Number</p>
                            <p className="text-gray-900">{selectedOrder.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Order Date</p>
                            <p className="text-gray-900">
                                {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : 'Not available'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Required Date</p>
                            <p className="text-gray-900">
                                {selectedOrder.requiredDate ? new Date(selectedOrder.requiredDate).toLocaleDateString() : 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Shipped Date</p>
                            <p className="text-gray-900">
                                {selectedOrder.shippedDate ? new Date(selectedOrder.shippedDate).toLocaleDateString() : 'Not shipped yet'}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500 mb-1">Comments</p>
                            <p className="text-gray-900">{selectedOrder.comments || 'No comments'}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                {selectedOrder.customer && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                                <p className="text-gray-900">{selectedOrder.customer.customerName || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                                <p className="text-gray-900">
                                    {[selectedOrder.customer.contactFirstName, selectedOrder.customer.contactLastName]
                                        .filter(Boolean).join(' ') || 'Not provided'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone</p>
                                <p className="text-gray-900">{selectedOrder.customer.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <p className="text-gray-900">{selectedOrder.customer.email || 'Not provided'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500 mb-1">Address</p>
                                <p className="text-gray-900">
                                    {[
                                        selectedOrder.customer.addressLine1,
                                        selectedOrder.customer.addressLine2,
                                        selectedOrder.customer.city,
                                        selectedOrder.customer.state,
                                        selectedOrder.customer.country
                                    ].filter(Boolean).join(', ') || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Unit Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
                                selectedOrder.orderDetails.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {item.product?.productName || item.productCode || item.productName || `Product ${index + 1}`}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {item.quantityOrdered || item.quantity || 0}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            Ksh{item.priceEach || item.unitPrice || item.price || 0}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                            Ksh{((item.quantityOrdered || item.quantity || 0) * (item.priceEach || item.unitPrice || item.price || 0)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : selectedOrder.items && selectedOrder.items.length > 0 ? (
                                selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {item.product || item.productName || `Product ${index + 1}`}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {item.quantity || 1}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            Ksh{item.price || item.unitPrice || 0}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                            Ksh{item.total || (item.quantity * item.price) || 0}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                        No items found for this order
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 border-t pt-4">
                        <div className="flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="text-xl font-bold text-gray-900">
                                    Ksh{selectedOrder.totalAmount ||
                                    selectedOrder.total ||
                                    (selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0
                                        ? selectedOrder.orderDetails.reduce((total, item) =>
                                            total + ((item.quantityOrdered || item.quantity || 0) * (item.priceEach || item.unitPrice || item.price || 0)), 0
                                        ).toFixed(2)
                                        : '0.00')}
                                </p>
                            </div>
                        </div>
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
                                <p className="text-gray-900">
                                    {selectedOrder.shippingMethod || selectedOrder.shipping?.method || 'Standard'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                                <p className="text-gray-900">
                                    {selectedOrder.trackingNumber || selectedOrder.shipping?.trackingNumber || 'Not available'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Carrier</p>
                                <p className="text-gray-900">
                                    {selectedOrder.carrier || selectedOrder.shipping?.carrier || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    selectedOrder.status?.toLowerCase() === 'delivered'
                                        ? 'bg-green-100 text-green-800'
                                        : selectedOrder.status?.toLowerCase() === 'shipped'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {selectedOrder.status || 'Pending'}
                                </span>
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
                                <p className="text-gray-900">
                                    {selectedOrder.paymentMethod || selectedOrder.payment?.method || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Card</p>
                                <p className="text-gray-900">
                                    {selectedOrder.cardLast4
                                        ? `•••• •••• •••• ${selectedOrder.cardLast4}`
                                        : selectedOrder.payment?.cardLast4
                                            ? `•••• •••• •••• ${selectedOrder.payment.cardLast4}`
                                            : 'Not available'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Payment Date</p>
                                <p className="text-gray-900">
                                    {selectedOrder.paymentDate
                                        ? new Date(selectedOrder.paymentDate).toLocaleDateString()
                                        : selectedOrder.payment?.date || 'Not available'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                                <p className="text-gray-900 font-semibold">
                                    Ksh{selectedOrder.totalAmount || selectedOrder.total || 0}
                                </p>
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
                        {selectedOrder.history && selectedOrder.history.length > 0 ? (
                            selectedOrder.history.map((event, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Package className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                        <p className="text-sm text-gray-500">
                                            {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Package className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Order Created</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedOrder.orderDate
                                                ? new Date(selectedOrder.orderDate).toLocaleDateString()
                                                : selectedOrder.date || 'No date available'}
                                        </p>
                                    </div>
                                </div>
                                {selectedOrder.shippedDate && (
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Truck className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">Order Shipped</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(selectedOrder.shippedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}