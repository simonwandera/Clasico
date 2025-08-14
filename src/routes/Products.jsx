import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/common/ProductCard";
import { API_BASE_URL } from "../Config.js";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddProduct } from "../common/AddProduct";
import { Plus } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Products() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [category, setCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: productsPage, isPending, error } = useQuery({
    queryKey: ["products", page, size, category],
    queryFn: () => getProducts(page, size, category),
  });

  if (isPending)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        Error: {error.message}
      </div>
    );

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < productsPage.totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleProductAdded = async () => {
    try {
      // Clear the cache completely
      queryClient.removeQueries({ queryKey: ["products"] });
      
      // Wait a moment for the backend to process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force refetch the current page
      await queryClient.refetchQueries({ 
        queryKey: ["products", page, size, category] 
      });
      
      setIsDialogOpen(false);
      console.log("Product added and cache refreshed");
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-10">
      <header className="mb-8 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our latest collection
          </p>
        </div>
        
        {/* Add Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus size={20} />
              Add Product
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProduct onSuccess={handleProductAdded} />
          </DialogContent>
        </Dialog>
      </header>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Electronics", "Clothing", "Cars", "Accessories"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat === "All" ? null : cat);
                setPage(0); // Reset to first page when changing category
              }}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                (category === null && cat === "All") || category === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsPage?.content?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.productName}
            price={product.msrp || product.buyPrice || 0}
            originalPrice={product.originalPrice}
            category={product.productLine?.textDescription || product.category || 'General'} // ✅ string now
            imageUrl={product.image || product.productLine?.image || "/placeholder-product.jpg"}
            rating={product.rating || 0}
            isNew={product.isNew || false}
            isBestSeller={product.isBestSeller || false}
            stock={product.quantityInStock || product.quantity_in_stock || 0}
          />
        ))}
      </div>

      {/* Pagination */}
      {productsPage?.totalPages > 1 && (
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePrevPage} 
                  disabled={page === 0}
                  className={`cursor-pointer ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, productsPage.totalPages) }).map(
                (_, i) => {
                  const pageNum =
                    i +
                    Math.max(
                      0,
                      Math.min(page - 2, productsPage.totalPages - 5)
                    );
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={page === pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  disabled={page >= productsPage.totalPages - 1}
                  className={`cursor-pointer ${page >= productsPage.totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {productsPage?.content?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products available in this category.
          </p>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}

// API fetch function with pagination
const getProducts = async (page = 0, size = 8, category = null) => {
  let url = `${API_BASE_URL}/product?page=${page}&size=${size}`;
  if (category) {
    url = `${API_BASE_URL}/product/category/${category}?page=${page}&size=${size}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
};