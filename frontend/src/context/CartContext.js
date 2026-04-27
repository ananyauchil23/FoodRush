import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });
  const [restaurantInfo, setRestaurantInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartRestaurant')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    localStorage.setItem('cartRestaurant', JSON.stringify(restaurantInfo));
  }, [cartItems, restaurantInfo]);

  const addToCart = (item, restaurant) => {
    // If adding from a different restaurant, clear cart
    if (restaurantInfo && restaurantInfo._id !== restaurant._id) {
      if (!window.confirm('Your cart has items from another restaurant. Clear and add new item?')) {
        return;
      }
      setCartItems([]);
    }

    setRestaurantInfo(restaurant);
    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
    if (cartItems.length === 1) setRestaurantInfo(null);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantInfo(null);
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantInfo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
