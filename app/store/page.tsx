import BuyButton from "@/app/ui/buyButton";
import product_img from "@/app/ui/images/product.png";
import Image from "next/image";
import { price } from "@/app/lib/actions";
import { createCheckoutSession } from "../lib/serverActions";


export default function Store(){
  return(
    <main className = "pt-20">
      <h1 className = "flex justify-center m-5 text-black font-extrabold text-3xl"> Miraculous book V 3.0</h1>
      <div className = "flex-col flex justify-center items-center gap-3.5">
        
        <Image src={product_img} alt="Product Image" width={200} className="rounded-2xl"/>

        <div className = "flex flex-row items-center gap-5">
          <BuyButton />
          <div className = "text-black text-lg font-semibold">{price.toFixed(2) + " €"}</div> 
        </div>
        
      </div>
        
    </main>
  );
}
