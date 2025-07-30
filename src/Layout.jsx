import { SidebarProvider } from "@/components/ui/sidebar";
import ClasicoSidebar from "./common/ClasicoSidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex-1  h-screen overflow-auto">
                {/* Fixed width sidebar */}
                <div className="w-64 overflow-y-auto overflow-y-auto over bg-gray-800 border-r">
                    <ClasicoSidebar />
                </div>

                {/* Centered main content area */}
                <div className="overflow-auto min-w-0 "> {/* Full width, background color */}
                    <div className="max-w-7xl mx-auto px-4 py-6"> {/* Centering container */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}