import { useMemo, useState } from "react";
import FoodGrid from "./components/food/FoodGrid";
import { categories } from "./data/categories";
import { foods } from "./data/foods";
import type { Food, FoodCategory } from "./types/food";
import "./App.css";

type CartItem = { food: Food; quantity: number };

function App() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.food.price * item.quantity, 0);

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

        <button className="cart-button" type="button" aria-label={`Cart, ${cartCount} items`} aria-expanded={isCartOpen} onClick={() => setIsCartOpen(true)}>
          <span aria-hidden="true">🛍</span>
          <span className="cart-button__label">Cart</span>
          <span className="cart-button__count">{cartCount}</span>
        </button>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-section__content">
            <span className="eyebrow"><span aria-hidden="true">✦</span> A taste of Italy, made with love</span>
            <h1>Good food.<br /><span>Good mood.</span></h1>
            <p className="hero-section__description">
              Gather around the table for Italian favourites, fresh ingredients,
              and little moments worth savouring.
            </p>
            <a className="primary-button" href="#menu">
              Explore our menu <span aria-hidden="true">↗</span>
            </a>
            <div className="hero-note">
              <span className="hero-note__stars" aria-label="Five stars">★★★★★</span>
              <span>Made fresh. Served with amore.</span>
            </div>
          </div>

          <div className="hero-section__art" aria-label="Italian food illustration">
            <div className="hero-sun" />
            <div className="hero-circle hero-circle--outer" />
            <div className="hero-circle hero-circle--inner" />
            <div className="hero-food-emoji" aria-hidden="true">🍕</div>
            <span className="floating-tag floating-tag--top">Freshly made</span>
            <span className="floating-tag floating-tag--bottom">Made with amore ♥</span>
            <span className="hero-leaf hero-leaf--one" aria-hidden="true">✳</span>
            <span className="hero-leaf hero-leaf--two" aria-hidden="true">✦</span>
          </div>
          <div className="hero-section__bottom" aria-hidden="true">
            <span>FRESH INGREDIENTS</span><span>✳</span><span>ITALIAN SOUL</span><span>✳</span><span>MADE WITH AMORE</span>
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

        <section className="story-section" id="story">
          <span className="story-section__ornament" aria-hidden="true">✳</span>
          <p className="eyebrow">La dolce vita</p>
          <h2>Every meal tells<br />a <span>little story.</span></h2>
          <p>Simple ingredients, comforting classics, and a seat at the table for everyone.</p>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#home">
          <span className="brand__mark" aria-hidden="true">B</span>
          <span className="brand__text"><strong>Bella Tavola</strong><small>Italian kitchen</small></span>
        </a>
        <p>Made with amore. © {new Date().getFullYear()} Bella Tavola.</p>
        <a href="#home" className="back-to-top">Back to top ↑</a>
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
                onClick={() => setIsCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
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
                      setNotice("Checkout is the next step we’ll build together!");
                      window.setTimeout(() => setNotice(""), 2500);
                    }}
                  >
                    Continue to checkout <span aria-hidden="true">→</span>
                  </button>
                  <button className="cart-continue" type="button" onClick={() => setIsCartOpen(false)}>
                    Continue browsing
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;
