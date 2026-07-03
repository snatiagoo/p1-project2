'use server';

import Stripe from "stripe";
import { redirect } from 'next/navigation';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);




export async function createCheckoutSession() {
  const session = await stripe.checkout.sessions.create({
    line_items: [
        {
            price: 'price_1Tp9bHCI9WQ9dC77y5R3vNQc',
            quantity: 1
        }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_URL}/checkout/cancelled`,
  });
  
  redirect(session.url!);
}

