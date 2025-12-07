import React, { useState, useEffect } from 'react';
import { getMarketplaceItems } from '../services/api';
import { ShoppingBag, Search } from 'lucide-react';

const Marketplace = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getMarketplaceItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch marketplace items", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Recyclables Marketplace</h1>
        <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
             />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                 <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-4">Seller: {item.seller}</p>

              <div className="flex justify-between items-center mb-4">
                 <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Quantity</span>
                    <p className="font-medium text-gray-900">{item.quantity}</p>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Price</span>
                    <p className="font-bold text-primary text-lg">{item.price}</p>
                 </div>
              </div>

              <button className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
             <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No items available</h3>
                <p className="mt-1">Check back later for new recyclable materials.</p>
              </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
