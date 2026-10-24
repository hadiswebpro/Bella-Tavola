import { useEffect, useState } from "react";
import { foods } from "../data/foods";
import type { Food } from "../types/food";

export type CartItem = { food: Food; quantity: number };

function loadCartFromStorage(): CartItem[] {
  try {
    const savedCart = window.localStorage.getItem("bella-tavola-cart");
    if (!savedCart) return [];
    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): CartItem[] => {
      if (
        typeof item !== "object" ||
        item === null ||
        !("food" in item) ||
        typeof item.food !== "object" ||
        item.food === null ||
        !("id" in item.food) ||
        typeof item.food.id !== "string" ||
        !("quantity" in item) ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      )
        return [];
      const currentFood = foods.find((food) => food.id === item.food.id);
      return currentFood
        ? [{ food: currentFood, quantity: item.quantity }]
        : [];
    });
  } catch {
    return [];
  }
}

export default function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "bella-tavola-cart",
        JSON.stringify(cartItems),
      );
    } catch {
      /* Storage is optional. */
    }
  }, [cartItems]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.food.price * item.quantity,
    0,
  );
  function addToCart(food: Food) {
    setCartItems((items) => {
      const existing = items.find((item) => item.food.id === food.id);
      return existing
        ? items.map((item) =>
            item.food.id === food.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { food, quantity: 1 }];
    });
  }
  function changeQuantity(foodId: string, amount: number) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }
  function removeFromCart(foodId: string) {
    setCartItems((items) => items.filter((item) => item.food.id !== foodId));
  }
  return {
    cartItems,
    setCartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    changeQuantity,
    removeFromCart,
  };
}
