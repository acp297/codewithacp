'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Smartphone, Globe, Lock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  currency?: string
  courseId?: string
  planId?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentForm({ 
  amount, 
  currency = 'USD', 
  courseId, 
  planId, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'googlepay' | 'upi'>('card')
  const [isLoading, setIsLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: currency.toLowerCase(),
          courseId,
          planId,
          paymentMethod,
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      if (!clientSecret) {
        throw new Error('Failed to create payment intent')
      }

      // Handle different payment methods
      switch (paymentMethod) {
        case 'card':
          await handleCardPayment(stripe, clientSecret)
          break
        case 'googlepay':
          await handleGooglePayPayment(stripe, clientSecret)
          break
        case 'upi':
          await handleUPIPayment(clientSecret)
          break
      }

      onSuccess?.()
    } catch (error) {
      console.error('Payment error:', error)
      onError?.(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardPayment = async (stripe: any, clientSecret: string) => {
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          number: cardDetails.number,
          exp_month: parseInt(cardDetails.expiry.split('/')[0]),
          exp_year: parseInt('20' + cardDetails.expiry.split('/')[1]),
          cvc: cardDetails.cvc,
        },
        billing_details: {
          name: cardDetails.name,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const handleGooglePayPayment = async (stripe: any, clientSecret: string) => {
    const { error } = await stripe.confirmGooglePayPayment(clientSecret, {
      payment_method: {
        google_pay: {
          test: process.env.NODE_ENV === 'development',
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const handleUPIPayment = async (clientSecret: string) => {
    // For UPI, you would typically redirect to a UPI payment gateway
    // This is a simplified implementation
    const upiUrl = `upi://pay?pa=${process.env.NEXT_PUBLIC_UPI_MERCHANT_ID}&pn=CodeWithACP&am=${amount}&cu=INR&tn=Course Payment`
    window.open(upiUrl, '_blank')
    
    // In a real implementation, you would handle the UPI callback
    // and update the payment status accordingly
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h3 className="font-medium">Payment Method</h3>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Card</span>
            </Button>
            <Button
              variant={paymentMethod === 'googlepay' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('googlepay')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">Google Pay</span>
            </Button>
            <Button
              variant={paymentMethod === 'upi' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('upi')}
              className="flex flex-col items-center gap-2 h-auto py-3"
            >
              <Globe className="h-5 w-5" />
              <span className="text-xs">UPI</span>
            </Button>
          </div>
        </div>

        {/* Card Details Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="input-field"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="input-field"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  className="input-field"
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-medium">{formatPrice(amount, currency)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Processing Fee:</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(amount, currency)}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Processing...' : `Pay ${formatPrice(amount, currency)}`}
        </Button>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          <Lock className="h-3 w-3 inline mr-1" />
          Your payment is secured by Stripe
        </div>
      </CardContent>
    </Card>
  )
}
