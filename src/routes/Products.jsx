import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/common/ProductCard";
import { API_BASE_URL } from "../Config.js";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


export default function Products() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [category, setCategory] = useState(null);

  const { data: productsPage, isPending, error } = useQuery({
    queryKey: ['products', page, size, category],
    queryFn: () => getProducts(page, size, category)
  });

  if (isPending) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error.message}</div>;

  const handlePrevPage = () => setPage(p => Math.max(0, p - 1));
  const handleNextPage = () => setPage(p => p + 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Our Products
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover our latest collection
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Electronics', 'Clothing', 'Cars', 'Accessories'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat === 'All' ? null : cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              (category === null && cat === 'All') || category === cat
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {productsPage?.content?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.productName}
            price={product.MSRP}
            originalPrice={product.originalPrice}
            category={product.category}
            imageUrl={product.productLine?.image || '/default-product.png'}
            rating={product.rating}
            isNew={product.isNew}
            isBestSeller={product.isBestSeller}
            stock={product.quantity_in_stock}
          />
        ))}
      </div>

      {/* Pagination */}
      {productsPage?.totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePrevPage} 
                  disabled={page === 0}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, productsPage.totalPages) }).map((_, i) => {
                const pageNum = i + Math.max(0, 
                  Math.min(
                    page - 2, 
                    productsPage.totalPages - 5
                  )
                );
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage} 
                  disabled={page >= productsPage.totalPages - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {productsPage?.content?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available in this category.</p>
        </div>
      )}
    </div>
  );
}

// API fetch function with pagination
const getProducts = async (page = 0, size = 8, category = null) => {
  let url = `${API_BASE_URL}/product?page=${page}&size=${size}`;
  if (category) {
    url = `${API_BASE_URL}/category/${category}?page=${page}&size=${size}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
};
// const products = [
//   {
//     id: 1,
//     name: "Wireless Headphones",
//     price: 3500,
//     originalPrice: 4500,
//     category: "Electronics",
//     imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224f493?auto=format&fit=crop&w=800&q=80",
//     rating: 4.5,
//     isNew: true,
//   },
//   {
//     id: 2,
//     name: "Leather Wallet",
//     price: 1200,
//     category: "Accessories",
//     imageUrl: "https://images.unsplash.com/photo-1628191013193-40d18aa35e4f?auto=format&fit=crop&w=800&q=80",
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 3,
//     name: "Smart Watch",
//     price: 4800,
//     originalPrice: 6000,
//     category: "Wearables",
//     imageUrl: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80",
//     rating: 4.8,
//     isBestSeller: true,
//   },
//   {
//     id: 4,
//     name: "Toyota Camry New",
//     details: "3.5 D5 PowerPulse Momentum 5dr / 2565",
//     price: 25000,
//     label: "Great Price",
//     category: "Cars",
//     imageUrl: "https://images.unsplash.com/photo-1617137968427-8594bfb2d621?auto=format&fit=crop&w=800&q=80",
//     rating: 4.8,
//     isBestSeller: true,
//   },
//   {
//     id: 5,
//     name: "New GLC – 2023",
//     details: "4.0 D5 PowerPulse Momentum 5dr",
//     price: 95000,
//     label: "Low Mileage",
//     category: "Cars",
//     imageUrl: "https://www.freepik.com/free-photo/blue-jeep-photo-shooting-sunset_5895977.htm#fromView=search&page=1&position=2&uuid=b85a9d3c-4da4-4c32-a2df-0535f1209ea1&query=range+rover0",
//     rating: 4.8,
//     isBestSeller: true,
//   },
//   {
//     id: 6,
//     name: "Italian Dress",
//     details: "3.5 D5 PowerPulse Momentum 5dr AW",
//     price: 40000,
//     category: "Clothing",
//     imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9b?auto=format&fit=crop&w=800&q=80",
//     rating: 4.8,
//     isBestSeller: true,
//   },
// ];

// export default function Products() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <header className="mb-8 text-center">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//           Our Products
//         </h1>
//         <p className="text-lg text-muted-foreground">
//           Discover our latest collection
//         </p>
//       </header>

//       Product Grid
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             id={product.id}
//             name={product.name}
//             price={product.price}
//             originalPrice={product.originalPrice}
//             category={product.category}
//             imageUrl={product.imageUrl}
//             rating={product.rating}
//             isNew={product.isNew}
//             isBestSeller={product.isBestSeller}
//             stock={product.stock}
//           />
//         ))}
//       </div>

//       {/* Empty State (optional) */}
//       {products.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500">No products available at the moment.</p>
//         </div>
//       )}
//     </div>
//   );
// }