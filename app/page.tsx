import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home(){
    const { userId: userId} = await auth();
    if(userId) redirect('/store');

    return(

        <main>
            <div className = "pt-50">
                <h1 className =" flex justify-center items-center font-extrabold text-orange-500 text-2xl pb-5">Log in to get your Miraculous Book</h1>
                <h2 className =" flex justify-center items-center font-extrabold text-black">Get all your answers...</h2>
                <div className = "flex flex-row items-center justify-center gap-5 pt-5">
                    <SignInButton>
                        <button className="bg-[#cf4c00] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign In
                        </button>
                    </SignInButton>

                    <SignUpButton>
                        <button className="bg-[#f78442] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </div>
                
            </div>
            
        </main>
    );
}