import type {CartItem} from "../../hooks/useCart";
import "./MiniCart.css";
type Props={cartItems:CartItem[];cartCount:number;cartSubtotal:number;changeQuantity:(id:string,amount:number)=>void;onClose:()=>void;onOpenCart:()=>void};
export default function MiniCart({cartItems,cartCount,cartSubtotal,changeQuantity,onClose,onOpenCart}:Props){return (
        <div className="mini-cart" id="mini-cart" role="region" aria-label="Quick basket preview">
          <div className="mini-cart__heading">
            <div><span className="eyebrow">Something delicious</span><h2>Your basket ({cartCount})</h2></div>
            <button className="mini-cart__close" type="button" aria-label="Close basket preview" onClick={() => onClose()}>×</button>
          </div>
          {cartItems.length === 0 ? (
            <div className="mini-cart__empty"><p>Your basket is waiting for something delicious.</p><button type="button" onClick={() => onClose()}>Explore the menu</button></div>
          ) : (
            <>
              <div className="mini-cart__items">
                {cartItems.slice(0, 3).map(({ food, quantity }) => (
                  <div className="mini-cart__item" key={food.id}>
                    <img src={food.image} alt="" />
                    <div className="mini-cart__item-info"><strong>{food.name}</strong><small>Qty {quantity} · {(food.price * quantity).toLocaleString("en-US", { style: "currency", currency: "USD" })}</small></div>
                    <div className="mini-cart__quantity">
                      <button type="button" aria-label={"Remove one " + food.name} onClick={() => changeQuantity(food.id, -1)}>−</button>
                      <span>{quantity}</span>
                      <button type="button" aria-label={"Add one " + food.name} onClick={() => changeQuantity(food.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && <p className="mini-cart__more">And {cartItems.length - 3} more items…</p>}
              </div>
              <div className="mini-cart__subtotal"><span>Subtotal</span><strong>{cartSubtotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}</strong></div>
              <button className="mini-cart__view-button" type="button" onClick={() => { onClose(); onOpenCart(); }}>View full basket <span aria-hidden="true">↗</span></button>
            </>
          )}
        </div>
      );}
