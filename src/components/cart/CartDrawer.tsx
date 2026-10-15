import type {Dispatch,SetStateAction} from "react";
import type {CartItem} from "../../hooks/useCart";
import "./CartDrawer.css";
type Props={isCartOpen:boolean;setIsCartOpen:(v:boolean)=>void;cartItems:CartItem[];setCartItems:Dispatch<SetStateAction<CartItem[]>>;cartCount:number;cartSubtotal:number;changeQuantity:(id:string,amount:number)=>void;removeFromCart:(id:string)=>void;isCheckingOut:boolean;setIsCheckingOut:(v:boolean)=>void;orderPlaced:boolean;setOrderPlaced:(v:boolean)=>void;orderNumber:string;setOrderNumber:(v:string)=>void;placedOrderTotal:number;setPlacedOrderTotal:(v:number)=>void;customerName:string;setCustomerName:(v:string)=>void;customerPhone:string;setCustomerPhone:(v:string)=>void;orderType:"delivery"|"pickup";setOrderType:(v:"delivery"|"pickup")=>void;deliveryAddress:string;setDeliveryAddress:(v:string)=>void;orderNotes:string;setOrderNotes:(v:string)=>void;promoCode:string;setPromoCode:(v:string)=>void;appliedPromo:boolean;setAppliedPromo:(v:boolean)=>void;checkoutError:string;setCheckoutError:(v:string)=>void;discountAmount:number;deliveryFee:number;estimatedTax:number;orderTotal:number};
export default function CartDrawer(props:Props){const {isCartOpen,setIsCartOpen,cartItems,setCartItems,cartCount,cartSubtotal,changeQuantity,removeFromCart,isCheckingOut,setIsCheckingOut,orderPlaced,setOrderPlaced,orderNumber,setOrderNumber,placedOrderTotal,setPlacedOrderTotal,customerName,setCustomerName,customerPhone,setCustomerPhone,orderType,setOrderType,deliveryAddress,setDeliveryAddress,orderNotes,setOrderNotes,promoCode,setPromoCode,appliedPromo,setAppliedPromo,checkoutError,setCheckoutError,discountAmount,deliveryFee,estimatedTax,orderTotal}=props;return (
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
      );}
