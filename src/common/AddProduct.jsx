import { toast } from "sonner"

export function AddProduct({ onSuccess }) {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const product = {
      productName: form.productName.value,
      productCode: form.productCode.value,
      msrp: parseFloat(form.price.value),
      category: form.category.value,
      description: form.description.value,
      imageUrl: form.imageUrl.value,
    }

    console.log("Submitting product:", product);

    try {
      const response = await fetch("http://localhost:8080/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      console.log("Response status:", response);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error(`Failed to add product: ${response.status} ${response.statusText}`);
      }

      const createdProduct = await response.json();
      console.log("Product created successfully:", createdProduct);

      toast.success(`✅ ${product.productName} added successfully!`);
      form.reset();

      if (onSuccess) {
        console.log("Calling onSuccess callback");
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ " + error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="productName" className="text-sm font-medium text-gray-700">
          Product Name *
        </label>
        <input 
          id="productName"
          name="productName" 
          placeholder="Enter product name" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          required 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="productCode" className="text-sm font-medium text-gray-700">
          Product Code *
        </label>
        <input 
          id="productCode"
          name="productCode" 
          placeholder="Enter product code" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          required 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Price *
        </label>
        <input 
          id="price"
          name="price" 
          type="number" 
          step="0.01" 
          min="0"
          placeholder="0.00" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          required 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category *
        </label>
        <select 
          id="category"
          name="category" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
          required
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Cars">Cars</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea 
          id="description"
          name="description" 
          placeholder="Enter product description" 
          rows="3"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none" 
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input 
          id="imageUrl"
          name="imageUrl" 
          type="url"
          placeholder="https://example.com/image.jpg" 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" 
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Add Product
        </button>
      </div>
    </form>
  )
}