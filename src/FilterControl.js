import React from 'react'

export default function FilterControl({category, catTitle, filterChange, avail, clickFilter}) {  
  
  return (
    <div className="filterCont">
      <h3 onClick={() => clickFilter(catTitle)}>{catTitle}</h3>
      <div className="col filtersCol" id={catTitle.split(' ')[0]}>
        {category.map(filter => {
          if (catTitle === 'Colour' && !avail.colour.includes(filter.val)) return;
          if (catTitle === 'Material' && !avail.material.includes(filter.val)) return;
          return (
            <div className='checkRow'>
              <input type="checkbox" checked={filter.checked} name={catTitle} id={filter.val} value={filter.val} onChange={(e) => {filterChange(e, filter.val, catTitle)}} />
              <label htmlFor={filter.val}>{filter.val.slice(0, 1).toUpperCase() + filter.val.slice(1)}</label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
