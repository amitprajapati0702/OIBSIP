import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => 
        item.id === action.payload.id
      );
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems)
        };
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: calculateTotal(action.payload.items || [])
      };

    default:
      return state;
  }
};

// Calculate total price
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Initial state
const initialState = {
  items: [],
  total: 0,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pizza-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pizza-cart', JSON.stringify(state));
  }, [state]);

  // Add item to cart
  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success('Item added to cart!');
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart!');
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared!');
  };

  // Get item count
  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if item exists in cart
  const isItemInCart = (itemId) => {
    return state.items.some(item => item.id === itemId);
  };

  // Get item quantity in cart
  const getItemQuantity = (itemId) => {
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Calculate delivery fee
  const getDeliveryFee = () => {
    return state.total > 500 ? 0 : 50; // Free delivery for orders above ₹500
  };

  // Calculate taxes (18% GST)
  const getTaxes = () => {
    return Math.round(state.total * 0.18 * 100) / 100;
  };

  // Calculate final total with delivery and taxes
  const getFinalTotal = () => {
    const deliveryFee = getDeliveryFee();
    const taxes = getTaxes();
    return Math.round((state.total + deliveryFee + taxes) * 100) / 100;
  };

  // Create pizza item for cart
  const createPizzaItem = (pizzaConfig) => {
    const {
      base,
      sauce,
      cheese,
      vegetables = [],
      meat = [],
      size,
      quantity,
      customizations = {},
      price
    } = pizzaConfig;

    // Generate unique ID for the pizza configuration
    const configString = JSON.stringify({
      base: base._id,
      sauce: sauce._id,
      cheese: cheese._id,
      vegetables: vegetables.map(v => v._id).sort(),
      meat: meat.map(m => m._id).sort(),
      size,
      customizations
    });
    
    const id = btoa(configString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

    return {
      id,
      type: 'pizza',
      name: `Custom ${size.charAt(0).toUpperCase() + size.slice(1)} Pizza`,
      description: `${base.name} base with ${sauce.name} sauce, ${cheese.name} cheese`,
      ingredients: {
        base,
        sauce,
        cheese,
        vegetables,
        meat
      },
      size,
      customizations,
      price,
      quantity,
      image: '/images/custom-pizza.jpg' // Default pizza image
    };
  };

  // Add pizza to cart
  const addPizzaToCart = (pizzaConfig) => {
    const pizzaItem = createPizzaItem(pizzaConfig);
    addItem(pizzaItem);
  };

  // Validate cart before checkout
  const validateCart = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty!');
      return false;
    }

    // Check minimum order amount
    if (state.total < 100) {
      toast.error('Minimum order amount is ₹100');
      return false;
    }

    return true;
  };

  // Get cart summary for checkout
  const getCartSummary = () => {
    return {
      items: state.items,
      subtotal: state.total,
      deliveryFee: getDeliveryFee(),
      taxes: getTaxes(),
      total: getFinalTotal(),
      itemCount: getItemCount()
    };
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    isItemInCart,
    getItemQuantity,
    getDeliveryFee,
    getTaxes,
    getFinalTotal,
    addPizzaToCart,
    validateCart,
    getCartSummary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
