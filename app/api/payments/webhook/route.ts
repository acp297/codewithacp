import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        await handlePaymentSuccess(paymentIntent)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        await handlePaymentFailure(failedPayment)
        break

      case 'checkout.session.completed':
        const session = event.data.object
        await handleCheckoutComplete(session)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  // Update payment status in database
  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: 'COMPLETED' },
  })
}

async function handlePaymentFailure(paymentIntent: any) {
  // Update payment status in database
  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: 'FAILED' },
  })
}

async function handleCheckoutComplete(session: any) {
  // Handle successful checkout completion
  // This could involve creating enrollments, subscriptions, etc.
  console.log('Checkout completed:', session.id)
}
