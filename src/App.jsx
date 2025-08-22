import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from "./routes/Dashboard";
import Products from "./routes/Products";
import NotFound from "./routes/NotFound.jsx";
import OrdersPage from "@/routes/Orders.jsx";
import ProductLines from './routes/ProductLines';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product-lines" element={<ProductLines />} />
                    <Route path="orders" element={<OrdersPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}