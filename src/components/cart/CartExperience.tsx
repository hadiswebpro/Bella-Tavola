import { useMemo, useState } from "react";
import useCart from "../../hooks/useCart";
import Layout from "../layout/Layout";
import SpecialOffers from "../home/SpecialOffers";
import HomePage from "../../pages/HomePage";
import { foods } from "../../data/foods";
import type { Food, FoodCategory } from "../../types/food";


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
      {isMiniCartOpen && (
        <div className="mini-cart" id="mini-cart" role="region" aria-label="Quick basket preview">
          <div className="mini-cart__heading">
            <div><span className="eyebrow">Something delicious</span><h2>Your basket ({cartCount})</h2></div>
            <button className="mini-cart__close" type="button" aria-label="Close basket preview" onClick={() => setIsMiniCartOpen(false)}>×</button>
          </div>
          {cartItems.length === 0 ? (
            <div className="mini-cart__empty"><p>Your basket is waiting for something delicious.</p><button type="button" onClick={() => setIsMiniCartOpen(false)}>Explore the menu</button></div>
          ) : (
            <>
              <div className="mini-cart__items">
                {cartItems.slice(0, 3).map(({ food, quantity }) => (
                  <div className="mini-cart__item" key={food.id}>
                    <img src={food.image} alt="" />
                    <div className="mini-cart__item-info"><strong>{food.name}</strong><small>Qty {quantity} · {(food.price * quantity).toLocaleString("en-US", { style: "currency", currency: "USD" })}</small></div>
                    <div className="mini-cart__quantity">
                      <button type="button" aria-label={"Remove one " + food.name} onClick={() => changeQuantity(food.id, -1)}>−</button>
                      <span>{quantity}</span>
                      <button type="button" aria-label={"Add one " + food.name} onClick={() => changeQuantity(food.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && <p className="mini-cart__more">And {cartItems.length - 3} more items…</p>}
              </div>
              <div className="mini-cart__subtotal"><span>Subtotal</span><strong>{cartSubtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong></div>
              <button className="mini-cart__view-button" type="button" onClick={() => { setIsMiniCartOpen(false); setIsCartOpen(true); }}>View full basket <span aria-hidden="true">↗</span></button>
            </>
          )}
        </div>
      )}

      {isPromoVisible && <SpecialOffers onClose={() => setIsPromoVisible(false)} onNotice={(message) => {setNotice(message);window.setTimeout(() => setNotice(""),2500)}}/>}
<HomePage activeCategory={activeCategory} onCategoryChange={setActiveCategory} searchQuery={searchQuery} onSearchChange={setSearchQuery} visibleFoods={visibleFoods} onAddToCart={handleAddToCart}/>
</Layout>
{isCartOpen && (
        <div
          className="cart-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCartOpen(false);
          }}
        >
          <section
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="cart-drawer__header">
              <div>
                <span className="eyebrow">Something delicious</span>
                <h2 id="cart-title">Your basket <span>({cartCount})</span></h2>
              </div>
              <button
                className="cart-drawer__close"
                type="button"
                aria-label="Close basket"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                  setOrderPlaced(false);
                  setCheckoutError("");
                }}
              >
                ×
              </button>
            </div>


            {isCheckingOut && !orderPlaced && (
              <div className="checkout-view">
                <button className="checkout-back" type="button" onClick={() => { setIsCheckingOut(false); setCheckoutError(""); }}>
                  ← Back to basket
                </button>
                <div className="checkout-heading">
                  <span className="eyebrow">Almost at the table</span>
                  <h3>Complete your <span>order</span></h3>
                  <p>Tell us where to send your Italian favourites.</p>
                </div>

                <form
                  className="checkout-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (cartItems.length === 0) {
                      setCheckoutError("Your basket is empty. Add a dish before checking out.");
                      return;
                    }
                    if (!customerName.trim()) {
                      setCheckoutError("Please enter your name.");
                      return;
                    }
                    if (!/^[+()\d\s.-]{7,20}$/.test(customerPhone.trim())) {
                      setCheckoutError("Please enter a valid phone number.");
                      return;
                    }
                    if (orderType === "delivery" && deliveryAddress.trim().length < 8) {
                      setCheckoutError("Please enter a complete delivery address.");
                      return;
                    }

                    const nextOrderNumber = `BT-${Date.now().toString().slice(-7)}`;
                    setOrderNumber(nextOrderNumber);
                    setPlacedOrderTotal(orderTotal);
                    setOrderPlaced(true);
                    setCartItems([]);
                    setAppliedPromo(false);
                    setPromoCode("");
                    setCheckoutError("");
                  }}
                >
                  <label className="checkout-field">
                    <span>Full name <b>*</b></span>
                    <input autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Alex Morgan" required />
                  </label>

                  <label className="checkout-field">
                    <span>Phone number <b>*</b></span>
                    <input autoComplete="tel" inputMode="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="+1 555 123 4567" required />
                  </label>

                  <fieldset className="order-type">
                    <legend>How would you like your order?</legend>
                    <label className={orderType === "delivery" ? "order-type__option order-type__option--active" : "order-type__option"}>
                      <input type="radio" name="orderType" value="delivery" checked={orderType === "delivery"} onChange={() => setOrderType("delivery")} />
                      <span aria-hidden="true">🚲</span>
                      <span><strong>Delivery</strong><small>$4.99 delivery fee</small></span>
                    </label>
                    <label className={orderType === "pickup" ? "order-type__option order-type__option--active" : "order-type__option"}>
                      <input type="radio" name="orderType" value="pickup" checked={orderType === "pickup"} onChange={() => setOrderType("pickup")} />
                      <span aria-hidden="true">🥡</span>
                      <span><strong>Pickup</strong><small>Collect from the kitchen</small></span>
                    </label>
                  </fieldset>

                  {orderType === "delivery" && (
                    <label className="checkout-field">
                      <span>Delivery address <b>*</b></span>
                      <textarea autoComplete="street-address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Street, building, apartment, city" rows={3} required />
                    </label>
                  )}

                  <label className="checkout-field">
                    <span>Order notes <small>(optional)</small></span>
                    <textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder="Allergies, delivery instructions..." rows={2} />
                  </label>

                  <div className="promo-entry">
                    <label className="checkout-field">
                      <span>Promo code</span>
                      <input value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setAppliedPromo(false); }} placeholder="Try BELLA10" />
                    </label>
                    <button type="button" onClick={() => {
                      if (promoCode.trim().toUpperCase() === "BELLA10") {
                        setAppliedPromo(true);
                        setCheckoutError("");
                      } else {
                        setAppliedPromo(false);
                        setCheckoutError("That promo code isn't valid. Try BELLA10.");
                      }
                    }}>Apply</button>
                  </div>
                  {appliedPromo && <p className="promo-success" role="status">BELLA10 applied — 10% off your food subtotal.</p>}

                  <div className="checkout-total">
                    <div><span>Subtotal</span><span>{cartSubtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
                    {discountAmount > 0 && <div className="checkout-total__discount"><span>Discount (10%)</span><span>−{discountAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>}
                    <div><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : deliveryFee.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
                    <div><span>Estimated tax (8%)</span><span>{estimatedTax.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
                    <div className="checkout-total__grand"><strong>Estimated total</strong><strong>{orderTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong></div>
                  </div>

                  {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                  <button className="cart-checkout checkout-submit" type="submit">Place demo order <span aria-hidden="true">→</span></button>
                  <p className="checkout-disclaimer">Demo checkout only. No payment will be collected and no real order is sent.</p>
                </form>
              </div>
            )}

            {orderPlaced && (
              <div className="order-success" role="status">
                <span className="order-success__icon" aria-hidden="true">✓</span>
                <span className="eyebrow">Grazie mille!</span>
                <h3>Your order is <span>noted.</span></h3>
                <p>This is a demo confirmation. No restaurant received this order and no payment was taken.</p>
                <div className="order-success__number"><span>Demo order number</span><strong>{orderNumber}</strong></div>
                <div className="order-success__summary">
                  <span>Order type</span><strong>{orderType === "delivery" ? "Delivery" : "Pickup"}</strong>
                  <span>Customer</span><strong>{customerName}</strong>
                  <span>Estimated total</span><strong>{placedOrderTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>
                </div>
                <button className="cart-checkout" type="button" onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckingOut(false);
                  setOrderPlaced(false);
                  setCustomerName("");
                  setCustomerPhone("");
                  setDeliveryAddress("");
                  setOrderNotes("");
                  setOrderType("delivery");
                }}>Back to Bella Tavola <span aria-hidden="true">↗</span></button>
              </div>
            )}

            {!isCheckingOut && !orderPlaced && ( cartItems.length === 0 ? (
              <div className="cart-empty">
                <span aria-hidden="true">🍝</span>
                <h3>Your basket is looking a little empty</h3>
                <p>Let’s find something delicious for you.</p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore the menu <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(({ food, quantity }) => (
                    <article className="cart-item" key={food.id}>
                      <img className="cart-item__image" src={food.image} alt={food.name} />
                      <div className="cart-item__details">
                        <h3>{food.name}</h3>
                        <p className="cart-item__price">
                          {(food.price * quantity).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        <div className="cart-item__actions">
                          <div className="quantity-control" aria-label={`Quantity of ${food.name}`}>
                            <button type="button" aria-label={`Remove one ${food.name}`} onClick={() => changeQuantity(food.id, -1)}>−</button>
                            <span aria-live="polite">{quantity}</span>
                            <button type="button" aria-label={`Add one ${food.name}`} onClick={() => changeQuantity(food.id, 1)}>+</button>
                          </div>
                          <button className="cart-item__remove" type="button" onClick={() => removeFromCart(food.id)}>Remove</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-summary__row">
                    <span>Subtotal</span>
                    <strong>{cartSubtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>
                  </div>
                  <p>Taxes and delivery are calculated at checkout.</p>
                  <button
                    className="cart-checkout"
                    type="button"
                    onClick={() => {
                      setIsCheckingOut(true);
                      setOrderPlaced(false);
                      setCheckoutError("");
                    }}
                  >
                    Continue to checkout <span aria-hidden="true">→</span>
                  </button>
                  <button className="cart-continue" type="button" onClick={() => setIsCartOpen(false)}>
                    Continue browsing
                  </button>
                </div>
              </>
            ))}
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
