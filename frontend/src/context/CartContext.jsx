// CartContext.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from local storage on component mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Save cart items to local storage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (item) => {
    console.log(item);

    const isDuplicate = cartItems.some(
      (cartItem) =>
        cartItem.product_id === item.product_id &&
        cartItem.net_quantity === item.net_quantity
    );

    if (!isDuplicate) {
      console.log("new item added to cart");
      setCartItems((prevCartItems) => [...prevCartItems, item]);
    } else {
      console.log("Item already exists in cart, ignoring.");
    }
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems();
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      // If newQuantity is 0 or less, remove the item
      removeItemFromCart(itemId);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
