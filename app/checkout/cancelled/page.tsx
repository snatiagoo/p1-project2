import Link from "next/link";


export default function Cancelled(){
    return(

        <div className = "pt-50 flex flex-col justify-center items-center gap-5">
            <h1 className =" font-extrabold text-orange-500 text-2xl pb-5">Checkout Cancelled</h1>
            <Link className = "bg-black text-white items-center justify-center text-center font-semibold p-5 rounded-2xl " href = {`${process.env.NEXT_URL}/store`}>Go back to Store</Link>
        </div>
    )
}