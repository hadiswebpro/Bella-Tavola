import type { Food } from "../../types/food";
import FoodCard from "./FoodCard";
import "./FoodGrid.css";

interface FoodGridProps {
  foods: Food[];
  onAddToCart: (food: Food) => void;
}

function FoodGrid({ foods, onAddToCart }: FoodGridProps) {
  if (foods.length === 0) {
    return (
      <div className="food-grid__empty" role="status">
        <span aria-hidden="true">🍝</span>
        <h3>No dishes found</h3>
        <p>Try another search or choose a different category.</p>
      </div>
    );
  }

  return (
    <div className="food-grid">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default FoodGrid;
