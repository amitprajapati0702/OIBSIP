import React from 'react';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <a href="/pizza-builder" className="btn-primary">
              Build Your Pizza
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-gray-600">Cart functionality will be implemented soon.</p>
            <p className="text-lg font-semibold mt-4">Total: ₹{total}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
