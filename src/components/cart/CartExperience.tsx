import { useMemo, useState } from "react";
import useCart from "../../hooks/useCart";
import MiniCart from "./MiniCart";
import CartDrawer from "./CartDrawer";
import Layout from "../layout/Layout";
import SpecialOffers from "../home/SpecialOffers";
import HomePage from "../../pages/HomePage";
import { foods } from "../../data/foods";
import type { Food, FoodCategory } from "../../types/food";


import "./CartExperience.css";
export default function CartExperience() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const {cartItems,setCartItems,cartCount,cartSubtotal,addToCart,changeQuantity,removeFromCart}=useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPromoVisible, setIsPromoVisible] = useState(true);
  const discountAmount = appliedPromo ? cartSubtotal * 0.1 : 0;
  const deliveryFee = orderType === "delivery" && cartItems.length > 0 ? 4.99 : 0;
  const estimatedTax = Math.max(0, cartSubtotal - discountAmount) * 0.08;
  const orderTotal = cartSubtotal - discountAmount + deliveryFee + estimatedTax;

  const visibleFoods = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesCategory =
        activeCategory === "all" || food.category === activeCategory;
      const matchesSearch =
        query.length === 0 ||
        food.name.toLowerCase().includes(query) ||
        food.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  function handleAddToCart(food: Food) {
    addToCart(food);
    setNotice(`${food.name} added to your cart`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  return (
    <div className="site-shell">
<Layout cartCount={cartCount} isMiniCartOpen={isMiniCartOpen} onCartClick={() => setIsMiniCartOpen(open => !open)}>
      <MiniCart cartItems={cartItems} cartCount={cartCount} cartSubtotal={cartSubtotal} changeQuantity={changeQuantity} onClose={() => setIsMiniCartOpen(false)} onOpenCart={() => {setIsMiniCartOpen(false);setIsCartOpen(true);}} />

      {isPromoVisible && <SpecialOffers onClose={() => setIsPromoVisible(false)} onNotice={(message) => {setNotice(message);window.setTimeout(() => setNotice(""),2500)}}/>}
<HomePage activeCategory={activeCategory} onCategoryChange={setActiveCategory} searchQuery={searchQuery} onSearchChange={setSearchQuery} visibleFoods={visibleFoods} onAddToCart={handleAddToCart}/>
</Layout>
<CartDrawer setIsCartOpen={setIsCartOpen} cartItems={cartItems} setCartItems={setCartItems} cartCount={cartCount} cartSubtotal={cartSubtotal} changeQuantity={changeQuantity} removeFromCart={removeFromCart} isCheckingOut={isCheckingOut} setIsCheckingOut={setIsCheckingOut} orderPlaced={orderPlaced} setOrderPlaced={setOrderPlaced} orderNumber={orderNumber} setOrderNumber={setOrderNumber} placedOrderTotal={placedOrderTotal} setPlacedOrderTotal={setPlacedOrderTotal} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} orderType={orderType} setOrderType={setOrderType} deliveryAddress={deliveryAddress} setDeliveryAddress={setDeliveryAddress} orderNotes={orderNotes} setOrderNotes={setOrderNotes} promoCode={promoCode} setPromoCode={setPromoCode} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} checkoutError={checkoutError} setCheckoutError={setCheckoutError} discountAmount={discountAmount} deliveryFee={deliveryFee} estimatedTax={estimatedTax} orderTotal={orderTotal}/>

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
