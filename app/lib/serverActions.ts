'use server';

import Stripe from "stripe";
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



export async function createCheckoutSession() {

  const user = await currentUser();
  const userId = user?.id;
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? undefined;
  
  const session = await stripe.checkout.sessions.create({
    line_items: [
        {
            price: 'price_1Tp9bHCI9WQ9dC77y5R3vNQc',
            quantity: 1,
        }
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_URL}/checkout/cancelled`,
    client_reference_id: userId!,
    customer_email: userEmail,
  });
  
  redirect(session.url!);
}



