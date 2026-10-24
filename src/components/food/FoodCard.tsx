import type { Food } from "../../types/food";
import "./FoodCard.css";

interface FoodCardProps {
  food: Food;
  onAddToCart: (food: Food) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function FoodCard({ food, onAddToCart }: FoodCardProps) {
  const discountedPrice =
    food.discountPercentage !== undefined
      ? food.price * (1 - food.discountPercentage / 100)
      : food.price;

  return (
    <article className="food-card">
      <div className="food-card__image-wrapper">
        <img
          className="food-card__image"
          src={food.image}
          alt={food.name}
          loading="lazy"
        />

        {food.discountPercentage !== undefined && (
          <span className="food-card__discount">
            -{food.discountPercentage}%
          </span>
        )}

        {food.isVegetarian && (
          <span className="food-card__diet-label">Vegetarian</span>
        )}

        {!food.isAvailable && (
          <div className="food-card__unavailable" role="status">
            Currently unavailable
          </div>
        )}
      </div>

      <div className="food-card__content">
        <div className="food-card__meta">
          <span className="food-card__category">
            {food.category.replace("-", " ")}
          </span>
          <span
            className="food-card__rating"
            aria-label={`Rated ${food.rating} out of 5`}
          >
            <span aria-hidden="true">★</span> {food.rating.toFixed(1)}
            <span className="food-card__review-count">
              ({food.reviewCount})
            </span>
          </span>
        </div>

        <h3 className="food-card__title">{food.name}</h3>
        <p className="food-card__description">{food.description}</p>

        <div className="food-card__footer">
          <div className="food-card__prices">
            {food.discountPercentage !== undefined && (
              <span className="food-card__original-price">
                {priceFormatter.format(food.price)}
              </span>
            )}
            <span className="food-card__price">
              {priceFormatter.format(discountedPrice)}
            </span>
          </div>

          <button
            className="food-card__add-button"
            type="button"
            onClick={() => onAddToCart(food)}
            disabled={!food.isAvailable}
          >
            {food.isAvailable ? "Add to cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
