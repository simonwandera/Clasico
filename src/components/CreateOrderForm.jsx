
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    X,
    Plus,
    Minus,
    Search,
    User,
    Package,
    CreditCard,
    Truck
} from 'lucide-react';

const CreateOrderForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        customer: {
            name: '',
            email: '',
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India'
            }
        },
        items: [
            {
                id: '',
                name: '',
                sku: '',
                quantity: 1,
                price: '',
                total: 0
            }
        ],
        shipping: {
            method: '',
            cost: 0,
            address: 'same' // 'same' or 'different'
        },
        payment: {
            method: '',
            status: 'pending'
        },
        notes: '',
        priority: 'normal'
    });

    const [orderTotal, setOrderTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev => {
            const updated = { ...prev };

            if (section === 'items' && index !== null) {
                updated.items[index] = { ...updated.items[index], [field]: value };

                // Calculate item total
                if (field === 'quantity' || field === 'price') {
                    const quantity = field === 'quantity' ? value : updated.items[index].quantity;
                    const price = field === 'price' ? value : updated.items[index].price;
                    updated.items[index].total = quantity * price;
                }
            } else if (section === 'customer' && typeof updated[section][field] === 'object') {
                updated[section][field] = { ...updated[section][field], ...value };
            } else {
                if (updated[section]) {
                    updated[section][field] = value;
                } else {
                    updated[field] = value;
                }
            }

            return updated;
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: '',
                    name: '',
                    sku: '',
                    quantity: 1,
                    price: '',
                    total: 0
                }
            ]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
        const taxAmount = subtotal * 0.18; // 18% GST
        const shippingCost = formData.shipping.cost || 0;
        const total = subtotal + taxAmount + shippingCost;

        setOrderTotal(subtotal);
        setTax(taxAmount);
        setGrandTotal(total);
    };

    React.useEffect(() => {
        calculateTotals();
    }, [formData.items, formData.shipping.cost]);

    const handleSubmit = () => {
        console.log('Order Data:', formData);
        // Handle form submission
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-zinc-900">Create Manual Order</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customer-name">Customer Name *</Label>
                                    <Input
                                        id="customer-name"
                                        placeholder="Enter customer name"
                                        value={formData.customer.name}
                                        onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customer-email">Email Address *</Label>
                                    <Input
                                        id="customer-email"
                                        type="email"
                                        placeholder="customer@example.com"
                                        value={formData.customer.email}
                                        onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customer-phone">Phone Number</Label>
                                    <Input
                                        id="customer-phone"
                                        placeholder="+91 9876543210"
                                        value={formData.customer.phone}
                                        onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priority">Order Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => handleInputChange('', 'priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div>
                                <Label className="text-base font-semibold">Billing Address</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="street">Street Address *</Label>
                                        <Input
                                            id="street"
                                            placeholder="123 Main Street, Apartment 4B"
                                            value={formData.customer.address.street}
                                            onChange={(e) => handleInputChange('customer', 'address', { street: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            placeholder="Mumbai"
                                            value={formData.customer.address.city}
                                            onChange={(e) => handleInputChange('customer', 'address', { city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            placeholder="Maharashtra"
                                            value={formData.customer.address.state}
                                            onChange={(e) => handleInputChange('customer', 'address', { state: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipCode">PIN Code *</Label>
                                        <Input
                                            id="zipCode"
                                            placeholder="400001"
                                            value={formData.customer.address.zipCode}
                                            onChange={(e) => handleInputChange('customer', 'address', { zipCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Select
                                            value={formData.customer.address.country}
                                            onValueChange={(value) => handleInputChange('customer', 'address', { country: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="USA">United States</SelectItem>
                                                <SelectItem value="UK">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-medium">Item {index + 1}</span>
                                            {formData.items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeItem(index)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div className="md:col-span-2">
                                                <Label>Product Name *</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Search or enter product name"
                                                        value={item.name}
                                                        onChange={(e) => handleInputChange('items', 'name', e.target.value, index)}
                                                        required
                                                    />
                                                    <Button type="button" variant="outline" size="sm">
                                                        <Search className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <Label>SKU</Label>
                                                <Input
                                                    placeholder="SKU-001"
                                                    value={item.sku}
                                                    onChange={(e) => handleInputChange('items', 'sku', e.target.value, index)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Quantity *</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleInputChange('items', 'quantity', parseInt(e.target.value) || 1, index)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Unit Price *</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="₹0.00"
                                                    value={item.price}
                                                    onChange={(e) => handleInputChange('items', 'price', parseFloat(e.target.value) || 0, index)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 text-right">
                      <span className="text-sm text-zinc-600">
                        Total: <strong>₹{item.total.toFixed(2)}</strong>
                      </span>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addItem}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Shipping Method *</Label>
                                    <Select
                                        value={formData.shipping.method}
                                        onValueChange={(value) => handleInputChange('shipping', 'method', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shipping method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">Standard Shipping (3-5 days)</SelectItem>
                                            <SelectItem value="express">Express Shipping (1-2 days)</SelectItem>
                                            <SelectItem value="overnight">Overnight Delivery</SelectItem>
                                            <SelectItem value="pickup">Store Pickup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Shipping Cost</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="₹0.00"
                                        value={formData.shipping.cost}
                                        onChange={(e) => handleInputChange('shipping', 'cost', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Payment Method *</Label>
                                    <Select
                                        value={formData.payment.method}
                                        onValueChange={(value) => handleInputChange('payment', 'method', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            <SelectItem value="netbanking">Net Banking</SelectItem>
                                            <SelectItem value="wallet">Digital Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Payment Status</Label>
                                    <Select
                                        value={formData.payment.status}
                                        onValueChange={(value) => handleInputChange('payment', 'status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="partial">Partially Paid</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>₹{orderTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (18% GST):</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>₹{formData.shipping.cost.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Grand Total:</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Enter any special instructions or notes for this order..."
                                value={formData.notes}
                                onChange={(e) => handleInputChange('', 'notes', e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="px-8">
                            Create Order
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderForm;