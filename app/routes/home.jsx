import { useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import { Schedule } from './../components/Schedule';
import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import patioPhoto from './../../public/assets/patio-photo.jpg';
import compass from './../../public/assets/icons/compass.svg';
import calendar from './../../public/assets/icons/calendar.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  const { events, currentDate } = useContext(StrapiContext);

  let formattedEvents = events.map((event, index) => {
    if (event.date >= currentDate && index < 4) {
      return <li><span className="date">{event.date.substring(8, 10)}/{event.date.substring(5, 7)}/{event.date.substring(2, 4)} -</span> {event.title}</li>
    }
  })

  return (
    <>
        <section className="heading main-heading">
          <img src={logo} className="thb-logo" alt="True History Brewing logo" />
          <hr/>
          <h2 className="home">Brewing Low & Slow</h2>
        </section>
        <section className="main-taproom">
          <div className="sketch-address">
            <img src={barSketch} className="bar-sketch" alt="" />
            <p className='address'>1154 St. Clair Avenue West, Toronto, ON</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon" /></Link>
          </div>
          <Schedule/>
          <div className="menu-buttons">
            <Link to="/taproom#menu" state={{ selectedMenu: "beers" }} className='button button-tertiary'>What's on tap right now?</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "wine-seltzers-etc" }} className='button button-tertiary'>Anything that's not beer?</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "non-alc" }} className='button button-tertiary'>Non-alcoholic options?</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "food" }}  className='button button-tertiary'>Do you guys have food?</Link>
          </div>
        </section>
        <section className="main-events">
          <img src={patioPhoto} className="events-photo" />
          <div className="main-events-content">
            <h3>Upcoming Events</h3>
            <hr/>
            <ul className="events-list">
              {formattedEvents}
            </ul>
            <Link to="/taproom#calendar" className='button button-primary'>Check out our calendar <img src={calendar} className="button-icon" /></Link>
          </div>
        </section>
        <section className="main-newsletter">
          <text>Enter your email address</text>
          <button className='button button-primary'>Subscribe now</button>
          <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers</p>
        </section>
    </>
  );
};