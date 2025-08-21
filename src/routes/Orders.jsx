import React, { useState } from 'react';
import {
    Bell,
    Plus,
    ChevronDown,
    Filter,
    Settings,
    MoreHorizontal,
    Download,
    X,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

import CreateOrderForm from '../components/CreateOrderForm';

// Catalyst-style Button Component
const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    className = '',
                    disabled = false,
                    ...props
                }) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900',
        secondary: 'bg-white text-white border border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-500',
        ghost: 'text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-500'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-md',
        md: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-6 py-3 text-base rounded-lg'
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

// Catalyst-style Input Component
const Input = ({ className = '', ...props }) => (
    <input
        className={`block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-700 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 ${className}`}
        {...props}
    />
);

// Catalyst-style Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-zinc-100 text-zinc-800',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
    );
};

// Catalyst-style Checkbox Component
const Checkbox = ({ checked, onCheckedChange, ...props }) => (
    <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
        {...props}
    />
);

// Catalyst-style Dropdown Component
const DropdownMenu = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            {React.Children.map(children, child =>
                React.cloneElement(child, { isOpen, setIsOpen })
            )}
        </div>
    );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => (
    <div onClick={() => setIsOpen(!isOpen)}>
        {children}
    </div>
);

const DropdownMenuContent = ({ children, align = 'left', isOpen, setIsOpen }) => {
    if (!isOpen) return null;

    const alignClasses = {
        left: 'left-0',
        right: 'right-0'
    };

    return (
        <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className={`absolute z-20 mt-2 w-56 rounded-lg bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 ${alignClasses[align]}`}>
                <div className="py-1">
                    {children}
                </div>
            </div>
        </>
    );
};

const DropdownMenuItem = ({ children, className = '', ...props }) => (
    <button
        className={`block w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 ${className}`}
        {...props}
    >
        {children}
    </button>
);

// Catalyst-style Tab Components
const Tabs = ({ children, value, onValueChange }) => (
    <div>
        {React.Children.map(children, child =>
            React.cloneElement(child, { value, onValueChange })
        )}
    </div>
);

const TabsList = ({ children, value, onValueChange }) => (
    <div className="flex space-x-1 rounded-lg bg-white p-1">
        {React.Children.map(children, child =>
            React.cloneElement(child, { value, onValueChange })
        )}
    </div>
);

