export type FoodCategory =
  | "pizza"
  | "pasta"
  | "antipasti"
  | "salad"
  | "main-course"
  | "dessert"
  | "drinks";

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Path relative to public, e.g. /images/foods/tiramisu.jpg */
  image: string;
  category: FoodCategory;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  discountPercentage?: number;
  isVegetarian?: boolean;
}
