import {Building, Car, FileText, Home, Settings, ShoppingCart, Users} from "lucide-react"
import {Link} from 'react-router-dom';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "@/components/ui/sidebar"

export default function ClasicoSidebar() {
    return (

        <div>
            <Sidebar className="h-full border-r">
                <SidebarContent className="overflow-x-hidden bg-gradient-to-b from-blue-900 to-indigo-600">
                    {/* Main Navigation */}
                    <SidebarGroup>
                        <SidebarGroupLabel
                            className="font-bold text-white text-lg mb-2 px-4 py-2 bg-blue-800 rounded-md">
                            Menu
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {/* Dashboard - Fixed to match others */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <Home
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    Dashboard
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Products */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/products"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <Car
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    Products
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Orders */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <ShoppingCart
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    Orders
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Customers */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/customers"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <Users
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    Customers
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* Offices */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/offices"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <Building
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    Offices
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarSeparator className="my-2 bg-blue-700/50"/>

                    {/* Inventory Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel
                            className="font-bold text-white text-lg mb-2 px-4 py-2 bg-blue-800 rounded-md">
                            Inventory
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {/* All Vehicles */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/inventory/all-vehicles"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <FileText
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    All Vehicles
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* In Stock */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to="/inventory/in-stock"
                                            className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                        >
                                            <FileText
                                                className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                            <span
                                                className="font-medium text-blue-100 group-hover:text-white transition-colors">
                    In Stock
                  </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer Section */}
                <SidebarFooter className="overflow-x-hidden bg-blue-800 p-4">
                    <SidebarMenu>
                        {/* Settings */}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-3 p-3 group hover:bg-blue-700/50 rounded-lg transition-colors"
                                >
                                    <Settings
                                        className="h-5 w-5 text-blue-200 group-hover:text-white transition-colors"/>
                                    <span
                                        className="font-medium text-blue-100 group-hover:text-white transition-colors">
                Settings
              </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>

    )
}