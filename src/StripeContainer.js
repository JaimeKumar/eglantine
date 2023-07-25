import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const PUBLIC_KEY = 'pk_test_51NSlb4DZ20h9sE1Ta3mQ7tG1FBUQY2WbnB8yStWhvAX6Ffbep76Xivm2Dk6dyiEaizQ75Pwa0Kx2rj8SiYcSw3na00RWwoWLEY'
const stripePromise = loadStripe(PUBLIC_KEY);
const [clientSecret, setClientSecret] = useState(null) 

useEffect( async () => {
  try {
    const res = await axios.post('https://eglantine-server.onrender.com/getSecret', {
      amount: amount,
      conf: conf
    })
    console.log(res);
    setClientSecret(res.data.clientSecret)
  } catch (err) {
    console.log(err)
  }
}, [])

export default function StripeContainer({ amount, conf, cartOk }) {
  {clientSecret && (
    <Elements stripe={stripePromise}>
        <PaymentForm amount={amount} conf={conf} cartOk={cartOk} />
    </Elements>
  )}
}
