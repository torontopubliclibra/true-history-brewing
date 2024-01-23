import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import beerCans from './../../public/assets/beer-cans.png';
import clock from './../../public/assets/icons/clock.svg';
import beer from './../../public/assets/icons/beer.svg';
import basket from './../../public/assets/icons/basket.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Retail | True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  const { retail } = useContext(StrapiContext);
  const [ selectedItems, setSelectedItems ] = useState("beers");
  const [ retailItems, setRetailItems ] = useState({});
  const location = useLocation();

  let updatedDate = (datetimeString) => {
    let day = datetimeString.substring(2, 4);
    let month = datetimeString.substring(0, 1);
    if (month < 10) {
      month = `0${month}`;
    }
    let year = datetimeString.substring(5, 9);
    return `Last updated: ${day}/${month}/${year}`
  }

  let formattedItems = {
    beers: []
  }

  if (retailItems.beers) {
    retailItems.beers.items.forEach((beer, index) => {
      formattedItems.beers.push(
        <>
        <li key={`beer-` + index} className='line-item'>
          <ul>
            <li className="title">
              {beer.title}
            </li>
            <li className="style">
              {beer.style}
            </li>
            <li className="abv">
              {beer.abv}
            </li>
            <li className="ml">
              {beer.ml}ml
            </li>
            <li className="price">
              {beer.price}
            </li>
          </ul>
        </li>
        <div className="mobile-line-item">
          <h4>{beer.title} ({beer.abv})</h4>
          <p className="description">{beer.style}</p>
          <p className="price">{beer.price} / {beer.ml}ml</p>
        </div>
        </>
      );
    });
  }

  useEffect(() => {

    setRetailItems(retail);
    if (location.state) {
      setSelectedItems(location.state.selectedItems);
    } else {
      setSelectedItems("beers");
    }

  }, [])

  useEffect(() => {

    setRetailItems(retail);
    setSelectedItems("beers");
    
  }, [retail])

  return (
    <>
      <section className="heading retail-heading">
        <h2>Retail</h2>
        </section>
        <section className="retail-info">
          <div className="retail-buttons">
            <Link to="/taproom#info" className='button button-quaternary'>Taproom hours<img src={clock} className="button-icon"/></Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "beers" }} className='button button-quaternary'>Beers on tap<img src={beer} className="button-icon"/></Link>
            <Link to="/shop" className='button button-quaternary'>Online shop<img src={basket} className="button-icon"/></Link>
          </div>
          <img src={beerCans} className="retail-photo" alt="" />
        </section>
        <section className="retail-content" id="items">
          <h3>What's in the Fridge?</h3>
          {
            formattedItems[selectedItems].length > 0
            ? <>
              <ul className="fridge-list">
                <li className='line-item header'>
                  <ul>
                    <li className="title">
                      Name
                    </li>
                    <li className="style">
                      Style
                    </li>
                    <li className="abv">
                      ABV
                    </li>
                    <li className="ml">
                      Size
                    </li>
                    <li className="price">
                      Price
                    </li>
                  </ul>
                </li>
                {formattedItems[selectedItems]}
              </ul>
              <p className='updated-date'>{updatedDate(retailItems.beers.updatedAt)}</p>
            </>
            : null
          }
        </section>
    </>
  );
};