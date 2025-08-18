import {
  Building,
  Car,
  FileText,
  Home,
  Settings,
  ShoppingCart,
  Users,
  Boxes
} from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

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
} from "@/components/ui/sidebar";

export default function ClasicoSidebar() {
  const location = useLocation();

  // Utility function to check if a route is active
  const isActive = (path) => location.pathname === path;

  // Dynamic class for active vs inactive link
  const getLinkClasses = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors group ${
      isActive(path)
        ? 'bg-purple-700 text-white' // Active state
        : 'text-gray-300 hover:bg-[#1e2a52] hover:text-white' // Inactive/hover state
    }`;

  const getIconClasses = (path) =>
    `h-5 w-5 transition-colors ${
      isActive(path)
        ? 'text-white'
        : 'text-gray-300 group-hover:text-white'
    }`;

  const getTextClasses = (path) =>
    `font-medium transition-colors ${
      isActive(path)
        ? 'text-white'
        : 'text-gray-300 group-hover:text-white'
    }`;

  return (
    <div>
      <Sidebar className="h-full border-r">
        <SidebarContent className="overflow-x-hidden bg-gradient-to-b from-[#10162F] to-[#3A0CA3]">
          {/* Main Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-white text-lg mb-2 px-4 py-2 bg-[#1e2a52] rounded-md">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
                      <Home className={getIconClasses("/dashboard")} />
                      <span className={getTextClasses("/dashboard")}>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/products" className={getLinkClasses("/products")}>
                      <Car className={getIconClasses("/products")} />
                      <span className={getTextClasses("/products")}>Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/product-lines" className={getLinkClasses("/product-lines")}>
                      <Boxes className={getIconClasses("/product-lines")} />
                      <span className={getTextClasses("/product-lines")}>Product Lines</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/orders" className={getLinkClasses("/orders")}>
                      <ShoppingCart className={getIconClasses("/orders")} />
                      <span className={getTextClasses("/orders")}>Orders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/customers" className={getLinkClasses("/customers")}>
                      <Users className={getIconClasses("/customers")} />
                      <span className={getTextClasses("/customers")}>Customers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/offices" className={getLinkClasses("/offices")}>
                      <Building className={getIconClasses("/offices")} />
                      <span className={getTextClasses("/offices")}>Offices</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2 bg-[#1e2a52]" />

          {/* Inventory Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="font-bold text-white text-lg mb-2 px-4 py-2 bg-[#1e2a52] rounded-md">
              Inventory
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/inventory/all-vehicles" className={getLinkClasses("/inventory/all-vehicles")}>
                      <FileText className={getIconClasses("/inventory/all-vehicles")} />
                      <span className={getTextClasses("/inventory/all-vehicles")}>All Vehicles</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/inventory/in-stock" className={getLinkClasses("/inventory/in-stock")}>
                      <FileText className={getIconClasses("/inventory/in-stock")} />
                      <span className={getTextClasses("/inventory/in-stock")}>In Stock</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="overflow-x-hidden bg-[#1e2a52] p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings" className={getLinkClasses("/settings")}>
                  <Settings className={getIconClasses("/settings")} />
                  <span className={getTextClasses("/settings")}>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
