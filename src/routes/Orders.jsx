import React, { useState, useEffect } from 'react';
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
    ChevronRight,
    Loader2
} from 'lucide-react';

import CreateOrderForm from '../components/CreateOrderForm';
import ordersApi from '../lib/ordersApi';

// Keep all your existing component definitions (Button, Input, Badge, etc.)
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
        secondary: 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 focus:ring-zinc-500',
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

const Input = ({ className = '', ...props }) => (
    <input
        className={`block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 ${className}`}
        {...props}
    />
);

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

const Checkbox = ({ checked, onCheckedChange, ...props }) => (
    <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
        {...props}
    />
);

// Keep all your dropdown components as they are
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

const Tabs = ({ children, value, onValueChange }) => (
    <div>
        {React.Children.map(children, child =>
            React.cloneElement(child, { value, onValueChange })
        )}
    </div>
);

const TabsList = ({ children, value, onValueChange }) => (
    <div className="flex space-x-1 rounded-lg bg-zinc-800 p-1">
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
                : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
        }`}
    >
        {children}
    </button>
);

// Currency formatting utility
const formatCurrency = (amount = 'KES') => {
    if (amount == null) return 'KSh 0.00';

    const number = parseFloat(amount);
    if (isNaN(number)) return 'KSh 0.00';

    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    }).format(number).replace('KES', 'KSh');
};

const OrdersPage = () => {
    // State management
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([
        { id: 1, label: 'Today' },
        { id: 2, label: 'Emily Carter' }
    ]);

    // API state
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(25);

    // Fetch orders from API
    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersApi.getAllOrders(currentPage, pageSize, 'createdAt', 'desc');

            // Handle different response structures
            const ordersData = response.content || response.data || response;
            const totalPagesData = response.totalPages || Math.ceil((response.totalElements || ordersData.length) / pageSize);
            const totalElementsData = response.totalElements || ordersData.length;

            setOrders(ordersData);
            setTotalPages(totalPagesData);
            setTotalElements(totalElementsData);

        } catch (err) {
            setError(err.message);
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on active tab (client-side filtering since no status endpoint)
    const getFilteredOrders = () => {
        if (activeTab === 'all') return orders;
        return orders.filter(order =>
            order.status?.toLowerCase() === activeTab.toLowerCase()
        );
    };

    // Calculate status counts
    const calculateStatusCounts = () => {
        const counts = {
            all: orders.length,
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            const status = order.status?.toLowerCase();
            if (counts.hasOwnProperty(status)) {
                counts[status]++;
            }
        });

        return counts;
    };

    const statusCounts = calculateStatusCounts();
    const filteredOrders = getFilteredOrders();

    // Calculate stats from real data
    const calculateStats = () => {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order =>
            new Date(order.createdAt || order.date).toDateString() === today
        );

        const todayRevenue = todayOrders.reduce((sum, order) =>
            sum + (parseFloat(order.totalAmount || order.amount || 0)), 0
        );

        const avgOrderValue = orders.length > 0
            ? orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount || order.amount || 0)), 0) / orders.length
            : 0;

        return [
            {
                title: 'Total Orders',
                value: totalElements.toLocaleString(),
                change: '+12% this month',
                trending: 'up'
            },
            {
                title: 'Revenue Today',
                value: formatCurrency(todayRevenue),
                change: '+8.2%',
                trending: 'up'
            },
            {
                title: 'Pending Orders',
                value: statusCounts.pending.toString(),
                change: '-3 from yesterday',
                trending: 'down'
            },
            {
                title: 'Avg Order Value',
                value: formatCurrency(avgOrderValue),
                change: '+5.4%',
                trending: 'up'
            }
        ];
    };

    const stats = calculateStats();

    const getStatusBadge = (status) => {
        const variants = {
            pending: 'warning',
            processing: 'info',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'danger'
        };

        return (
            <Badge variant={variants[status?.toLowerCase()] || 'default'}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
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
            setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
        } else {
            setSelectedOrders(new Set());
        }
    };

    const removeFilter = (filterId) => {
        setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Loading state
    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
                    <strong>Error:</strong> {error}
                    <button
                        onClick={fetchOrders}
                        className="mt-4 bg-red-100 hover:bg-red-200 px-4 py-2 rounded text-sm block mx-auto"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                                    {statusCounts.pending}
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
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
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
                                checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
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

                    {loading && (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-600 mx-auto mb-2" />
                            <p className="text-zinc-600">Loading orders...</p>
                        </div>
                    )}

                    {!loading && filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">
                            <p>No orders found{activeTab !== 'all' ? ` with status "${activeTab}"` : ''}.</p>
                        </div>
                    )}

                    {!loading && filteredOrders.map((order) => (
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
                                <div className="font-medium">#{order.orderNumber || order.id}</div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    {order.items?.length || order.itemsCount || 0} items • {order.shippingType || order.shipping || 'Standard Shipping'}
                                    {order.priority && (
                                        <Badge variant="danger" className="px-1.5 py-0.5 text-xs">
                                            {order.priority}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="font-medium">{order.customerName || order.customer}</div>
                                <div className="text-sm text-zinc-500">{order.customerEmail || order.email}</div>
                            </div>
                            <div className="font-medium">{formatCurrency(order.totalAmount || order.amount)}</div>
                            <div>{getStatusBadge(order.status)}</div>
                            <div>
                                <div>{new Date(order.createdAt || order.date).toLocaleDateString('en-KE')}</div>
                                <div className="text-sm text-zinc-500">{new Date(order.createdAt || order.date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div className="w-12">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
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
                            Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} orders
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Previous
                            </Button>
                            <span className="px-4 text-sm text-zinc-600">Page {currentPage + 1} of {totalPages}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
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