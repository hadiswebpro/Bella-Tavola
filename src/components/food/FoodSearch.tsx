type Props={searchQuery:string;onSearchChange:(v:string)=>void};
export default function FoodSearch({searchQuery,onSearchChange}:Props){return (<label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search dishes</span><input type="search" placeholder="Search dishes..." value={searchQuery} onChange={event=>onSearchChange(event.target.value)}/></label>);}
