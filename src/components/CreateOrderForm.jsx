
import { toast } from "sonner"
import { useState, useEffect } from "react"

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export function CreateOrderForm({ onSuccess, onClose, isOpen }) {
    const [formValues, setFormValues] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        productName: '',
        quantity: 1,
        price: 0,
        totalAmount: 0,
        paymentMethod: '',
        orderNotes: '',
        isPriority: false
    });

    // Calculate total amount whenever quantity or price changes
    useEffect(() => {
        const quantity = Number(formValues.quantity) || 0;
        const price = Number(formValues.price) || 0;
        const total = quantity * price;

        setFormValues(prev => ({
            ...prev,
            totalAmount: total
        }));
    }, [formValues.quantity, formValues.price]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const order = {
            customerName: formValues.customerName,
            customerEmail: formValues.customerEmail,
            customerPhone: formValues.customerPhone,
            shippingAddress: formValues.shippingAddress,
            productName: formValues.productName,
            quantity: parseInt(formValues.quantity) || 1,
            price: parseFloat(formValues.price) || 0,
            totalAmount: parseFloat(formValues.totalAmount) || 0,
            paymentMethod: formValues.paymentMethod,
            orderNotes: formValues.orderNotes,
            isPriority: formValues.isPriority,
        }

        console.log("Submitting order:", order);

        try {
            const response = await fetch(`${BASE_URL}/api/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            })

            console.log("Response status:", response);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Backend error:", errorData);
                // Instead of throwing an error that will be caught by our own catch block,
                // we can handle the error directly here
                toast.error(`❌ Failed to create order: ${response.status} ${response.statusText}`);
                return;
            }


            const createdOrder = await response.json();
            console.log("Order created successfully:", createdOrder);

            toast.success(`✅ Order for ${order.customerName} created successfully!`);
            setFormValues({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                shippingAddress: '',
                productName: '',
                quantity: 1,
                price: 0,
                totalAmount: 0,
                paymentMethod: '',
                orderNotes: '',
                isPriority: false
            });

            if (onSuccess) {
                console.log("Calling onSuccess callback");
                onSuccess();
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            // This catch block will handle unexpected errors like network issues
            console.error("Error creating order:", error);
            toast.error(`❌ ${error.message || "An unexpected error occurred"}`);
        }

    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/30">
            {/* Glassmorphism Modal */}
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-white/30">
                    <h2 className="text-2xl font-bold text-gray-900">Create Manual Order</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="customerName" className="text-sm font-medium text-gray-800">
                                Customer Name *
                            </label>
                            <input
                                id="customerName"
                                name="customerName"
                                placeholder="Enter customer name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.customerName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="customerEmail" className="text-sm font-medium text-gray-800">
                                Customer Email *
                            </label>
                            <input
                                id="customerEmail"
                                name="customerEmail"
                                type="email"
                                placeholder="customer@example.com"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.customerEmail}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="customerPhone" className="text-sm font-medium text-gray-800">
                                Customer Phone
                            </label>
                            <input
                                id="customerPhone"
                                name="customerPhone"
                                placeholder="Enter phone number"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                value={formValues.customerPhone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="shippingAddress" className="text-sm font-medium text-gray-800">
                                Shipping Address *
                            </label>
                            <textarea
                                id="shippingAddress"
                                name="shippingAddress"
                                placeholder="Enter shipping address"
                                rows="3"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.shippingAddress}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="productName" className="text-sm font-medium text-gray-800">
                                Product Name *
                            </label>
                            <input
                                id="productName"
                                name="productName"
                                placeholder="Enter product name"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.productName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-800">
                                Quantity *
                            </label>
                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                placeholder="1"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.quantity}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium text-gray-800">
                                Price (Ksh) *
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900 caret-gray-900"
                                required
                                value={formValues.price}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="totalAmount" className="text-sm font-medium text-gray-800">
                                Total Amount (Ksh)
                            </label>
                            <input
                                id="totalAmount"
                                name="totalAmount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                                value={formValues.totalAmount.toFixed(2)}
                                readOnly
                            />
                            <p className="text-xs text-gray-600">Automatically calculated from quantity × price</p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-800">
                                Payment Method *
                            </label>
                            <select
                                id="paymentMethod"
                                name="paymentMethod"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/70 text-gray-900"
                                required
                                value={formValues.paymentMethod}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a payment method</option>
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="orderNotes" className="text-sm font-medium text-gray-800">
                                Order Notes
                            </label>
                            <textarea
                                id="orderNotes"
                                name="orderNotes"
                                placeholder="Enter any additional notes"
                                rows="3"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none bg-white/70 text-gray-900 caret-gray-900"
                                value={formValues.orderNotes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="isPriority"
                                    name="isPriority"
                                    type="checkbox"
                                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={formValues.isPriority}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="isPriority" className="text-sm font-medium text-gray-800">
                                    Priority Order
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium bg-white/50 backdrop-blur-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium backdrop-blur-sm shadow-lg"
                            >
                                Create Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateOrderForm;