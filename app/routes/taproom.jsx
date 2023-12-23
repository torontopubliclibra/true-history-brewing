import { useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import { Schedule } from './../components/Schedule';
import { Calendar } from './../components/Calendar';
import compass from './../../public/assets/icons/compass.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing - Taproom'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  const { menus, events } = useContext(StrapiContext);

  let parseDateTime = (datetimeString) => {
    const dateTime = new Date(datetimeString);
    
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    
    return { year, month, day, hour, minute };
  }

  let event1 = {
    name: events.event1_name,
    date: parseDateTime(events.event1_date)
  }

  let newMenus = {
    beers: {
      beer1: {
        name: menus.beer1_name,
        description: menus.beer1_description,
        price: menus.beer1_price,
        abv: menus.beer1_abv,
      },
      beer2: {
        name: menus.beer2_name,
        description: menus.beer2_description,
        price: menus.beer2_price,
        abv: menus.beer2_abv,
      },
      beer3: {
        name: menus.beer3_name,
        description: menus.beer3_description,
        price: menus.beer3_price,
        abv: menus.beer3_abv,
      },
      beer4: {
        name: menus.beer4_name,
        description: menus.beer4_description,
        price: menus.beer4_price,
        abv: menus.beer4_abv,
      }
    }
  }

  let formattedBeers = [];

  for (let [key, value] of Object.entries(newMenus.beers)) {
    formattedBeers.push(
      <li key={key}>: 
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
            <Schedule/>
            <p>1154 St. Clair Avenue West, Toronto, ON</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon" /></Link>
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
          <ul id="menu1" className='beer-items'>
            {formattedBeers}
          </ul>
        </section>
        <section className="taproom-events" id="calendar">
          <h3>Upcoming Events</h3>
          <ul className='events-views'>
            <li>List view</li>
            <li>Calendar view</li>
          </ul>
          <ul>
            <li>{event1.name} - {event1.date.day}/{event1.date.month}/{event1.date.year} {event1.date.hour}pm</li>
          </ul>
          <Calendar/>
        </section>
    </>
  );
};