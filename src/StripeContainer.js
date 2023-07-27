import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PUBLIC_KEY = 'pk_test_51NSlb4DZ20h9sE1Ta3mQ7tG1FBUQY2WbnB8yStWhvAX6Ffbep76Xivm2Dk6dyiEaizQ75Pwa0Kx2rj8SiYcSw3na00RWwoWLEY'
const stripePromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer({ amount, cartOk, items }) {

  const [clientSecret, setClientSecret] = useState(null)
  const [confirmation, setConf] = useState(null);
  const [success, setSuccess] = useState(false);

  async function getSecret() {
    if (amount > 1 && !success) {
      try {
        const res = await axios.post('http://localhost:4000/createIntent', {
        // const res = await axios.post('https://eglantine-server.onrender.com/createIntent', {
          amount: Math.round(amount * 100),
          items: items
        })
        console.log(res);
        setConf(res.data.confirmation)
        setClientSecret(res.data.clientSecret)
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getSecret();
  }, [])

  return (
    (clientSecret) ? 
    <Elements options={{clientSecret: clientSecret}} stripe={stripePromise}>
        <PaymentForm conf={confirmation} cart={items} amount={amount} paymentConfirmed={() => {setSuccess(true)}} />
    </Elements>
   : 'Loading payment form, please be patient...'
  )
}
