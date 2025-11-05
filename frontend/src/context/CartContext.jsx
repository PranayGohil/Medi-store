// CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from local storage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems);
        setCartItems(parsedItems);
        console.log(
          "Cart loaded from localStorage:",
          parsedItems.length,
          "items"
        );
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart items to local storage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      console.log("Cart saved to localStorage:", cartItems.length, "items");
    } else {
      // Only remove if explicitly empty, not on initial load
      const storedCartItems = localStorage.getItem("cartItems");
      if (storedCartItems && cartItems.length === 0) {
        localStorage.setItem("cartItems", JSON.stringify([]));
      }
    }
  }, [cartItems]);

  const addItemToCart = (item) => {
    console.log("Adding item to cart:", item);

    setCartItems((prevCartItems) => {
      const isDuplicate = prevCartItems.some(
        (cartItem) =>
          cartItem.product_id === item.product_id &&
          cartItem.net_quantity === item.net_quantity
      );

      if (!isDuplicate) {
        console.log("New item added to cart");
        const updatedCart = [...prevCartItems, item];
        // Immediately save to localStorage
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        console.log("Item already exists in cart, ignoring.");
        return prevCartItems;
      }
    });
  };

  const removeItemFromCart = (itemId, net_quantity) => {
    console.log("Removing item with ID:", itemId, net_quantity);
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.filter(
        (item) =>
          !(item.product_id === itemId && item.net_quantity === net_quantity)
      );
      // Immediately save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    console.log("Clearing cart");
    localStorage.removeItem("cartItems");
    setCartItems([]);
  };

  const updateItemQuantity = (itemId, net_quantity, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems((prevCartItems) => {
        const updatedCart = prevCartItems.map((item) =>
          item.product_id === itemId && item.net_quantity === net_quantity
            ? { ...item, quantity: newQuantity }
            : item
        );
        // Immediately save to localStorage
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return updatedCart;
      });
    } else {
      removeItemFromCart(itemId, net_quantity);
    }
  };

  // Function to sync cart from localStorage (useful after login)
  const syncCartFromStorage = () => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems);
        setCartItems(parsedItems);
        console.log(
          "Cart synced from localStorage:",
          parsedItems.length,
          "items"
        );
      } catch (error) {
        console.error("Error syncing cart from localStorage:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        updateItemQuantity,
        syncCartFromStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
