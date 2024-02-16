import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import BarLoader from "react-spinners/BarLoader";
import beerCans from './../../public/assets/beer-cans.webp';
import clock from './../../public/assets/icons/clock.svg';
import beer from './../../public/assets/icons/beer.svg';
import basket from './../../public/assets/icons/basket.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing | Retail'},
    {description: 'Brewery and taproom in Toronto, Ontario'},
  ];
};

export default function Homepage() {

  let { retail } = useContext(StrapiContext);
  let [ selectedItems, setSelectedItems ] = useState("beers");
  let [ retailItems, setRetailItems ] = useState({});
  let [ formattedItems, setFormattedItems ] = useState({
    beers: []
  })
  let [ itemsLoading, setItemsLoading ] = useState(true);
  let [ loadingError, setLoadingError ] = useState(false);
  let location = useLocation();

  const loaderStyle = {
    backgroundColor: "#1F1F1F",
    display: "block",
    margin: "100px auto 125px auto",
    width: "500px",
    height: '6px'
  };

  let updatedDate = (datetimeString) => {
    let day = datetimeString.substring(2, 4);
    let month = datetimeString.substring(0, 1);
    if (month < 10) {
      month = `0${month}`;
    }
    let year = datetimeString.substring(5, 9);
    return `Last updated: ${day}/${month}/${year}`
  }

  useEffect(() => {

    if (location.state) {
      setSelectedItems(location.state.selectedItems);
    } else {
      setSelectedItems("beers");
    }

    setTimeout(() => {

      setRetailItems(retail);

    }, 2000);

  }, [])

  useEffect(() => {
  
    let newFormattedItems = {
      beers: []
    }
  
    if (retailItems.beers) {
      retailItems.beers.items.forEach((beer, index) => {
        newFormattedItems.beers.push(
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
  
      setFormattedItems(newFormattedItems);
    }

  }, [retailItems])

  useEffect(() => {


    if (formattedItems[selectedItems].length > 0) {
      setItemsLoading(false);
    }

    let firstTimeout;
    let secondTimeout;

    if (itemsLoading) {
      firstTimeout = setTimeout(() => {
        if (formattedItems[selectedItems].length > 0) {
          setItemsLoading(false);
        }
      }, 5000);
      secondTimeout = setTimeout(() => {
        if (formattedItems[selectedItems].length === 0) {
          setLoadingError(true);
        }
      }, 7500);
    }

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };

  }, [formattedItems])

  return (
    <>
      <section className="heading retail-heading">
        <h2>Retail</h2>
      </section>
      <section className="retail-info">
        <div className="retail-buttons">
          <Link to="/taproom#info" className='button button-quaternary'>Taproom hours<img src={clock} className="button-icon" alt="clock icon" /></Link>
          <Link to="/taproom#menu" state={{ selectedMenu: "beers" }} className='button button-quaternary'>Beers on tap<img src={beer} className="button-icon" alt="beer icon" /></Link>
          {/* <Link to="/shop" className='button button-quaternary'>Online shop<img src={basket} className="button-icon" alt="shopping basket icon" /></Link> */}
        </div>
        <img src={beerCans} className="retail-photo" alt="Film photo of a selection of THB beer cans on a wooden ledge" />
      </section>
      <section className="retail-content" id="items">
        <h3>What's in the Fridge?</h3>
      {
        loadingError
        ? <p className='error-message'>Sorry, there was an error loading the retail items. Please try again later.</p>
        : formattedItems[selectedItems].length > 0
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
        : <BarLoader
          color='#778d79'
          loading={itemsLoading}
          cssOverride={loaderStyle}
          className='loader menu-loader'
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
      </section>
    </>
  );
};