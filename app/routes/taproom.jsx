// imports
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';

// component imports
import { Hours } from './../components/Hours';
import { Calendar } from './../components/Calendar';

// asset imports
import patioPhoto from './../../public/assets/patio-photo.png';
import taproomPhoto from './../../public/assets/taproom-photo.png';
import beer from './../../public/assets/icons/beer.svg';
import wine from './../../public/assets/icons/wine.svg';
import drink from './../../public/assets/icons/drink.svg';
import food from './../../public/assets/icons/food.svg';
import compass from './../../public/assets/icons/compass.svg';
import retail from './../../public/assets/icons/retail.svg';
import basket from './../../public/assets/icons/basket.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Taproom | True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  const { menus } = useContext(StrapiContext);
  const [ selectedMenu, setSelectedMenu ] = useState("beers");
  const [ menuItems, setMenuItems ] = useState({});
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

  let handleMenuChange = (menu) => {
    setSelectedMenu(menu);
  }

  let buttonClass = (button) => {
    if (button == selectedMenu) {
      return 'button button-primary selected';
    } else {
      return 'button button-primary';
    }
  }

  let formattedMenus = {
    beers: [],
    food: [],
    nonAlc: [],
    wineSeltzersEtc: []
  }

  let timeStamps = {
    beers: "",
    food: "",
    nonAlc: "",
    wineSeltzersEtc: ""
  }

  if (menuItems.beers) {
    menuItems.beers.items.forEach((beer, index) => {
      formattedMenus.beers.push(
        <li key={`beer-` + index} className='beer'>
          <h4>
            {beer.title} ({beer.abv})
          </h4>
          {beer.description ? <p className='description'>{beer.description}</p> : null}
          <p className='price'>
            {beer.price} / {beer.ml}ml
          </p>
        </li>
      );
      timeStamps.beers = updatedDate(menuItems.beers.updatedAt);
    });
  }

  if (menuItems.food) {
    menuItems.food.items.forEach((item, index) => {
      formattedMenus.food.push(
        <li key={`food-` + index} className={`food ` + item.size}>
          <h4>
            {item.title}
          </h4>
          {item.description ? <p className='description'>{item.description}</p> : null}
          <p className='price'>
            {item.price}
          </p>
        </li>
      );
      timeStamps.food = updatedDate(menuItems.food.updatedAt);
    });
  }

  if (menuItems.nonAlc) {
    menuItems.nonAlc.items.forEach((beverage, index) => {
      formattedMenus.nonAlc.push(
        <li key={`non-alc-` + index} className='non-alc'>
          <h4>
            {beverage.title}{beverage.abv ? ` (${beverage.abv})` : ``}
          </h4>
          {beverage.description ? <p className='description'>{beverage.description}</p> : null}
          <p className='price'>
            {beverage.price}
            {beverage.ml ? ` / ${beverage.ml}ml` : null}
          </p>
        </li>
      );
      timeStamps.nonAlc = updatedDate(menuItems.nonAlc.updatedAt);
    });
  }

  if (menuItems.wineSeltzersEtc) {
    menuItems.wineSeltzersEtc.items.forEach((beverage, index) => {
      formattedMenus.wineSeltzersEtc.push(
        <li key={`wine-seltzers-etc-` + index} className='wine-seltzers-etc'>
          <h4>
            {beverage.title}{beverage.abv ? ` (${beverage.abv})` : ``}
          </h4>
          {beverage.description ? <p className='description'>{beverage.description}</p> : null}
          <p className='price'>
            {beverage.price}
            {beverage.ml ? ` / ${beverage.ml}ml` : null}
          </p>
        </li>
      );
      timeStamps.wineSeltzersEtc = updatedDate(menuItems.wineSeltzersEtc.updatedAt);
    });
  }

  useEffect(() => {

    setMenuItems(menus);
    if (location.state) {
      setSelectedMenu(location.state.selectedMenu);
    } else {
      setSelectedMenu("beers");
    }

  }, [])

  useEffect(() => {

    setMenuItems(menus);
    setSelectedMenu("beers");
    
  }, [menus])

  return (
    <>
        <section className="heading taproom-heading">
          <h2>Taproom</h2>
        </section>
        <section className="taproom-address">
          <img src={taproomPhoto} className="taproom-photo" />
          <div className="taproom-info" id="info">
            <Hours/>
            <p className="address">1154 St. Clair Avenue West, Toronto, Ontario</p>
            <div className="taproom-buttons">
              <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-quaternary'>Directions<img src={compass} className="button-icon"/></Link>
              <Link to="/retail#items" state={{ selectedItems: "beers" }} className='button button-quaternary'>Bottle shop<img src={retail} className="button-icon"/></Link>
            </div>
          </div>
        </section>
        <section className="taproom-menus" id="menu">
          <h3>Menus</h3>
          <p className='updated-date'>{timeStamps[selectedMenu]}</p>
          <ul className='menu-nav'>
            <li>
              <button onClick={() => handleMenuChange("beers")} className={buttonClass("beers")}>
                Beers <img src={beer} className="button-icon"/>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuChange("wineSeltzersEtc")} className={buttonClass("wineSeltzersEtc")}>
                Wine, Seltzers, Etc. <img src={wine} className="button-icon"/>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuChange("nonAlc")} className={buttonClass("nonAlc")}>
                Non-alcoholic <img src={drink} className="button-icon"/>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuChange("food")} className={buttonClass("food")}>
                Food <img src={food} className="button-icon"/>
              </button>
            </li>
          </ul>
          <ul className='menu'>
            {formattedMenus[selectedMenu]}
          </ul>
        </section>
        <section className="mobile-taproom-buttons">
          <div className="buttons">
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-quaternary'>Directions<img src={compass} className="button-icon"/></Link>
            <Link to="/retail#items" state={{ selectedItems: "beers" }} className='button button-quaternary'>Retail items<img src={retail} className="button-icon"/></Link>
            <Link to="/shop" className='button button-quaternary'>Online shop<img src={basket} className="button-icon"/></Link>
          </div>
        </section>
        <section className="taproom-events" id="calendar">
          <h3>Events</h3>
          <hr/>
          <Calendar/>
        </section>
        <section className="taproom-banner">
          <img src={patioPhoto} className="banner-photo" alt="A photo of people enjoying themselves on the True History patio" />
        </section>
    </>
  );
};