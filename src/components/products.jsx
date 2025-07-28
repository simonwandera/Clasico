import React, { useState, useEffect } from 'react';

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8081/api/offices');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    // product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product
  );

  return (
    <div className="min-h-screen w-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Offices</h1>
      
       Search Bar
      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        </div>
        <input
          type="text"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Products Table */}
      <div className="border-2 border-blue-300 rounded-lg overflow-hidden bg-white shadow-sm w-full">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-2">Error loading products</div>
            <div className="text-gray-500 text-sm">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Office Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                City
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                State
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                Country
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((office, index) => (
              <tr key={office.officeCode} className={index % 2 === 1 ? 'bg-blue-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {office.officeCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {office.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {office.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {office.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                  {office.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default ProductsTable;