import './App.css';
import { v4 as uuid } from 'uuid';
import { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

import catalogRaw from './catalog.json'
import FilterControl from './FilterControl';
import ShopItem from './ShopItem';
import Item from './Item';
import StripeContainer from './StripeContainer';

import logoTextBlack from './logoWM.png'
import logoHeadBlack from './logoWMHeadBlack.png'
import navcart from './nav-cart.png'

import logoText from './logoWMwhite.png'
import logoHead from './logoWMHeadWhite.png'
import navcartWhite from './nav-cart-white.png'

const catalog = catalogRaw.map(item => {
  item.id = uuid();
  return item;
})

function App() {

  const logoTextArray = [logoText, logoTextBlack];
  const logoHeadArray = [logoHead, logoHeadBlack];
  const navcartArray = [navcart, navcartWhite]
  const [logoPos, setLogo] = useState(0);
  var slideTimer;

  const [selectedCat, setCat] = useState('sale')
  
  const homeSlides = [
    {
      title: [],
      banner: [{main: 'SUMMER SALE', lil: 'UP TO 40% OFF'}],
      text: [],
      links: [
        {txt: 'SHOP SALE', func: () => {setCat('sale'); link(1)}},
        {txt: 'SHOP MEN', func: () => {setCat('men'); link(1)}},
        {txt: 'SHOP WOMEN', func: () => {setCat('women'); link(1)}},
      ],
      img: ['https://static.zara.net/photos///contents/mkt/spots/ss23-sale/subhome-xmedia-launch-man-north-south//w/1920/IMAGE-landscape-fill-b9fae758-bc7c-4cdb-9207-8cda899f41f5-el_GR@GR_0.jpg?ts=1689754169620']
    },
    {
      title: ['Customer Satisfaction'],
      banner: [],
      links: [],
      text: ['At the core of our brand is our commitment to your satisfaction. We want your shopping experience with us to be exceptional from start to finish. Our dedicated customer service team is here to assist you with any queries, concerns, or styling advice you may need. We value your feedback and continuously strive to improve our products and services to meet and exceed your expectations.'],
      img: ['https://static.zara.net/photos///contents/mkt/spots/aw23-north-man-edition/subhome-xmedia-29//w/1920/IMAGE-landscape-fill-86fd45a6-56f3-4846-9fe1-2c67c7ebbc97-default_0.jpg?ts=1689788290270']
    },
    {
      title: ['Sustainable Fashion'],
      banner: [],
      links: [],
      text: ['At Eglantine, we are deeply committed to promoting sustainable fashion practices. We strive to minimize our environmental impact by using eco-friendly materials, reducing waste, and partnering with ethical manufacturing partners. By choosing Eglantine, you are not only choosing fashion-forward attire but also supporting a more sustainable future for the industry.'],
      img: ['https://images.teemill.com/rq3xythwqhdmw6n42fepnmtvwnwyupg60ejxufdgcopq33zh.jpeg.jpg?w=1920&h=768&v=2']
    },
    {
      title: ['Quality Matters'],
      banner: [],
      links: [],
      text: ["We understand that quality is a paramount factor in creating a remarkable clothing experience. That's why we meticulously select the finest materials, work with skilled artisans, and employ rigorous quality control measures to ensure that every garment meets our stringent standards. We want you to feel the difference when you wear our clothing, as it's a testament to our dedication to excellence."],
      img: ['https://static.zara.net/photos///contents/mkt/spots/ss23-north-man-joinlife/subhome-xmedia-29//w/1920/IMAGE-landscape-fill-e6f32097-6c08-4bd7-b7f9-387b7710a448-default_0.jpg?ts=1689782936846']
    }
  ]
  const slidePos = useRef(0)
  const slidePause = useRef(false);
  const [delta, setDelta] = useState(0);

  const [filterVals, setFilterVals] = useState({
    'Category': [{val: "men", checked: false}, {val: "women", checked: false}],
    'Sleeve length': [{val: 'Long', checked: false}, {val: 'Short', checked: false}],
    'Colour': [...new Set(
        catalog.map(item => {
          return item.colour.toString();
        }).toString().split(',')
      )].map(item => {
        return {val: item, checked: false}
      }),
    'Fit': [{val: 'Regular', checked: false}, {val: 'Relaxed', checked: false}, {val: 'Oversize', checked: false}],
    'Material': [...new Set(
        catalog.map(item => {
          return Object.keys(item.material).toString();
        }).toString().split(',')
      )].map(item => {
        return {val: item, checked: false}
      }),
    'Price': {slide: [
        Math.min(...catalog.map(x => x.price)), 
        Math.max(...catalog.map(x => x.price))
      ], val: [
        Math.min(...catalog.map(x => x.price)),
        Math.max(...catalog.map(x => x.price)), 
      ]}
  })

  const [avail, setAvail] = useState({
    colour: [],
    material: []
  })

  const [displayedItems, setDisplay] = useState([...catalog].filter(item => item.hasOwnProperty('sale')));
  const [selectedItem, setItem] = useState(null)

  const [cart, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)

  const filterControls = {
    'Sleeve length': <FilterControl key={uuid()} category={filterVals['Sleeve length']} catTitle={'Sleeve length'} filterChange={changeFilter} avail={avail} clickFilter={filterClicked} />,
    'Colour': <FilterControl key={uuid()} category={filterVals.Colour} catTitle={'Colour'} filterChange={changeFilter} avail={avail} clickFilter={filterClicked} />,
    'Fit': <FilterControl key={uuid()} category={filterVals.Fit} catTitle={'Fit'} filterChange={changeFilter} avail={avail} clickFilter={filterClicked} />,
    'Material': <FilterControl key={uuid()} category={filterVals.Material} catTitle={'Material'} filterChange={changeFilter} avail={avail} clickFilter={filterClicked} />,
    'Price':
      <div className="filterCont">
        <h3 onClick={() => {filterClicked('Price')}}>Price</h3>
        <div className="filtersCol" id='Price'>
          <span>Min:&nbsp; {'£' + filterVals.Price.val[0]}</span>
          <input type="range" onChange={(e, value) => {changePrice(e, 0)}} defaultValue={filterVals.Price.val[0]} min={filterVals.Price.slide[0]} max={filterVals.Price.slide[1]}/>
          <span>Max:&nbsp; {'£' + filterVals.Price.val[1]}</span>
          <input type="range" onChange={(e, value) => {changePrice(e, 1)}} defaultValue={filterVals.Price.val[1]} min={filterVals.Price.slide[0]} max={filterVals.Price.slide[1]}/>
        </div>
      </div>,
    'Category': <FilterControl key={uuid()} category={filterVals.Category} catTitle={'Category'} filterChange={changeFilter} avail={avail} clickFilter={filterClicked} />
  }

  function manageScroll(e) {
    setDelta(p => p + e.deltaY);
    if (delta > 250) {
      slidePause.current = true;
      changeSlide(1);
      setDelta(0);
    } else if (delta < -250) {
      slidePause.current = true;
      changeSlide(-1);
      setDelta(0);
    }
  }
  
  function changeLogo() {
    $('.logo').each((i, ele) => {
      $(ele).toggleClass('hidden')
    })
  }

  function link(n) {
    if (n > 0) {
      $(':root').css('--navColor', 'black')
      setLogo(1)
    } else {
      slidePause.current = false;
      $(':root').css('--navColor', 'white')
      setLogo(0)
    }

    // $('#pages').css('top', 90 - (n * +($('#home').css('height').slice(0, -2))) + 'px')
    $('#pages').css('top', ((n) * -100 + 'vh'))
  }

  function changeFilter(e, filter, cat) {
    let temp = {...filterVals};
    let i = temp[cat].indexOf(temp[cat].find(item => item.val === filter));
    temp[cat][i].checked = e.target.checked;
    setFilterVals(temp);
  }

  function changePrice(e, n) {
    let temp = {...filterVals};
    temp.Price.val[n] = e.target.value;
    setFilterVals(temp);
  }

  function addToCart(item, size) {
    let nu = [...cart];
    if (nu.map(x => x.id).indexOf(item) >= 0) {
      nu.find(x => x.id === item).q++;
    } else {
      nu.push({id: item, size: size, q: 1})
    }
    setCart(nu);
  }

  function openMenu() {
    $('.app').toggleClass('menuOpen')
  }

  function filterClicked(filter) {
    if ($(`#${filter.split(' ')[0]}`).css('display') === 'none') {
      $(`#${filter.split(' ')[0]}`).css('display', 'flex');
    } else {
      $(`#${filter.split(' ')[0]}`).css('display', 'none');
    }
  }

  function checkout() {
    hideCart();
    link(3);
  }

  function hideCart() {
    $('.cartBox').toggleClass('hideCart')
  }

  function openDropdown(id) {
    $(`#${id}`).toggleClass('opened')
  }

  function setSize(id, size) {
    openDropdown(id+'window');
    let nu = [...cart];
    cart.find(x=>x.id === id).size = size;
    setCart(nu);
  }

  function adjustQ(n, id) {
    let nu = [...cart];
    let q = cart.find(x=>x.id === id).q;
    if (q + n < 0) return;
    cart.find(x=>x.id === id).q += n;
    setCart(nu);
  }

  function changeSlide(n) {
    let pos = slidePos.current + n;
    if (pos > homeSlides.length-1 || pos < 0) pos = 0;
    slidePos.current = pos;
    $('#slides').css('top', `calc(${slidePos.current * -100}vh`)
  }
  
  useEffect(() => {
    slideTimer = setInterval(() => {
      if (slidePause.current) return;
      changeSlide(1)
    }, 15000);
    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    setCartTotal((Math.round(cart.reduce((rolling, x) => rolling + (x.q * catalog.find(n => n.id === x.id).price), 0) * 100)) / 100)
  }, [cart])

  useEffect(() => {
    let items = [];
    let allowed = {};

    Object.keys(filterVals).forEach(key => {
      if (key === 'Price') return;
      allowed[key] = filterVals[key].filter(x => x.checked);
    })

    catalog.forEach(item => {
      if (item.cat === selectedCat || (item.hasOwnProperty(selectedCat))) {
        let push = true;

        if (selectedCat==='sale' && allowed.Category.length === 1 && allowed.Category[0].val !== item.cat) {
          push = false;
        }

        if (allowed['Sleeve length'].length > 0 && push && selectedCat !== 'women') {
          if (!allowed['Sleeve length'].map(x => x.val.toLowerCase()).includes(item.sleeve)) {
            push = false;
          } 
        }

        if (allowed.Fit.length > 0 && push && selectedCat !== 'women') {
          if (!allowed.Fit.map(x => x.val.toLowerCase()).includes(item.fit)) {
            push = false;
          } 
        }
        
        if (allowed.Colour.length > 0 && push) {
          if (!item.colour.filter(c => allowed.Colour.map(item => item.val).includes(c)).length > 0) {
            push = false;
          }
        }

        if (allowed.Material.length > 0 && push) {
          if (Object.keys(item.material).filter(c => allowed.Material.map(item => item.val).includes(c)).length < 1) {
            push = false
          } 
        }

        if (item.price < filterVals.Price.val[0] || item.price > filterVals.Price.val[1]) { 
          push = false;
        }

        if (!push) return;
        items.push(item);
      };
    });
    setDisplay(items)
  }, [selectedCat, filterVals])

  useEffect(() => {
    setAvail({
      colour: [...new Set((
        catalog.filter(item => item.cat === selectedCat || item.hasOwnProperty(selectedCat)).map(item => {
          return item.colour.toString();
        }).toString().split(',')
      ))],
      material: [...new Set((
        catalog.filter(item => item.cat === selectedCat || item.hasOwnProperty(selectedCat)).map(item => {
          return Object.keys(item.material).toString();
        }).toString().split(',')
      ))]
    })
  }, [selectedCat])

  useEffect(() => {
    $('#itemPage').css('display', 'flex');
  }, [selectedItem])

  return (
    <div className="app" onWheel={manageScroll}>

      <div className="sideMenu">
        <ul>
          <li style={{fontSize: '25px'}} onClick={openMenu}>←</li>
          <li onClick={() => {openMenu(); setCat('sale'); link(1)}}>Sale</li>
          <li onClick={() => {openMenu(); setCat('men'); link(1)}}>Men</li>
          <li onClick={() => {openMenu(); setCat('women'); link(1)}}>Women</li>
        </ul>
      </div>

      <div id="nav">
        <div id="navInner">
          <div id="menuButton" onClick={openMenu}>
            <div id="line"></div>
          </div>
          <div id="logo" onMouseEnter={changeLogo} onMouseLeave={changeLogo} onClick={() => {link(0)}}>
            <img src={logoTextArray[logoPos]} className='logo' alt=""/>
            <img src={logoHeadArray[logoPos]} className='logo hidden' alt=""/>
          </div>
          <div id="navList">
            <ul>
              <li onClick={() => {setCat('sale'); link(1)}}>Sale</li>
              <li onClick={() => {setCat('men'); link(1)}}>Men</li>
              <li onClick={() => {setCat('women'); link(1)}}>Women</li>
            </ul>
            {cart.map((item, i) => {
              if (i > 0) return;
              return (
                <div id="cart">
                  <img src={navcartArray[Math.abs(logoPos-1)]} alt="your shopping basket" onClick={hideCart}/>
                  <span>{cart.length}</span>
                  <div className="cartBox">
                    {cart.map(p => {
                      let item = catalog.find(x => x.id === p.id);
                      return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><p>{`${p.q} x ${item.title}`}</p> <p><i className="seperator">-</i>{'£' + Math.round(item.price * p.q * 100) / 100}</p></div>
                    })}
                    <hr style={{margin: '15px 0 10px 0'}}/>
                    <p style={{whiteSpace: 'nowrap', display: 'flex', justifyContent: 'space-between'}}><strong>TOTAL</strong><strong>£{cartTotal}</strong></p>
                    <div className="checkoutButton" onClick={checkout}>CONTINUE TO CHECKOUT</div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>

      <div id="pages">
        <div className="page" id="home">
          <div id="slides">
            {homeSlides.map(slide => {
              return (
                <div className="homeSlide">
                  <img src={slide.img[0]} alt="" />
                  <div className="black"></div>
                  {slide.banner.map(banner => {
                    return (
                      <div className="banner">
                        <h1>
                          {banner.main}
                          <p>{banner.lil}</p>
                        </h1>
                        
                      </div>
                    )
                  })}
                  <div className="slideText">
                    {slide.title.map(title => {
                      return <><h1>{title}</h1><br /></>
                    })}
                    {slide.text.map(text => {
                      return <><p>{text}</p><br /></>
                    })}
                  </div>
                  <div className="slideLinks">
                    {slide.links.map(link => {
                      return <p onClick={link.func}>{link.txt}</p>
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="page" id="shop">
          <h1>{selectedCat.toUpperCase()}</h1>
          <div id="shopCont">
            <div className="col">
              <div id="controls">
                <div id="filters">
                  {Object.keys(filterVals).map(filter => {
                    if (selectedCat === "women" && (filter === 'Sleeve length' || filter === 'Fit')) return;
                    if (filter === 'Category' && selectedCat !== 'sale') return;
                    return filterControls[filter];
                  })}
                </div>
              </div>
            </div>
            <div className="shopGrid">
              {displayedItems.map(item => {
                return <ShopItem key={item.id} item={item} itemClicked={(id) => {setItem(id); link(2)}} addToCart={addToCart} />
              })}
            </div>
          </div>
        </div>

        <div className="page" id="itemPage">
          <Item key={uuid()} item={selectedItem} catalog={catalog} buy={addToCart} />
        </div>

        <div className="page" id="checkout">
          <h1>CHECKOUT</h1>
          <div className='checkoutSplit'>
            <table id="checkoutCart">
              <tr>
                <th>Item</th>
                <td></td>
                <th>Quantity</th>
                <td></td>
                <th>Size</th>
                <td></td>
                <th>Price</th>
              </tr>
              {cart.map(item => {
                let catItem = catalog.find(x => x.id === item.id)
                let sizes = ['XS', 'S', 'M', 'L', 'XL']
                let dropTop = sizes.indexOf(item.size) * -30 + 'px';
                return <tr>
                  <td>
                    <div className="itemSlip">
                      <img src={catItem.img[0]} alt="" />
                      <p>{catItem.title}</p>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div className="numerator">
                      <div className="remove" onClick={() => {adjustQ(-1, item.id)}}><div className="minus"></div></div>
                      {item.q}
                      <div className="add" onClick={() => {adjustQ(1, item.id)}}>+</div>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    <div id='sizeDrop' className="dropdown">
                      <div className="dropdownWindow" id={item.id+'window'}>
                        <div className="arrow"></div>
                        <div className="options">
                          <div className="option" onClick={() => {openDropdown(item.id+'window')}}>{item.size}</div>
                          {sizes.map((size) => {
                            if (size === item.size) return;
                            return <div className="option" onClick={() => {setSize(item.id, size)}}>{size}</div>
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    £{catItem.price}
                  </td>
                </tr>
              })}
              <hr />
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <b>Total</b>
                </td>
                <td>
                  <b>£{cartTotal}</b>
                </td>
              </tr>
            </table>

            <div className='payment'>
              <StripeContainer amount={cartTotal}/>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
