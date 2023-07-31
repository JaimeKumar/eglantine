import React, { useEffect } from 'react'
import { useState } from 'react';
import $ from 'jquery';

export default function Item({ item, catalog, buy }) {
    const [pos, setPos] = useState(0)
    const [prev, setPrev] = useState(0)
    const [size, setSize] = useState(null)

    if(!item)return;

    let x = catalog.find(x => x.id === item);

    function selectSize(e) {
        ['XS', 'S', 'M', 'L', 'XL'].forEach(e => {
            $(`#${e}`).removeClass('selected')
        })
        $(`#${e.target.id}`).addClass('selected');
        setSize(e.target.id)
    }

    let fit = '';
    if (x.hasOwnProperty('fit')) {
        fit = <div style={{display: 'block', textAlign: 'right'}}>
                    <h4>FIT</h4>
                    <p>{x.fit.slice(0, 1).toUpperCase() + x.fit.slice(1)}</p>
                </div>
    }

    let price = <h4>£{x.price}</h4>;
    if (x.hasOwnProperty('sale')) {
        price = <div style={{display: 'block'}}>
            <div style={{display: 'inline-flex', columnGap: '10px'}}> 
                <h4 style={{color: '#777'}}><s>£{Math.round(100 * (x.price + x.sale)) / 100}</s></h4>
                <h4>£{x.price}</h4>
            </div>
            <p style={{fontSize: 'clamp(10px, 0.6vw, 1rem)', letterSpacing: '3px', color: '#777'}}>{Math.round((x.sale/(x.price + x.sale)) * 100)}% OFF</p>
        </div>
    }

  return (
    <div className='itemPage'>
        
        <div className="itemGallery">
            <img src={x.img[pos]} alt={`image of ${x.title}`} className="galleryMain" />
            <div className="galleryCol">
                {x.img.map((img, i) => {
                    return <img src={img} alt={`image of ${x.title}`} className="gallerySide" onMouseEnter={() => {setPos(i)}} onMouseLeave={() => {setPos(prev)}} onClick={() => {setPrev(i); setPos(i)}} />
                })}
            </div>
        </div>
        
      <div className="itemText">
        <h3>{x.title}</h3>
        <br />
        <p>{x.text}</p>
        <br />
        {price}
        <hr />
        <br />
        <h4>SIZE</h4>
        <br />
        <div className="sizes">
            <p id='XS' onClick={selectSize}>XS</p>
            <p id='S' onClick={selectSize}>S</p>
            <p id='M' onClick={selectSize}>M</p>
            <p id='L' onClick={selectSize}>L</p>
            <p id='XL' onClick={selectSize}>XL</p>
        </div>
        <div className="buyButton" onClick={() => {buy(item, size)}}>
            ADD TO BASKET
        </div>
        <hr />
        <br />
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'block'}}>
                <h4>MATERIALS</h4>
                {Object.keys(x.material).map(material => {
                    return <p>{`${material.slice(0, 1).toUpperCase() + material.slice(1)}: ${x.material[material]}%`}</p>
                })}
            </div>
            {fit}
        </div>
        <br />
        <hr />
        </div>
        
     
    </div>
  )
}
