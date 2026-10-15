import "./Header.css";
type Props = {
  cartCount: number;
  isMiniCartOpen: boolean;
  onCartClick: () => void;
};
export default function Header({
  cartCount,
  isMiniCartOpen,
  onCartClick,
}: Props) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Bella Tavola home">
        <span className="brand__mark" aria-hidden="true">
          B
        </span>
        <span className="brand__text">
          <strong>Bella Tavola</strong>
          <small>Italian kitchen</small>
        </span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a className="main-nav__link main-nav__link--active" href="#home">
          Home
        </a>
        <a className="main-nav__link" href="#menu">
          Our Menu
        </a>
        <a className="main-nav__link" href="#story">
          Our Story
        </a>
      </nav>

      <button
        className="cart-button"
        type="button"
        aria-label={`Cart, ${cartCount} items`}
        onClick={onCartClick}
        aria-controls="mini-cart"
        aria-expanded={isMiniCartOpen}
      >
        <span aria-hidden="true">🛍</span>
        <span className="cart-button__label">Cart</span>
        <span className="cart-button__count">{cartCount}</span>
      </button>
    </header>
  );
}
