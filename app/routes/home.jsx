// imports
import { useState, useContext } from 'react';
import { StrapiContext } from '../root';
import { Link } from '@remix-run/react';

// component imports
import { Hours } from './../components/Hours';

// asset imports
import logo from './../../public/assets/thb-logo.webp';
import barSketch from './../../public/assets/bar-sketch.webp';
import exteriorPhoto from './../../public/assets/exterior-photo.webp';
import clock from './../../public/assets/icons/clock.svg';
import beer from './../../public/assets/icons/beer.svg';
import retail from './../../public/assets/icons/retail.svg';
import food from './../../public/assets/icons/food.svg';
import calendar from './../../public/assets/icons/calendar.svg';
import mail from './../../public/assets/icons/mail.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing'},
  ];
};

export default function Homepage() {

  const { events, currentDate } = useContext(StrapiContext);
  const [ subscribeStatus, setSubscribeStatus ] = useState('active');
  let [ email, setEmail ] = useState("");

  // parse time from string
  let parseDate = (string) => {

    let dateTime = new Date(string);
    let monthName = dateTime.toLocaleString('default', { month: 'short' });
    let day = dateTime.getDate();
    let weekDay = dateTime.toLocaleString('default', { weekday: 'long' });
    day = day.toString();

    if (weekDay == 'Monday') weekDay = 'Mon';
    if (weekDay == 'Tuesday') weekDay = 'Tues';
    if (weekDay == 'Wednesday') weekDay = 'Weds';
    if (weekDay == 'Thursday') weekDay = 'Thurs';
    if (weekDay == 'Friday') weekDay = 'Fri';
    if (weekDay == 'Saturday') weekDay = 'Sat';
    if (weekDay == 'Sunday') weekDay = 'Sun';

    if (day.endsWith('1')) {
      day = day + 'st';
    } else if (day.endsWith('2')) {
      day = day + 'nd';
    } else if (day.endsWith('3')) {
      day = day + 'rd';
    } else {
      day = day + 'th';
    }

    return `${weekDay} ${monthName} ${day}`;
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

    if (minute == '00') {
      return `${hour}${meridiem}`
    } else {
      return `${hour}:${minute}${meridiem}`;
    }
  }

  let counter = 1;

  let formattedEvents = events.events.map((event) => {

    let title = event.title;
    let date = event.start;
    let start = parseTime(event.start);
    let key = event + `-` + counter;
    let end = null;

    if (start.substring(0, 1) == 0) {
      start = start.substring(1, start.length);
    }

    if (event.end) {
      end = parseTime(event.end);
      end = `–${end}`;
      if (start.includes('am') && end.includes('am')) {
        start = start.replace('am', '');
      } else if (start.includes('pm') && end.includes('pm')) {
        start = start.replace('pm', '');
      }
    }

    if (date >= currentDate && counter < 4) {
      counter++;
      return <li key={key}>{title} <span className="date"> {parseDate(date)} | {start}{end}</span></li>
    }
  })

  let handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

let handleSubscribe = async (event) => {
  event.preventDefault();

  const response = await fetch('https://thb-data-3vd2n.ondigitalocean.app/api/newsletter-emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "data": { email }
    }),
  });

  if (response.ok) {
    event.target.reset();
    console.log(email + ' is now subscribed');
    setSubscribeStatus('subscribed');
  } else {
    event.target.reset();
    console.error('Failed to subscribe:', response.status);
    setSubscribeStatus('error');
  }
}

  return (
    <>
        <section className="heading home-heading">
          <img src={logo} className="thb-logo" alt="True History Brewing logo" />
          <hr/>
          <h2 className="home">Brewing Low & Slow</h2>
        </section>
        <section className="home-taproom">
          <div className="sketch-address">
            <img src={barSketch} className="bar-sketch" alt="A black and white sketch of the True History taproom" />
            <p className='address'>1154 St. Clair Avenue West, Toronto, Ontario</p>
          </div>
          <hr/>
          <Hours/>
          <div className="menu-buttons">
            <Link to="/taproom#info" className='button button-tertiary mobile-only'>"What are your hours?"<img src={clock} className="button-icon" alt="clock icon" /></Link>
            <Link to="/taproom#menus" state={{ selectedMenu: "beers" }} className='button button-tertiary'>"What's on tap right now?"<img src={beer} className="button-icon" alt="beer icon" /></Link>
            <Link to="/retail#items" state={{ selectedItems: "beers" }} className='button button-tertiary'>"What's in the fridge?"<img src={retail} className="button-icon" alt="retail shop icon" /></Link>
            <Link to="/taproom#menus" state={{ selectedMenu: "food" }}  className='button button-tertiary' alt="knife and fork icon" >"Do you guys have food?"<img src={food} className="button-icon" alt="knife and fork icon" /></Link>
          </div>
        </section>
        <section className="home-events">
          <img src={exteriorPhoto} className="events-photo" alt="" />
          <div className="home-events-content">
            <h3>Upcoming Events</h3>
            <hr/>
            <ul className="events-list">
              {formattedEvents}
            </ul>
            <Link to="/taproom#events" className='button button-primary'>Check out our calendar <img src={calendar} className="button-icon" alt="calendar icon" /></Link>
          </div>
        </section>
        <section className="home-newsletter">
          <div className="newsletter-content">
            <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers!</p>
            { subscribeStatus === "active"
              ? <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    onChange={(event) => handleEmailChange(event)}
                    required
                  />
                  <button type="submit" className='button button-primary' >Subscribe now <img src={mail} className="button-icon" alt="email icon" /></button>
                </form>
              : null
            }
            { subscribeStatus === "subscribed"
              ? <>
                  <hr/>
                  <p>Thanks! You've been added to the list!</p>
                </>
              : null
            }
            { subscribeStatus === "error"
              ? <>
                  <hr/>
                  <p>Something went wrong! Try again later.</p>
                </>
              : null
            }
          </div>
        </section>
    </>
  );
};