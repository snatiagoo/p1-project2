
import Stripe from 'stripe'; // Default export
import { createPurchase } from '../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    



export async function POST(request: Request){

    if(!endpointSecret) return new Response('No signature', {status: 400});
    //Get raw request
    const req = await request.text();
    // Get the signature sent by Stripe
    const signature = request.headers.get('stripe-signature');
    if(!signature){
        return new Response('No signature', {status: 400});
    }


    try {
    const event = stripe.webhooks.constructEvent(req,signature,endpointSecret);

    switch(event.type){
        case 'checkout.session.completed': {
            //console.log("Hello_0")

            const obj = event.data.object;
            //store result in database
            const client_reference_id: string | null = obj.client_reference_id;
            const id: string | null = obj.id;
            const amount: number | null = obj.amount_total;
            // amount is !amoutn if its 0, so we directly null check it

            if(!client_reference_id || !id || amount === null || amount === undefined) return new Response("Error with event data", {status:400});

            //console.log("Hello_1")
            await createPurchase(id, client_reference_id, amount);

            break;


        }
            
        default: 
            console.log(`Unhandled event type: ${event.type}`);    
    }

    return new Response('OK', { status: 200 }); // status 200 is that stripe needs to verify it all went ok. 

  }
  catch (err) {
    console.log('constructEvent error:', err);
    return new Response(`Webhook error:  ${err}`, {status: 400});
    
  }

    

}