const TabsTrigger = ({ children, value: tabValue, value: currentValue, onValueChange }) => (
    <button
        onClick={() => onValueChange(tabValue)}
        className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            currentValue === tabValue
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-white hover:text-zinc-900 hover:bg-zinc-100'
        }`}
    >
        {children}
    </button>
);

const OrdersPage = () => {
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([
        { id: 1, label: 'Today' },
        { id: 2, label: 'Emily Carter' }
    ]);

    // Sample data
    const stats = [
        {
            title: 'Total Orders',
            value: '1,247',
            change: '+12% this month',
            trending: 'up'
        },
        {
            title: 'Revenue Today',
            value: '₹2,84,560',
            change: '+8.2%',
            trending: 'up'
        },
        {
            title: 'Pending Orders',
            value: '23',
            change: '-3 from yesterday',
            trending: 'down'
        },
        {
            title: 'Avg Order Value',
            value: '₹1,890',
            change: '+5.4%',
            trending: 'up'
        }
    ];

    const orders = [
        {
            id: '123456',
            customer: 'Emily Carter',
            email: 'emily.carter@email.com',
            amount: '₹2,850',
            status: 'processing',
            date: 'Aug 14, 2025',
            time: '10:30 AM',
            items: 2,
            shipping: 'Express Shipping',
            priority: 'HIGH'
        },
        {
            id: '123455',
            customer: 'John Smith',
            email: 'john.smith@email.com',
            amount: '₹1,240',
            status: 'shipped',
            date: 'Aug 14, 2025',
            time: '09:15 AM',
            items: 1,
            shipping: 'Standard Shipping'
        },
        {
            id: '123454',
            customer: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            amount: '₹4,320',
            status: 'pending',
            date: 'Aug 13, 2025',
            time: '11:45 PM',
            items: 3,
            shipping: 'Express Shipping'
        },
        {
            id: '123453',
            customer: 'Mike Wilson',
            email: 'm.wilson@email.com',
            amount: '₹890',
            status: 'delivered',
            date: 'Aug 13, 2025',
            time: '08:20 AM',
            items: 1,
            shipping: 'Standard Shipping'
        }
    ];

    const statusCounts = {
        all: 1247,
        pending: 23,
        processing: 67,
        shipped: 156,
        delivered: 998,
        cancelled: 3
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'danger'
        };

        return (
            <Badge variant={variants[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const toggleOrderSelection = (orderId) => {
        const newSelected = new Set(selectedOrders);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrders(newSelected);
    };

    const selectAllOrders = (checked) => {
        if (checked) {
            setSelectedOrders(new Set(orders.map(order => order.id)));
        } else {
            setSelectedOrders(new Set());
        }
    };

    const removeFilter = (filterId) => {
        setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-zinc-900">Orders Management</h1>
                            <div className="relative">
                                <Bell className="h-6 w-6 text-zinc-600" />
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Input
                                    placeholder="Search orders, customers, products..."
                                    className="pl-10 w-80"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        New Order
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="right">
                                    <DropdownMenuItem onClick={() => setIsCreateOrderOpen(true)}>📝 Create Manual Order</DropdownMenuItem>
                                    <DropdownMenuItem>📋 Import from CSV</DropdownMenuItem>
                                    <DropdownMenuItem>📄 Use Template</DropdownMenuItem>
                                    <DropdownMenuItem>📄 Duplicate Order</DropdownMenuItem>
                                    <DropdownMenuItem>📦 Bulk Upload</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="secondary">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="right">
                                    <DropdownMenuItem>📄 Export to PDF</DropdownMenuItem>
                                    <DropdownMenuItem>📊 Export to CSV</DropdownMenuItem>
                                    <DropdownMenuItem>📈 Export to Excel</DropdownMenuItem>
                                    <DropdownMenuItem>🖨️ Print Selected</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
                            <div className="text-2xl font-bold text-zinc-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-zinc-600 mb-2">
                                {stat.title}
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${
                                stat.trending === 'up' ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                                {stat.trending === 'up' ?
                                    <TrendingUp className="h-3 w-3" /> :
                                    <TrendingDown className="h-3 w-3" />
                                }
                                {stat.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Tabs */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 ">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All Orders ({statusCounts.all})</TabsTrigger>
                            <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                            <TabsTrigger value="processing">Processing ({statusCounts.processing})</TabsTrigger>
                            <TabsTrigger value="shipped">Shipped ({statusCounts.shipped})</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered ({statusCounts.delivered})</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled ({statusCounts.cancelled})</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Filters Toolbar */}
                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-zinc-700">Filters:</span>
                            {appliedFilters.map((filter) => (
                                <Badge key={filter.id} className="bg-emerald-50 text-emerald-700">
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter.id)}
                                        className="ml-2 hover:text-emerald-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            <Button variant="secondary" size="sm">
                                <Plus className="mr-1 h-3 w-3" />
                                Add Filter
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Advanced Filters
                            </Button>
                            <Button variant="secondary" size="sm">
                                <Settings className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                            <select className="rounded-lg border border-zinc-300 bg-black px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500">
                                <option>Sort by: Newest First</option>
                                <option>Sort by: Oldest First</option>
                                <option>Sort by: Highest Value</option>
                                <option>Sort by: Customer Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedOrders.size > 0 && (
                    <div className="mb-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                        <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-emerald-800">
                <strong>{selectedOrders.size} orders selected</strong>
              </span>
                            <Button variant="secondary" size="sm">Update Status</Button>
                            <Button variant="secondary" size="sm">Export Selected</Button>
                            <Button variant="secondary" size="sm">Print Labels</Button>
                            <Button variant="secondary" size="sm">Send Email</Button>
                            <Button variant="secondary" size="sm">Delete</Button>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-zinc-200">
                    <div className="grid grid-cols-7 gap-4 border-b border-zinc-200 bg-zinc-50 p-4 font-medium text-sm text-zinc-700">
                        <div className="w-12">
                            <Checkbox
                                checked={selectedOrders.size === orders.length}
                                onCheckedChange={selectAllOrders}
                            />
                        </div>
                        <div>Order Details</div>
                        <div>Customer</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div>Date</div>
                        <div className="w-12">Actions</div>
                    </div>

                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className={`grid grid-cols-7 gap-4 p-4 border-b border-zinc-200 items-center hover:bg-zinc-50 ${
                                selectedOrders.has(order.id) ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="w-12">
                                <Checkbox
                                    checked={selectedOrders.has(order.id)}
                                    onCheckedChange={() => toggleOrderSelection(order.id)}
                                />
                            </div>
                            <div>
                                <div className="font-medium">#{order.id}</div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    {order.items} items • {order.shipping}
                                    {order.priority && (
                                        <Badge variant="danger" className="px-1.5 py-0.5 text-xs">
                                            {order.priority}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="font-medium">{order.customer}</div>
                                <div className="text-sm text-zinc-500">{order.email}</div>
                            </div>
                            <div className="font-medium">{order.amount}</div>
                            <div>{getStatusBadge(order.status)}</div>
                            <div>
                                <div>{order.date}</div>
                                <div className="text-sm text-zinc-500">{order.time}</div>
                            </div>
                            <div className="w-12">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="ghost" className="h-8 w-8 p-0" >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="right">
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                                        <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                                        <DropdownMenuItem>Track Package</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t border-zinc-200">
                        <div className="text-sm text-zinc-600">
                            Showing 1-25 of 1,247 orders
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>
                            <span className="px-4 text-sm text-zinc-600">Page 1 of 50</span>
                            <Button variant="secondary" size="sm">
                                Next
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <CreateOrderForm
                isOpen={isCreateOrderOpen}
                onClose={() => setIsCreateOrderOpen(false)}
            />
        </div>
    );
};

export default OrdersPage;