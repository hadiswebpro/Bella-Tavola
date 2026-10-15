import {foods} from "../../data/foods";
export default function Hero(){return (<section className="hero-section" id="home">
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
        </section>);}
