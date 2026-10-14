import type { FoodCategory } from "../types/food";

export interface FoodCategoryInfo {
  id: FoodCategory | "all";
  name: string;
  description: string;
}

export const categories: FoodCategoryInfo[] = [
  { id: "all", name: "All", description: "Explore the full Bella Tavola menu." },
  { id: "pizza", name: "Pizza", description: "Italian classics baked to perfection." },
  { id: "pasta", name: "Pasta", description: "Comforting pasta made the Italian way." },
  { id: "antipasti", name: "Antipasti", description: "Small plates and traditional starters." },
  { id: "salad", name: "Insalate", description: "Fresh, simple Italian salads." },
  { id: "main-course", name: "Main Courses", description: "Traditional Italian dishes for a hearty meal." },
  { id: "dessert", name: "Dolci", description: "A sweet finish to your Italian meal." },
  { id: "drinks", name: "Bevande", description: "Refreshing drinks to pair with your food." },
];
