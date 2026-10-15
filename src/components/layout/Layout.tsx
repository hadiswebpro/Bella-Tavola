import type {ReactNode} from "react";
import Header from "./Header";
import Footer from "./Footer";
type Props={children:ReactNode;cartCount:number;isMiniCartOpen:boolean;onCartClick:()=>void};
export default function Layout({children,cartCount,isMiniCartOpen,onCartClick}:Props){return (<><Header cartCount={cartCount} isMiniCartOpen={isMiniCartOpen} onCartClick={onCartClick}/>{children}<Footer/></>);}
