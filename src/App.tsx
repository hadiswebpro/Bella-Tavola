import { useEffect, useMemo, useState } from "react";
import FoodGrid from "./components/food/FoodGrid";
import { categories } from "./data/categories";
import { foods } from "./data/foods";
import type { Food, FoodCategory } from "./types/food";
import "./App.css";

type CartItem = { food: Food; quantity: number };

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
      ) {
        return [];
      }

      const currentFood = foods.find((food) => food.id === item.food.id);
      return currentFood ? [{ food: currentFood, quantity: item.quantity }] : [];
    });
  } catch {
    return [];
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
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
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0);
  const discountAmount = appliedPromo ? cartSubtotal * 0.1 : 0;
  const deliveryFee = orderType === "delivery" && cartItems.length > 0 ? 4.99 : 0;
  const estimatedTax = Math.max(0, cartSubtotal - discountAmount) * 0.08;
  const orderTotal = cartSubtotal - discountAmount + deliveryFee + estimatedTax;

  useEffect(() => {
    try {
      window.localStorage.setItem("bella-tavola-cart", JSON.stringify(cartItems));
    } catch {
      // The cart still works for this session if browser storage is unavailable.
    }
  }, [cartItems]);

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
    setCartItems((items) => {
      const existingItem = items.find((item) => item.food.id === food.id);

      if (existingItem) {
        return items.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { food, quantity: 1 }];
    });
    setNotice(`${food.name} added to your cart`);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function changeQuantity(foodId: string, amount: number) {
    setCartItems((items) =>
      items
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(foodId: string) {
    setCartItems((items) => items.filter((item) => item.food.id !== foodId));
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Bella Tavola home">
          <span className="brand__mark" aria-hidden="true">B</span>
          <span className="brand__text">
            <strong>Bella Tavola</strong>
            <small>Italian kitchen</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="main-nav__link main-nav__link--active" href="#home">Home</a>
          <a className="main-nav__link" href="#menu">Our Menu</a>
          <a className="main-nav__link" href="#story">Our Story</a>
        </nav>

        <button className="cart-button" type="button" aria-label={`Cart, ${cartCount} items`} onClick={() => setIsMiniCartOpen((open) => !open)} aria-controls="mini-cart" aria-expanded={isMiniCartOpen}>
          <span aria-hidden="true">🛍</span>
          <span className="cart-button__label">Cart</span>
          <span className="cart-button__count">{cartCount}</span>
        </button>
      </header>

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

      {isPromoVisible && <aside className="promo-banner" aria-label="Special offer">
        <div className="promo-banner__inner">
          <span className="promo-banner__sparkle" aria-hidden="true">✦</span>
          <div className="promo-banner__message">
            <span className="promo-banner__eyebrow">A little treat from us</span>
            <p><strong>Take 10% off</strong> your food order with code <strong className="promo-banner__code">BELLA10</strong></p>
          </div>
          <button
            className="promo-banner__button"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText("BELLA10");
                setNotice("Promo code BELLA10 copied!");
              } catch {
                setNotice("Use promo code BELLA10 at checkout.");
              }
              window.setTimeout(() => setNotice(""), 2500);
            }}
          >
            Copy code <span aria-hidden="true">↗</span>
          </button>
          <button className="promo-banner__close" type="button" aria-label="Dismiss special offer" onClick={() => setIsPromoVisible(false)}>×</button>
        </div>
      </aside>}

      <main>
        <section className="hero-section" id="home">
          <div className="hero-section__content">
            <span className="eyebrow"><span aria-hidden="true">✦</span> A taste of Italy, made with love</span>
            <h1>Gather around.<br /><span>Stay for the flavour.</span></h1>
            <p className="hero-section__description">
              Handmade favourites, ingredients chosen with care, and the kind of
              comfort that makes every table feel like home.
            </p>
            <div className="hero-section__actions">
              <a className="primary-button" href="#menu">
                Explore our menu <span aria-hidden="true">↗</span>
              </a>
              <a className="hero-secondary-button" href="#story">Our story <span aria-hidden="true">↗</span></a>
            </div>
            <div className="hero-note">
              <span className="hero-note__stars" aria-label="Five stars">★★★★★</span>
              <span>Made fresh. Served with amore.</span>
            </div>
          </div>

          <div className="hero-editorial" aria-label="Italian dishes from our kitchen">
            <div className="hero-editorial__arch">
              <img className="hero-editorial__main" src={foods.find((food) => food.id === "spaghetti-carbonara")?.image ?? ""} alt="A delicious plate of spaghetti carbonara" fetchPriority="high" />
              <span className="hero-editorial__seal">BUON<br />APPETITO <span aria-hidden="true">✳</span></span>
            </div>
            <div className="hero-editorial__polaroid">
              <img src={foods.find((food) => food.id === "tiramisu")?.image ?? ""} alt="Freshly prepared tiramisu" />
              <span>A sweet little ending ♡</span>
            </div>
            <span className="hero-editorial__scribble" aria-hidden="true">✳</span>
            <span className="hero-editorial__caption">FROM OUR TABLE TO YOURS — EST. WITH AMORE</span>
          </div>
          <div className="hero-section__bottom" aria-hidden="true">
            <span>FRESH INGREDIENTS</span><span>✳</span><span>ITALIAN SOUL</span><span>✳</span><span>MADE WITH AMORE</span>
          </div>
        </section>

        <section className="bestsellers-section" aria-labelledby="bestsellers-title">
          <div className="bestsellers-heading">
            <div>
              <span className="eyebrow">Loved at first bite</span>
              <h2 id="bestsellers-title">Our <span>best-loved</span> bites</h2>
              <p>A few guest favourites we think you’re going to love, too.</p>
            </div>
            <a href="#menu" className="bestsellers-link">Explore the full menu <span aria-hidden="true">↗</span></a>
          </div>

          <div className="bestsellers-grid">
            {["spaghetti-carbonara", "margherita-pizza", "tiramisu"].map((foodId, index) => {
              const food = foods.find((item) => item.id === foodId);
              if (!food) return null;

              return (
                <article className="bestseller-card" key={food.id} style={{ animationDelay: `${index * 120}ms` }}>
                  <div className="bestseller-card__image-wrap">
                    <img src={food.image} alt={food.name} loading="lazy" />
                    <span className="bestseller-card__badge">{index === 0 ? "Guest favourite" : index === 1 ? "A timeless classic" : "A sweet ending"}</span>
                    <span className="bestseller-card__number" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <div className="bestseller-card__body">
                    <div className="bestseller-card__meta">
                      <span>★ {food.rating.toFixed(1)}</span>
                      <span>{food.category.replace("-", " ")}</span>
                    </div>
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <div className="bestseller-card__bottom">
                      <strong>{food.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong>
                      <button type="button" onClick={() => handleAddToCart(food)} aria-label={`Add ${food.name} to cart`}>
                        Add to cart <span aria-hidden="true">+</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">From our kitchen to your table</span>
              <h2>A little taste of <span>Italy</span></h2>
              <p>Find your new favourite, made fresh and full of flavour.</p>
            </div>
            <div className="menu-heading__stamp" aria-hidden="true">BUON<br />APPETITO!</div>
          </div>

          <div className="menu-tools">
            <div className="category-list" aria-label="Filter food by category">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-chip ${activeCategory === category.id ? "category-chip--active" : ""}`}
                  type="button"
                  aria-pressed={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Search dishes</span>
              <input
                type="search"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="results-line">
            <p><strong>{visibleFoods.length}</strong> delicious {visibleFoods.length === 1 ? "dish" : "dishes"} to explore</p>
            <span>All prices in USD</span>
          </div>

          <FoodGrid foods={visibleFoods} onAddToCart={handleAddToCart} />
        </section>

        <section className="story-section" id="story" aria-labelledby="story-title">
          <div className="story-section__visual" aria-hidden="true">
            <div className="story-visual__halo"></div>
            <div className="story-visual__plate"><span>Buon<br />appetito</span><span className="story-visual__leaf">✳</span></div>
            <span className="story-visual__note story-visual__note--top">Fatto con amore</span>
            <span className="story-visual__note story-visual__note--bottom">Gather • Share • Savour</span>
            <span className="story-visual__spark story-visual__spark--one">✦</span>
            <span className="story-visual__spark story-visual__spark--two">✧</span>
          </div>

          <div className="story-section__content">
            <p className="eyebrow"><span aria-hidden="true">✳</span> La dolce vita — the sweet life</p>
            <h2 id="story-title">More than a meal.<br />A place to <span>belong.</span></h2>
            <p className="story-section__lead">Italian comfort food, fresh flavours, and a warm table made for sharing.</p>
            <div className="story-values story-values--compact">
              <span>Made with care</span><span>Best shared together</span><span>Always room for one more</span>
            </div>

            <a className="story-section__cta" href="#menu">Find your favourite <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__main">
          <div className="site-footer__brand-column">
            <a className="brand brand--footer" href="#home" aria-label="Bella Tavola home">
              <span className="brand__mark" aria-hidden="true">B</span>
              <span className="brand__text"><strong>Bella Tavola</strong><small>Italian kitchen</small></span>
            </a>
            <p className="site-footer__description">
              A little taste of Italy, made with care. Gather around our table
              for comforting classics and fresh-from-the-kitchen favourites.
            </p>
            <span className="site-footer__motto"><span aria-hidden="true">✳</span> Made with amore</span>
          </div>

          <div className="site-footer__column">
            <h2>Explore</h2>
            <a href="#home">Home</a>
            <a href="#menu">Our menu</a>
            <a href="#story">Our story</a>
          </div>

          <div className="site-footer__column">
            <h2>From our kitchen</h2>
            <p>Fresh ingredients</p>
            <p>Italian-inspired favourites</p>
            <p>Something for every craving</p>
          </div>

          <div className="site-footer__column site-footer__address">
            <h2>Visit us</h2>
            <p>123 Via Roma</p>
            <p>Little Italy, New York, NY 10013</p>
            <p className="site-footer__address-note">Demo address — replace before launch</p>
          </div>

          <a href="#home" className="back-to-top" aria-label="Back to top">
            <span aria-hidden="true">↑</span> Back to top
          </a>
        </div>
        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Bella Tavola. All rights reserved.</p>
          <span>Buon appetito! <span aria-hidden="true">♥</span></span>
        </div>
      </footer>

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

export default App;
