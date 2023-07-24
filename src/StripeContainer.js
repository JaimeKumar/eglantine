import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'
import React from 'react'

const PUBLIC_KEY = 'pk_test_51NSlb4DZ20h9sE1Ta3mQ7tG1FBUQY2WbnB8yStWhvAX6Ffbep76Xivm2Dk6dyiEaizQ75Pwa0Kx2rj8SiYcSw3na00RWwoWLEY'
const stripePromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer({ amount }) {
  return (
    <Elements stripe={stripePromise}>
        <PaymentForm amount={amount} />
    </Elements>
  )
}
