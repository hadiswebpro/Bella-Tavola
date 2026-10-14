import { useMemo, useState } from "react";
import FoodGrid from "./components/food/FoodGrid";
import { categories } from "./data/categories";
import { foods } from "./data/foods";
import type { Food, FoodCategory } from "./types/food";
import "./App.css";

function App() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState("");

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
    setCartCount((count) => count + 1);
    setNotice(`${food.name} added to your cart`);
    window.setTimeout(() => setNotice(""), 2500);
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

        <button className="cart-button" type="button" aria-label={`Cart, ${cartCount} items`}>
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

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;
