import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import { Schedule } from './../components/Schedule';
import { Calendar } from './../components/Calendar';
import taproomPhoto from './../../public/assets/taproom-photo.png';
import beer from './../../public/assets/icons/beer.svg';
import wine from './../../public/assets/icons/wine.svg';
import drink from './../../public/assets/icons/drink.svg';
import food from './../../public/assets/icons/food.svg';
import compass from './../../public/assets/icons/compass.svg';

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
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setSelectedMenu(location.state.selectedMenu);
    }
  }, [])

  let formattedMenus = {
    beers: [],
    food: [],
    nonAlc: [],
    wineSeltzersEtc: []
  }

  for (let [key, value] of Object.entries(menus.food)) {
    formattedMenus.food.push(
      <li key={key} className={`food ` + value.size}>
        <h4>{value.name}</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.beers)) {
    formattedMenus.beers.push(
      <li key={key} className='beer'>
        <h4>{value.name} ({value.abv}%)</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.nonAlc)) {
    formattedMenus.nonAlc.push(
      <li key={key} className='non-alc'>
        <h4>{value.name}</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.wineSeltzersEtc)) {
    formattedMenus.wineSeltzersEtc.push(
      <li key={key} className='wine-seltzers-etc'>
        <h4>{value.name} ({value.abv}%)</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  let handleMenuChange = (menu) => {
    setSelectedMenu(menu);
  }

  return (
    <>
        <section className="heading taproom-heading">
          <h2>Taproom</h2>
        </section>
        <section className="taproom-address">
          <img src={taproomPhoto} className="taproom-photo" />
          <div className="taproom-info">
            <p>1154 St. Clair Avenue W, Toronto, Ontario</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon"/></Link>
            <Schedule/>
          </div>
        </section>
        <section className="taproom-menus">
          <h3 id="menu">Menus</h3>
          <p className='updated-date'>Last updated: 14/01/24</p>
          <ul className='menu-nav'>
            {
              selectedMenu !== "beers"
              ? <li><button onClick={() => handleMenuChange("beers")} className='button button-primary'>Beers <img src={beer} className="button-icon"/></button></li>
              : <li><button className='button button-primary selected'>Beers <img src={beer} className="button-icon"/></button></li>
            }
            {
              selectedMenu !== "wineSeltzersEtc"
              ? <li><button onClick={() => handleMenuChange("wineSeltzersEtc")} className='button button-primary'>Wine, Seltzers, Etc. <img src={wine} className="button-icon"/></button></li>
              : <li><button className='button button-primary selected'>Wine, Seltzers, Etc. <img src={wine} className="button-icon"/></button></li>
            }
            {
              selectedMenu !== "nonAlc"
              ? <li><button onClick={() => handleMenuChange("nonAlc")} className='button button-primary'>Non-alcoholic <img src={drink} className="button-icon"/></button></li>
              : <li><button className='button button-primary selected'>Non-alcoholic <img src={drink} className="button-icon"/></button></li>
            }
            {
              selectedMenu !== "food"
              ? <li><button onClick={() => handleMenuChange("food")} className='button button-primary'>Food <img src={food} className="button-icon"/></button></li>
              : <li><button className='button button-primary selected'>Food <img src={food} className="button-icon"/></button></li>
            }
          </ul>
          <ul className='menu'>
            {formattedMenus[selectedMenu]}
          </ul>
        </section>
        <section className="taproom-events" id="calendar">
          <h3>Upcoming Events</h3>
          <hr/>
          <Calendar/>
        </section>
    </>
  );
};