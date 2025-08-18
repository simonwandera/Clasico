import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  category,
  imageUrl,
  rating = 0,
  isNew = false,
  isBestSeller = false,
  stock,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  // Handle price & stock safely
  const productPrice = price || 0;
  const productStock = stock ?? 0;

  const hasDiscount = originalPrice && originalPrice > productPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - productPrice) / originalPrice) * 100)
    : 0;

  const isLowStock = productStock > 0 && productStock < 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (productStock === 0) {
      toast.error("This product is out of stock");
      return;
    }
    toast.success(`${name} has been added to your cart`);
    // TODO: Add cart logic here
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/products/${id}`);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const action = isWishlisted ? "removed from" : "added to";
    setIsWishlisted(!isWishlisted);
    toast.info(`${name} ${action} your wishlist`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer relative"
      onClick={() => navigate(`/products/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
      >
        <Heart
          className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        />
      </button>

      {/* Product Image */}
      <div className="relative">
        <img
          src={imageUrl || "/placeholder-product.jpg"}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isNew && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              New
            </Badge>
          )}
          {isBestSeller && (
            <Badge variant="secondary" className="bg-amber-600 text-white">
              Bestseller
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="secondary" className="bg-red-600 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              Only {productStock} left
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Category */}
        <Badge variant="outline" className="text-xs font-medium">
          {category || "General"}
        </Badge>

        {/* Name with Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-lg font-semibold line-clamp-2">
                {name || "Unnamed Product"}
              </h2>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between">
          {rating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          <span
            className={`text-xs ${
              productStock === 0
                ? "text-red-500 font-medium"
                : isLowStock
                ? "text-amber-600 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {productStock === 0
              ? "Out of stock"
              : productStock === 1
              ? "1 available"
              : `${productStock} available`}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-primary font-bold text-lg">
            {formatPrice(productPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-gray-100"
          onClick={handleViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={productStock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {productStock === 0 ? "Sold Out" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
