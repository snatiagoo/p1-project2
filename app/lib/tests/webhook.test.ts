import { vi, it, expect, beforeEach, describe } from "vitest";
import Stripe from 'stripe'; // Default export
import { createPurchase } from '../../lib/db';
import { POST } from "../../api/webhook/route";


vi.mock('../../lib/db', () => ({
    createPurchase: vi.fn()
}));






//we have to mock the exact pattern we have on route.ts inside the mock
/*

import Stripe from 'stripe';                          // (1)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);  // (2)
const event = stripe.webhooks.constructEvent(...);    // (3)

*/

vi.mock('stripe',/*(1)*/ () => {
    // we mock the presence of a constructEvent method that will appear later.
    
    const constructEvent = vi.fn();
    // constructEvent is inside stripe.webhooks, so we need to mock that chain
        // as what we get is constructEvent, we have to return that, but return it from the chain

    return {
        __esModule: true,
        // default
        default: class { /*(2)*/ 
                //"Default export" happens when we import with "import Stripe from '...'", with no {}
                //the vi.fn(() => ({})) structure simulates a   new X()  constructor, which is needed for stripe
                    // so it basically mimics a import default constructor inside stripe (like Stripe) with a webhooks with a constructEvent

            webhooks = { constructEvent }; /*(3)*/
                // stripe is an object with a webhooks property, which is a webhook object with a constructEvent method
        },
    };

})

// this is the reference to the mock constructEvent. 
// vi.mocked() allows us to treat it as a mock isntead of the real
// as it is inside .mocked, we van write it normally but new Stripe() will actaully use the mock we created as equivalent to it






const mockConstructEvent = vi.mocked(new Stripe('fake').webhooks.constructEvent);
// the vi.mock(...) has to be above, remember that, otehrwise it would create a real client

describe('Webhook POST', () => {

    beforeEach(() => vi.clearAllMocks());

    it("Saves the purchase on valid checkout.session.completed event", async () => {

        //Arrange: setup precedes the call, always. (WHEN TESTING)

        const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_123',
                    client_reference_id: 'user_abc',
                    amount_total: 1999,   
                }
            }
        } as unknown as Stripe.Event; 
        // what I was missing, it tells TS to shut up basically, useful as its only on tests


        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
        });
        // yes, you can use a normal constructor here
        // the body content and signature value don't need to be cryptographically valid — they just need to exist

        
        
        //Act
        await POST(req);


        //Assert
        expect(createPurchase).toHaveBeenCalledWith('cs_test_123', 'user_abc', 1999);

    })

    
})




describe('Testing unhappy paths', () => {

    beforeEach(() => vi.clearAllMocks());

    it("Returns 400 when missing stripe header signature and createPurchase is not called", async () => {


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
        });


        const response = await POST(req);

        expect(response.status).toBe(400);

        expect(createPurchase).not.toHaveBeenCalled();
    })


    it("Returns 400 when constructEvent throws error and createPurchase is not called", async () => {

        mockConstructEvent.mockImplementation(() => { throw new Error('bad sig') })

        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'real_fake_sig'},
        });
        
        
        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(createPurchase).not.toHaveBeenCalled();
        
    })


    it("Returns 400 when id is null and createPurchase is not called", async () => {

        const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    client_reference_id: 'user_abc',
                    amount_total: 1999,   
                }
            }
        } as unknown as Stripe.Event; 


        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(createPurchase).not.toHaveBeenCalled();





    })


    it("Createpurchase is called when amount: 0", async () => {
        
        const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_123',
                    client_reference_id: 'user_abc',
                    amount_total: 0,   
                }
            }
        } as unknown as Stripe.Event; 

        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
        });

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(createPurchase).toHaveBeenCalled();





    })


    it("Returns 400 when client_reference_id is null and createPurchase is not called", async () => {
        
        const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_123',
                    amount_total: 1999,   
                }
            }
        } as unknown as Stripe.Event; 

        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(createPurchase).not.toHaveBeenCalled();





    })


    it("Returns 400 when amount_total is null (===null) and createPurchase is not called", async () => {
        

               const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_123',
                    client_reference_id: 'user_abc',
                    amount_total: null
                }
            }
        } as unknown as Stripe.Event; 

        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
            
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(createPurchase).not.toHaveBeenCalled();




    })


    it("Returns 400 when amount_total is undefined (===undefined) and createPurchase is not called", async () => {
        

            const fakeEvent = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    id: 'cs_test_123',
                    client_reference_id: 'user_abc',
                }
            }
        } as unknown as Stripe.Event; 

        mockConstructEvent.mockReturnValue(fakeEvent);


        const req = new Request('http://localhost/api/webhook', {
            method: 'POST',
            body: 'irrelevant_body',
            headers: { 'stripe-signature' : 'fake_sig'},
            
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(createPurchase).not.toHaveBeenCalled();




    })


})