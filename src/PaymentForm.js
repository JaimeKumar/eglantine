import React, { useState } from 'react'
import { PaymentElement, AddressElement, useElements, useStripe } from '@stripe/react-stripe-js'

const payment_options = {
  layout: "tabs"
}

export default function PaymentForm({cartOk, conf, paymentConfirmed}) {
  const [pending, setPending] = useState(false)  
  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState('')
  const stripe = useStripe()
  const elements = useElements();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true)
    
    const {error} = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    })

    if (error) {
      setErr(error.message)
      setSuccess(false)
    } else {
      setSuccess(true)
      paymentConfirmed();
    }
    setPending(false)
  }

    return (
    <>
      {!success ?
        <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
                <div className="FormRow">
                    <span id='error' style={{color: 'red'}}>{err}</span>
                    <PaymentElement options={payment_options} />
                </div>
            </fieldset>
            <fieldset className="FormGroup">
              <div className="FormRow">
                <AddressElement 
                  options={{
                    mode: 'shipping',
                    autocomplete: {
                      mode: "google_maps_api",
                      apiKey: "AIzaSyDS5VkMQi0b1EwIjf5lr15cvm-cc-XepD4",
                    },
                  }}
                />
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
            <button onClick={() => {window.location.reload()}}>Continue shopping</button>
        </div>
      }
    </>
  )
}
