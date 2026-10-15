import Hero from "../components/home/Hero";
import PopularFoods from "../components/home/PopularFoods";
import CategorySection from "../components/home/CategorySection";
import TopRatedFoods from "../components/home/TopRatedFoods";
import type {Food,FoodCategory} from "../types/food";
type Props={activeCategory:FoodCategory|"all";onCategoryChange:(v:FoodCategory|"all")=>void;searchQuery:string;onSearchChange:(v:string)=>void;visibleFoods:Food[];onAddToCart:(food:Food)=>void};
export default function HomePage(props:Props){return (<main><Hero/><PopularFoods onAddToCart={props.onAddToCart}/><CategorySection {...props}/><TopRatedFoods/></main>);}
