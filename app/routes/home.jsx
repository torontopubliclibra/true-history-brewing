// imports
import { useState, useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';

// component imports
import { Hours } from './../components/Hours';

// asset imports
import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import patioPhoto from './../../public/assets/patio-photo.png';
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
  const [ newsletterBtn, setNewsletterBtn ] = useState('Subscribe now');

  // parse time from string
  let parseDate = (string) => {

    let dateTime = new Date(string);
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    let year = dateTime.getFullYear();
    let shortYear = year.toString().substring(2, 4);

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return `${day}/${month}/${shortYear}`;
  }

  // parse time from string
  let parseTime = (string) => {

    let dateTime = new Date(string);
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let meridiem = 'am';

    if (hour > 12) {
      hour = hour - 12;
      meridiem = 'pm';
    } else if (hour == 12) {
      meridiem = 'pm';
    } else if (hour == 0) {
      hour = 12;
    } else if (hour < 10) {
      hour = '0' + hour;
    }

    if (minute < 10 && minute.length <= 1) minute = '0' + minute;
    if (minute == '0') minute = '0' + minute;

    return `${hour}:${minute}${meridiem}`;
  }

  let formattedEvents = events.events.map((event, index) => {

    let title = event.title;
    let date = event.start;
    let time = parseTime(event.start);
    let key = event + `-` + index;

    if (time.substring(0, 1) == 0) {
      time = time.substring(1, time.length);
    }

    if (date >= currentDate && index < 3) {
      return <li key={key}>{title} <span className="date">- {parseDate(date)} @ {time}</span></li>
    }
  })

  let handleSubscribe = async (event) => {

    event.preventDefault();

    let { email } = event.target.elements;
    console.log(email.value + ' is now subscribed');
    setNewsletterBtn('Subscribed');
    event.target.reset();

    setTimeout(() => {
      setNewsletterBtn('Subscribe now');
    }, 3000);
  }

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
            <p className='address'>1154 St. Clair Avenue West, Toronto, Ontario</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-quaternary'>Get Directions <img src={compass} className="button-icon" /></Link>
          </div>
          <hr/>
          <Hours/>
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
            <h3>Upcoming Events</h3>
            <hr/>
            <ul className="events-list">
              {formattedEvents}
            </ul>
            <Link to="/taproom#calendar" className='button button-primary'>Check out our calendar <img src={calendar} className="button-icon" /></Link>
          </div>
        </section>
        <section className="main-newsletter">
          <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers!</p>
          <form onSubmit={handleSubscribe}>
            <input type="email" id="email" placeholder="Enter your email address" required />
            <button type="submit" className='button button-primary' >{newsletterBtn} <img src={mail} className="button-icon" /></button>
          </form>
        </section>
    </>
  );
};