import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import patioPhoto from './../../public/assets/patio-photo.jpg';
import compass from './../../public/assets/icons/compass.svg';
import calendar from './../../public/assets/icons/calendar.svg';
import {Link} from '@remix-run/react';
import {Schedule} from './../components/Schedule';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing | Toronto, ON'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  return (
    <>
        <section className="heading main-heading">
          <img src={logo} className="thb-logo" alt="True History Brewing logo" />
        </section>
        <section className="main-subheading">
          <img src={barSketch} className="bar-sketch" alt="" />
          <h2>Brewing low & slow <br/><span className="location">in Toronto, ON</span></h2>
        </section>
        <section className="main-taproom">
          <h3 class="taproom-heading">Come pay us a visit and we'll pour you a cold one!</h3>
          <div className="taproom-info">
            <div className="address-block">
              <p className='address'>1154 St. Clair Avenue West</p>
              <hr/>
              <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button button-primary'>Get Directions <img src={compass} className="button-icon" /></Link>
            </div>
            <Schedule/>
          </div>
          <div className="menu-buttons">
              <Link to="/taproom#menu1" className='button button-secondary'>What's on tap right now?</Link>
              <Link to="/taproom#menu2" className='button button-secondary'>Anything that's not beer?</Link>
              <Link to="/taproom#menu3" className='button button-secondary'>Non-alcoholic options?</Link>
              <Link to="/taproom#menu4" className='button button-secondary'>Do you guys have food?</Link>
            </div>
        </section>
        <section className="main-events">
          <img src={patioPhoto} className="events-photo" />
          <div className="main-events-content">
            <h3>Upcoming Events</h3>
            <hr/>
            <ul class="events-list">
              <li><span className="date">15/12/23 -</span> Lorem Ipsum Lorem</li>
              <li><span className="date">26/12/23 -</span> Lorem Ipsum Lorem Ipsum</li>
              <li><span className="date">18/01/24 -</span> Lorem Ipsum Lorem</li>
              <li><span className="date">31/01/24 -</span> Lorem Ipsum Lorem Ipsum</li>
            </ul>
            <Link to="/taproom#calendar" className='button button-tertiary'>Check out our calendar <img src={calendar} className="button-icon" /></Link>
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