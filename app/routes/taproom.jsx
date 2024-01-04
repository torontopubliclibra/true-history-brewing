import { useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import { Schedule } from './../components/Schedule';
import { Calendar } from './../components/Calendar';
import taproomPhoto from './../../public/assets/taproom-photo.png';
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
  let formattedBeers = [];

  for (let [key, value] of Object.entries(menus.beers)) {
    formattedBeers.push(
      <li key={key}>
        <h4>{value.name}</h4>
        <p>{value.description}</p>
        <p>{value.price}</p>
        <p>{value.abv}</p>
      </li>
    );
  };

  return (
    <>
        <section className="heading taproom-heading">
          <h2>Taproom</h2>
        </section>
        <section className="taproom-address">
          <img src={taproomPhoto} className="taproom-photo" />
          <div className="taproom-info">
            <Schedule/>
            <p>1154 St. Clair Avenue West, Toronto, ON</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon" /></Link>
          </div>
        </section>
        <section className="taproom-menus">
          <h3>Menus</h3>
          <p>Last updated: 21/11/23</p>
          <ul className='menu-nav'>
            <li>Beers</li>
            <li>Wine/Seltzers/Etc.</li>
            <li>Non-alcoholic</li>
            <li>Food</li>
          </ul>
          <ul id="menu1" className='menu'>
            {formattedBeers}
          </ul>
        </section>
        <section className="taproom-events" id="calendar">
          <h3>Upcoming Events</h3>
          <Calendar/>
        </section>
    </>
  );
};