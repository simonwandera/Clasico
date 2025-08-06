import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group m-7 ">
      {/* Product Image with Badges */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Top-left badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isNew && (
            <Badge variant="secondary" className="bg-green-500 text-white">
              New
            </Badge>
          )}
          {isBestSeller && (
            <Badge variant="secondary" className="bg-orange-500 text-white">
              Bestseller
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="secondary" className="bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        {/* Category */}
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>

        {/* Product Name */}
        <h2 className="text-lg font-semibold line-clamp-2" title={name}>
          {name}
        </h2>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              {rating.toFixed(1)} {stock && `(${stock} left)`}
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-primary font-bold">
            Ksh {price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              Ksh {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button size="sm" className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}