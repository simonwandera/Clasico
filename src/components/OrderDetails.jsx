import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { ChevronDown, Plus, Edit, X } from 'lucide-react';

const OrderDetails = ({ order, orderItems = [], onOrderUpdate }) => {
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        productLine: '',
        productVendor: '',
        scale: '',
        description: '',
        buyPrice: '',
        msrp: '',
        quantityInStock: ''
    });

    const productLines = [
        'Classic Cars',
        'Motorcycles',
        'Planes',
        'Ships',
        'Trains',
        'Trucks and Buses',
        'Vintage Cars'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API call to create order/product
            console.log('Creating order with data:', formData);

            // Reset form and close dialog
            setFormData({
                productName: '',
                productLine: '',
                productVendor: '',
                scale: '',
                description: '',
                buyPrice: '',
                msrp: '',
                quantityInStock: ''
            });
            setIsCreateOrderOpen(false);

            // Refresh order data if callback provided
            if (onOrderUpdate) {
                onOrderUpdate();
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => total + (item.total || 0), 0);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 border-b bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order {order?.orderNumber || 'Loading...'}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Placed on {formatDate(order?.orderDate)}
                        </p>
                        {order?.status && (
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                                order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                            }`}>
                {order.status}
              </span>
                        )}
                    </div>

                    {/* Action Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                Actions
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Order
                                    </DropdownMenuItem>
                                </DialogTrigger>
                            </Dialog>

                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Order
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-orange-600">
                                <X className="h-4 w-4 mr-2" />
                                Cancel Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Order Information */}
                    <div className="bg-white rounded-lg border">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Order Number</label>
                                            <p className="mt-1 text-sm text-gray-900">{order?.orderNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Required Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(order?.requiredDate)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Comments</label>
                                            <p className="mt-1 text-sm text-gray-900">{order?.comments || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Order Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(order?.orderDate)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Shipped Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(order?.shippedDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg border">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                📦 Order Items
                            </h2>
                        </div>
                        <div className="overflow-hidden">
                            {orderItems && orderItems.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {orderItems.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{item.quantityOrdered}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(item.priceEach)}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(item.total)}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t">
                                        <div className="flex justify-end">
                                            <div className="text-lg font-semibold text-gray-900">
                                                Total Amount: {formatCurrency(calculateTotal())}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <p className="text-gray-500">No items found for this order</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Order Dialog */}
            <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                                id="productName"
                                placeholder="Enter product name"
                                value={formData.productName}
                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="productLine">Product Line</Label>
                            <Select value={formData.productLine} onValueChange={(value) => handleInputChange('productLine', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product line" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productLines.map((line) => (
                                        <SelectItem key={line} value={line}>{line}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="productVendor">Product Vendor</Label>
                            <Input
                                id="productVendor"
                                placeholder="Enter product vendor"
                                value={formData.productVendor}
                                onChange={(e) => handleInputChange('productVendor', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scale">Scale</Label>
                            <Input
                                id="scale"
                                placeholder="Enter scale"
                                value={formData.scale}
                                onChange={(e) => handleInputChange('scale', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="buyPrice">Buy Price</Label>
                            <Input
                                id="buyPrice"
                                type="number"
                                step="0.01"
                                placeholder="Enter buy price"
                                value={formData.buyPrice}
                                onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="msrp">MSRP</Label>
                            <Input
                                id="msrp"
                                type="number"
                                step="0.01"
                                placeholder="Enter MSRP"
                                value={formData.msrp}
                                onChange={(e) => handleInputChange('msrp', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                            <Input
                                id="quantityInStock"
                                type="number"
                                placeholder="Enter quantity in stock"
                                value={formData.quantityInStock}
                                onChange={(e) => handleInputChange('quantityInStock', e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="w-full">
                                Add Product
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderDetails;