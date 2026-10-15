import "./Footer.css";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand-column">
          <a
            className="brand brand--footer"
            href="#home"
            aria-label="Bella Tavola home"
          >
            <span className="brand__mark" aria-hidden="true">
              B
            </span>
            <span className="brand__text">
              <strong>Bella Tavola</strong>
              <small>Italian kitchen</small>
            </span>
          </a>
          <p className="site-footer__description">
            A little taste of Italy, made with care. Gather around our table for
            comforting classics and fresh-from-the-kitchen favourites.
          </p>
          <span className="site-footer__motto">
            <span aria-hidden="true">✳</span> Made with amore
          </span>
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
          <p className="site-footer__address-note">
            Demo address — replace before launch
          </p>
        </div>

        <a href="#home" className="back-to-top" aria-label="Back to top">
          <span aria-hidden="true">↑</span> Back to top
        </a>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Bella Tavola. All rights reserved.</p>
        <span>
          Buon appetito! <span aria-hidden="true">♥</span>
        </span>
      </div>
    </footer>
  );
}
