import React, { useState, useEffect } from "react";
import { Search, Plus, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProductLineCard from "../common/ProductLineCard";
import AddProductLine from "../common/AddProductLine";
import EditProductLine from "../common/EditProductLine";
import { useProductLines } from "../hooks/use-product-lines";
import { debounce } from "../lib/utils";

const ProductLines = () => {
  const {
    productLines,
    loading,
    error,
    addProductLine,
    updateProductLine,
    deleteProductLine,
  } = useProductLines();

  const [filteredProductLines, setFilteredProductLines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductLine, setSelectedProductLine] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOrder, setSortOrder] = useState("asc");

  // Debounced search
  const debouncedSearch = debounce((term, list) => {
    let filtered = list.filter(
      (line) =>
        line.productLine.toLowerCase().includes(term.toLowerCase()) ||
        line.textDescription.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProductLines(filtered);
  }, 300);

  // Initial load
  useEffect(() => {
    setFilteredProductLines(productLines);
  }, [productLines]);

  // Search effect
  useEffect(() => {
    debouncedSearch(searchTerm, productLines);
  }, [searchTerm, productLines]);

  // Sort effect
  useEffect(() => {
    const sorted = [...filteredProductLines].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.productLine.localeCompare(b.productLine);
          break;
        case "newest":
          comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          break;
        case "oldest":
          comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          break;
        default:
          comparison = a.id - b.id;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    setFilteredProductLines(sorted);
  }, [sortBy, sortOrder]);

  const handleAddProductLine = async (newProductLineData) => {
    try {
      await addProductLine(newProductLineData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add product line:", error);
    }
  };

  const handleEditProductLine = async (updatedProductLineData) => {
    try {
      await updateProductLine(selectedProductLine.id, updatedProductLineData);
      setIsEditDialogOpen(false);
      setSelectedProductLine(null);
    } catch (error) {
      console.error("Failed to update product line:", error);
    }
  };

  const handleDeleteProductLine = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this product line? This action cannot be undone."
      )
    ) {
      try {
        await deleteProductLine(id);
      } catch (error) {
        console.error("Failed to delete product line:", error);
      }
    }
  };

  const openEditDialog = (productLine) => {
    setSelectedProductLine(productLine);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (productLine) => {
    setSelectedProductLine(productLine);
    setIsViewDialogOpen(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // --- Loading & Error states omitted for brevity (same as your code) ---

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Lines</h1>
          <p className="text-gray-600 mt-1">Manage your product line catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product Line
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product Line</DialogTitle>
            </DialogHeader>
            <AddProductLine
              onSubmit={handleAddProductLine}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search product lines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="p-2"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <Badge variant="outline" className="px-3 py-1">
          Total: {productLines.length}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          Showing: {filteredProductLines.length}
        </Badge>
        {searchTerm && (
          <Badge variant="secondary" className="px-3 py-1">
            Search: "{searchTerm}"
          </Badge>
        )}
      </div>

      {/* Product Lines Grid */}
      {filteredProductLines.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              {searchTerm
                ? `No product lines found matching "${searchTerm}"`
                : "No product lines available. Create your first product line to get started!"}
            </div>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product Line
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProductLines.map((productLine) => (
            <ProductLineCard
              key={productLine.id}
              productLine={productLine}
              onEdit={openEditDialog}
              onDelete={handleDeleteProductLine}
              onView={openViewDialog}
            />
          ))}
        </div>
      )}

      {/* Edit & View Dialogs (same as your code) */}
    </div>
  );
};

export default ProductLines;
