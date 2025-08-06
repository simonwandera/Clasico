import ProductCard from "@/common/ProductCard";


const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 3500,
    originalPrice: 4500,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224f493?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    isNew: true,
  },
  {
    id: 2,
    name: "Leather Wallet",
    price: 1200,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1628191013193-40d18aa35e4f?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: 5,
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 4800,
    originalPrice: 6000,
    category: "Wearables",
    imageUrl: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Toyota Camry New",
    details: "3.5 D5 PowerPulse Momentum 5dr / 2565",
    price: 25000,
    label: "Great Price",
    category: "Cars",
    imageUrl: "https://images.unsplash.com/photo-1617137968427-8594bfb2d621?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: 5,
    name: "New GLC – 2023",
    details: "4.0 D5 PowerPulse Momentum 5dr",
    price: 95000,
    label: "Low Mileage",
    category: "Cars",
    imageUrl: "https://www.freepik.com/free-photo/blue-jeep-photo-shooting-sunset_5895977.htm#fromView=search&page=1&position=2&uuid=b85a9d3c-4da4-4c32-a2df-0535f1209ea1&query=range+rover0",
    rating: 4.8,
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Italian Dress",
    details: "3.5 D5 PowerPulse Momentum 5dr AW",
    price: 40000,
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9b?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    isBestSeller: true,
  },
];

export default function Products() {
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

      Product Grid
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            category={product.category}
            imageUrl={product.imageUrl}
            rating={product.rating}
            isNew={product.isNew}
            isBestSeller={product.isBestSeller}
            stock={product.stock}
          />
        ))}
      </div>

      {/* Empty State (optional) */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}