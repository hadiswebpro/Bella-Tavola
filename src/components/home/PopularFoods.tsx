import { foods } from "../../data/foods";
import type { Food } from "../../types/food";
type Props = { onAddToCart: (food: Food) => void };
export default function PopularFoods({ onAddToCart }: Props) {
  return (
    <section
      className="bestsellers-section"
      aria-labelledby="bestsellers-title"
    >
      <div className="bestsellers-heading">
        <div>
          <span className="eyebrow">Loved at first bite</span>
          <h2 id="bestsellers-title">
            Our <span>best-loved</span> bites
          </h2>
          <p>A few guest favourites we think you’re going to love, too.</p>
        </div>
        <a href="#menu" className="bestsellers-link">
          Explore the full menu <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="bestsellers-grid">
        {["spaghetti-carbonara", "margherita-pizza", "tiramisu"].map(
          (foodId, index) => {
            const food = foods.find((item) => item.id === foodId);
            if (!food) return null;

            return (
              <article
                className="bestseller-card"
                key={food.id}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="bestseller-card__image-wrap">
                  <img src={food.image} alt={food.name} loading="lazy" />
                  <span className="bestseller-card__badge">
                    {index === 0
                      ? "Guest favourite"
                      : index === 1
                        ? "A timeless classic"
                        : "A sweet ending"}
                  </span>
                  <span className="bestseller-card__number" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <div className="bestseller-card__body">
                  <div className="bestseller-card__meta">
                    <span>★ {food.rating.toFixed(1)}</span>
                    <span>{food.category.replace("-", " ")}</span>
                  </div>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <div className="bestseller-card__bottom">
                    <strong>
                      {food.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </strong>
                    <button
                      type="button"
                      onClick={() => onAddToCart(food)}
                      aria-label={`Add ${food.name} to cart`}
                    >
                      Add to cart <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}
