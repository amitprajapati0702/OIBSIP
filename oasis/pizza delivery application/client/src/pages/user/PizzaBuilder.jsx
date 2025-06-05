import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { Pizza, Plus, Minus } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';

const PizzaBuilder = () => {
  const [ingredients, setIngredients] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState({
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
    meat: []
  });
  const [size, setSize] = useState('medium');
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({
    extraCheese: false,
    extraSauce: false,
    thinCrust: false
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const { addPizzaToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('/pizza/ingredients');
      setIngredients(response.data.data.ingredients);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
      toast.error('Failed to load ingredients');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    let price = 0;
    
    // Base prices
    if (selectedIngredients.base) price += selectedIngredients.base.price;
    if (selectedIngredients.sauce) price += selectedIngredients.sauce.price;
    if (selectedIngredients.cheese) price += selectedIngredients.cheese.price;
    
    // Vegetables and meat
    selectedIngredients.vegetables.forEach(veg => price += veg.price);
    selectedIngredients.meat.forEach(meat => price += meat.price);

    // Size multipliers
    const sizeMultipliers = { small: 0.8, medium: 1.0, large: 1.3 };
    price *= sizeMultipliers[size];

    // Customizations
    if (customizations.extraCheese) price += 50;
    if (customizations.extraSauce) price += 30;
    if (customizations.thinCrust) price += 20;

    setTotalPrice(Math.round(price * 100) / 100);
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedIngredients, size, customizations]);

  const selectIngredient = (category, ingredient) => {
    if (category === 'vegetables' || category === 'meat') {
      setSelectedIngredients(prev => ({
        ...prev,
        [category]: prev[category].some(item => item.id === ingredient.id)
          ? prev[category].filter(item => item.id !== ingredient.id)
          : [...prev[category], ingredient]
      }));
    } else {
      setSelectedIngredients(prev => ({
        ...prev,
        [category]: ingredient
      }));
    }
  };

  const isSelected = (category, ingredient) => {
    if (category === 'vegetables' || category === 'meat') {
      return selectedIngredients[category].some(item => item.id === ingredient.id);
    }
    return selectedIngredients[category]?.id === ingredient.id;
  };

  const canAddToCart = () => {
    return selectedIngredients.base && selectedIngredients.sauce && selectedIngredients.cheese;
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      toast.error('Please select base, sauce, and cheese');
      return;
    }

    const pizzaConfig = {
      ...selectedIngredients,
      size,
      quantity,
      customizations,
      price: totalPrice
    };

    addPizzaToCart(pizzaConfig);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Build Your Perfect Pizza</h1>
          <p className="text-gray-600">Customize every detail of your pizza</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pizza Builder */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pizza Bases */}
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Choose Your Base</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredients.base?.map((base) => (
                  <div
                    key={base.id}
                    onClick={() => selectIngredient('base', base)}
                    className={`pizza-ingredient-card ${isSelected('base', base) ? 'selected' : ''}`}
                  >
                    <h3 className="font-medium">{base.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{base.description}</p>
                    <p className="text-primary-600 font-semibold mt-2">₹{base.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sauces */}
            <div>
              <h2 className="text-xl font-semibold mb-4">2. Choose Your Sauce</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredients.sauce?.map((sauce) => (
                  <div
                    key={sauce.id}
                    onClick={() => selectIngredient('sauce', sauce)}
                    className={`pizza-ingredient-card ${isSelected('sauce', sauce) ? 'selected' : ''}`}
                  >
                    <h3 className="font-medium">{sauce.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{sauce.description}</p>
                    <p className="text-primary-600 font-semibold mt-2">₹{sauce.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cheese */}
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Choose Your Cheese</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredients.cheese?.map((cheese) => (
                  <div
                    key={cheese.id}
                    onClick={() => selectIngredient('cheese', cheese)}
                    className={`pizza-ingredient-card ${isSelected('cheese', cheese) ? 'selected' : ''}`}
                  >
                    <h3 className="font-medium">{cheese.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{cheese.description}</p>
                    <p className="text-primary-600 font-semibold mt-2">₹{cheese.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vegetables */}
            <div>
              <h2 className="text-xl font-semibold mb-4">4. Add Vegetables (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ingredients.vegetable?.map((vegetable) => (
                  <div
                    key={vegetable.id}
                    onClick={() => selectIngredient('vegetables', vegetable)}
                    className={`pizza-ingredient-card ${isSelected('vegetables', vegetable) ? 'selected' : ''}`}
                  >
                    <h3 className="font-medium">{vegetable.name}</h3>
                    <p className="text-primary-600 font-semibold mt-2">₹{vegetable.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Meat */}
            <div>
              <h2 className="text-xl font-semibold mb-4">5. Add Meat (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ingredients.meat?.map((meat) => (
                  <div
                    key={meat.id}
                    onClick={() => selectIngredient('meat', meat)}
                    className={`pizza-ingredient-card ${isSelected('meat', meat) ? 'selected' : ''}`}
                  >
                    <h3 className="font-medium">{meat.name}</h3>
                    <p className="text-primary-600 font-semibold mt-2">₹{meat.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Your Pizza</h3>
              
              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map((sizeOption) => (
                    <button
                      key={sizeOption}
                      onClick={() => setSize(sizeOption)}
                      className={`btn-sm ${size === sizeOption ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizations */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customizations</label>
                <div className="space-y-2">
                  {Object.entries(customizations).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {key === 'extraCheese' ? 'Extra Cheese (+₹50)' :
                         key === 'extraSauce' ? 'Extra Sauce (+₹30)' :
                         'Thin Crust (+₹20)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn-outline btn-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn-outline btn-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{(totalPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
                className="btn-primary btn-lg w-full"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
