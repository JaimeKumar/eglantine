import React from 'react'
import cart from './cart.png'

export default function ShopItem({ item, itemClicked, addToCart }) {

  let priceChunk = <p>£{item.price}</p>;
  if (item.hasOwnProperty('sale')) {
    priceChunk = <p><s>£{Math.round(100 * (item.price + item.sale)) / 100}</s>&nbsp;&nbsp;£{item.price}</p>;
  }
  
  return (
    <div className='shopItem'>
      <div className="shopWindow" onClick={() => {itemClicked(item.id)}}>
        <div className="shopImgs">
          <img src={item.img[0]} alt={item.title} />
          <img src={item.img[2]} alt={item.title} />
        </div>
      </div>
      <div className="shopText">
        <h2>{item.title}</h2>
        {priceChunk}
      </div>
      <div className="quickBasket" onClick={() => {addToCart(item.id, null)}}>
        <img src={cart} alt="add to cart" />
      </div>
    </div>
  )
}
