import React, { useState } from 'react'
import { CardElement, ExpressCheckoutElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
        iconColor: '#c4f0ff',
        color: '#555',
        fontWeight: '400',
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '15px',
        fontSmoothing: 'antialiased',
        },
        invalid: {
        iconColor: '#c82525',
        color: '#555',
        },
    },
};

const payment_options = {
  layout: "tabs"
}




export default function PaymentForm({amount, conf, cartOk}) {
  const [pending, setPending] = useState(false)  
  const [success, setSuccess] = useState(false)
  const stripe = useStripe()
  const elements = useElements();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;
    setPending(true)
    if (!cartOk()) return;
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })
    
    if (!error) {
        try {
            const {id} = paymentMethod
            const res = await axios.post('https://eglantine-server.onrender.com/payment', {
                amount: Math.round(amount * 100),
                id: id,
                conf: conf
            })
    
            if (res.data.success) {
                setSuccess(true)
                setPending(false)
              }
              
            } catch (error) {
            setPending(false)
            console.log('error: ' + error)
          }
        } else {
        setPending(false)
        console.log(error.message)
      }
  }

    return (
    <>
      {!success ?
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className="FormRow">
                    {/* <CardElement options={CARD_OPTIONS} /> */}
                    <PaymentElement options={payment_options} />
                </div>
            </fieldset>
            <button disabled={pending || !stripe || !elements} id='payButton'>
              {pending? <div className="loadAnimation"></div> : "Pay" }
            </button>
        </form>
        :
        <div>
            <h2>Thank you for your purchase!</h2>
            <p>Your confirmation number is {conf}</p>
        </div>
      }
    </>
  )
}
