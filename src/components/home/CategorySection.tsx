import FoodGrid from "../food/FoodGrid";
import FoodFilters from "../food/FoodFilters";
import FoodSearch from "../food/FoodSearch";
import type {Food,FoodCategory} from "../../types/food";
type Props={activeCategory:FoodCategory|"all";onCategoryChange:(v:FoodCategory|"all")=>void;searchQuery:string;onSearchChange:(v:string)=>void;visibleFoods:Food[];onAddToCart:(food:Food)=>void};
export default function CategorySection({activeCategory,onCategoryChange,searchQuery,onSearchChange,visibleFoods,onAddToCart}:Props){return (<section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">From our kitchen to your table</span>
              <h2>A little taste of <span>Italy</span></h2>
              <p>Find your new favourite, made fresh and full of flavour.</p>
            </div>
            <div className="menu-heading__stamp" aria-hidden="true">BUON<br />APPETITO!</div>
          </div>

          <div className="menu-tools">
            <FoodFilters activeCategory={activeCategory} onCategoryChange={onCategoryChange}/>
<FoodSearch searchQuery={searchQuery} onSearchChange={onSearchChange}/>
          </div>

          <div className="results-line">
            <p><strong>{visibleFoods.length}</strong> delicious {visibleFoods.length === 1 ? "dish" : "dishes"} to explore</p>
            <span>All prices in USD</span>
          </div>

          <FoodGrid foods={visibleFoods} onAddToCart={onAddToCart} />
        </section>);}
