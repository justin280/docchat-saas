import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  pro: {
    name: 'Pro',
    price: 1900, // $19.00
    interval: 'month',
    description: 'Unlimited documents & questions',
  },
  business: {
    name: 'Business',
    price: 4900, // $49.00
    interval: 'month',
    description: 'API access + priority support',
  },
};

export async function POST(req) {
  try {
    const { plan } = await req.json();
    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `DocChat AI ${selectedPlan.name}`,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.price,
            recurring: { interval: selectedPlan.interval },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}&subscribed=true`,
      cancel_url: `${baseUrl}/?cancelled=true`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}