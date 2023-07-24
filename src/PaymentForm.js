import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
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

export default function PaymentForm( {amount}) {  
  const [success, setSuccess] = useState(false)
  const stripe = useStripe()
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)
    })

    if (!error) {
        try {
            const {id} = paymentMethod
            const res = await axios.post('https://eglantine-server.onrender.com/payment', {
                amount: Math.round(amount * 100),
                id: id
            })
    
            if (res.data.success) {
                console.log('Success');
                setSuccess(true)
            }
    
        } catch (error) {
            console.log('error: ' + error)
        }
      } else {
        console.log(error.message)
      }
  }

    return (
    <>
      {!success ?
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className="FormRow">
                    <CardElement options={CARD_OPTIONS} />
                </div>
            </fieldset>
            <button>Pay</button>
        </form>
        :
        <div>
            <h2>You just bought it</h2>
        </div>
      }
    </>
  )
}
