import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
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
  const location = useLocation();

  let formattedItems = {
    beers: []
  }

  let updatedDate = (datetimeString) => {
    let day = datetimeString.substring(2, 4);
    let month = datetimeString.substring(0, 1);
    if (month < 10) {
      month = `0${month}`;
    }
    let year = datetimeString.substring(5, 9);
    return `Last updated: ${day}/${month}/${year}`
  }

  retail.beers.items.forEach((beer, index) => {
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

  useEffect(() => {
    if (location.state) {
      setSelectedItems(location.state.selectedItems);
    }
  }, [])

  return (
    <>
      <section className="heading retail-heading">
        <h2>Retail</h2>
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
              <p className='updated-date'>{updatedDate(retail.beers.updatedAt)}</p>
            </>
            : null
          }
          <div className="links">
            <Link to="/taproom#info" className='button button-tertiary'>Taproom hours<img src={clock} className="button-icon"/></Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "beers" }} className='button button-tertiary'>Beers on tap<img src={beer} className="button-icon"/></Link>
            <Link to="/shop" className='button button-tertiary'>Online shop<img src={basket} className="button-icon"/></Link>
          </div>
        </section>
    </>
  );
};