import {SidebarProvider} from "@/components/ui/sidebar";
import ClasicoSidebar from "./common/ClasicoSidebar";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-auto py-4 w-full">
                <div className="w-64 overflow-y-auto overflow-y-auto over bg-gray-800">
                    <ClasicoSidebar/>
                </div>

                <div className="px-6">
                    <Outlet/>
                </div>
            </div>
        </SidebarProvider>
    );
}