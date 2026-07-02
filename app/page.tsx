import BuyButton from "./ui/buyButton";
import product_img from "./ui/images/product.png";
import Image from "next/image";
import { getPrice } from "./lib/actions";

export default function Home() {
  const price = getPrice();
  return(
    <main className = "pt-20">
      <h1 className = "flex justify-center m-5 text-black font-extrabold text-3xl"> Miraculous book V 3.0</h1>
      <div className = "flex-col flex justify-center items-center gap-3.5">
        
        <Image src={product_img} alt="Product Image" width={200} className="rounded-2xl"/>

        <div className = "flex flex-row items-center gap-5">
          <BuyButton />
          <text className = "text-black text-lg font-semibold">{price.toFixed(2) + " €"}</text> 
        </div>
        
      </div>
        
    </main>
  );
}
