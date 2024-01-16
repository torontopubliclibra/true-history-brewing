import { useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';
import { Schedule } from './../components/Schedule';
import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import patioPhoto from './../../public/assets/patio-photo.jpg';
import compass from './../../public/assets/icons/compass.svg';
import beer from './../../public/assets/icons/beer.svg';
import wine from './../../public/assets/icons/wine.svg';
import drink from './../../public/assets/icons/drink.svg';
import food from './../../public/assets/icons/food.svg';
import calendar from './../../public/assets/icons/calendar.svg';
import mail from './../../public/assets/icons/mail.svg';

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

    let title = event.title;
    let date = event.date.substring(8, 10) + `/` + event.date.substring(5, 7) + `/` + event.date.substring(2, 4);
    let time = event.time;
    let key = event + `-` + index;

    if (time.substring(0, 1) == 0) {
      time = time.substring(1, time.length);
    }

    if (event.date >= currentDate && index < 4) {
      return <li key={key}>{title} <span className="date">- {date} @ {time}</span></li>
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
            <p className='address'>1154 St. Clair Avenue W, Toronto, Ontario</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon" /></Link>
          </div>
          <hr/>
          <Schedule/>
          <div className="menu-buttons">
            <Link to="/taproom#menu" state={{ selectedMenu: "beers" }} className='button button-tertiary'><img src={beer} className="button-icon"/>"What's on tap right now?"</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "wineSeltzersEtc" }} className='button button-tertiary'><img src={wine} className="button-icon"/>"Anything that's not beer?"</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "nonAlc" }} className='button button-tertiary'><img src={drink} className="button-icon"/>"Non-alcoholic options?"</Link>
            <Link to="/taproom#menu" state={{ selectedMenu: "food" }}  className='button button-tertiary'><img src={food} className="button-icon"/>"Do you guys have food?"</Link>
          </div>
        </section>
        <section className="main-events">
          <img src={patioPhoto} className="events-photo" />
          <div className="main-events-content">
            <h3>Events at T.H.B.</h3>
            <hr/>
            <ul className="events-list">
              {formattedEvents}
            </ul>
            <Link to="/taproom#calendar" className='button button-primary'>Check out our calendar <img src={calendar} className="button-icon" /></Link>
          </div>
        </section>
        <section className="main-newsletter">
          <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers!</p>
          <form action="">
            <input type="email" placeholder="Enter your email address" />
            <button className='button button-primary'>Subscribe now <img src={mail} className="button-icon" /></button>
          </form>
        </section>
    </>
  );
};