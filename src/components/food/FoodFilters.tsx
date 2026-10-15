import { categories } from "../../data/categories";
import type { FoodCategory } from "../../types/food";
import "./FoodFilters.css";
type Props = {
  activeCategory: FoodCategory | "all";
  onCategoryChange: (v: FoodCategory | "all") => void;
};
export default function FoodFilters({
  activeCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="category-list" aria-label="Filter food by category">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-chip ${activeCategory === category.id ? "category-chip--active" : ""}`}
          type="button"
          aria-pressed={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
