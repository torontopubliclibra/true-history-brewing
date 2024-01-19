// imports
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';

// component imports
import { Hours } from './../components/Hours';
import { Calendar } from './../components/Calendar';

// asset imports
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
      <li key={`food ` + key} className={`food ` + value.size}>
        <h4>{value.name}</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.beers)) {
    formattedMenus.beers.push(
      <li key={`beer ` + key} className='beer'>
        <h4>{value.name} ({value.abv}%)</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.nonAlc)) {
    formattedMenus.nonAlc.push(
      <li key={`non-alc ` + key} className='non-alc'>
        <h4>{value.name}</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

  for (let [key, value] of Object.entries(menus.wineSeltzersEtc)) {
    formattedMenus.wineSeltzersEtc.push(
      <li key={`wine-seltzers-etc` + key} className='wine-seltzers-etc'>
        <h4>{value.name} ({value.abv}%)</h4>
        <p className='description'>{value.description}</p>
        <p className='price'>${value.price}</p>
      </li>
    );
  };

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

  return (
    <>
        <section className="heading taproom-heading">
          <h2>Taproom</h2>
        </section>
        <section className="taproom-address">
          <img src={taproomPhoto} className="taproom-photo" />
          <div className="taproom-info">
            <Hours/>
            <p className="address">1154 St. Clair Avenue West, Toronto, Ontario</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-quaternary'>Get Directions <img src={compass} className="button-icon"/></Link>
          </div>
        </section>
        <section className="taproom-events" id="calendar">
          <h3>Events</h3>
          <hr/>
          <Calendar/>
        </section>
        <section className="taproom-menus" id="menu">
          <h3>Menus</h3>
          <p className='updated-date'>Last updated: 14/01/24</p>
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
    </>
  );
};