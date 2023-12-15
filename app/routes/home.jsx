import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import {Link} from '@remix-run/react';

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

  let taproomHours = {
    Mon: "Closed",
    Tues: "4pm-11pm",
    Weds: "4pm-11pm",
    Thurs: "4pm-11pm",
    Fri: "12pm-12am",
    Sat: "12pm-12am",
    Sun: "12pm-10pm"
  };

  let formattedHours = [];

  for (let [key, value] of Object.entries(taproomHours)) {
    formattedHours.push(<li>{key}: {value}</li>);
  };

  return (
    <>
        <section className="main-heading">
          <img src={logo} className="thb-logo" alt="True History Brewing logo" />
        </section>
        <section className="main-subheading">
          <img src={barSketch} className="bar-sketch" alt="" />
          <h2>Brewing low & slow <br/><span className="location">in Toronto, ON</span></h2>
        </section>
        <section className="main-taproom">
          <h3>Come pay us a visit and we'll pour you a cold one!</h3>
          <div className="hours-address">
            <p>1154 St. Clair Avenue West</p>
            <hr/>
            <Link to="https://maps.app.goo.gl/iyM8YKzMAZkCEQqC6">Get Directions</Link>
            <div className="hours">
              <p>Hours this Week:</p>
              <ul>
                {formattedHours}
              </ul>
            </div>
            <div className="menu-buttons">
              <Link to="/taproom">What's on tap right now?</Link>
              <Link to="/taproom">Anything that's not beer?</Link>
              <Link to="/taproom">Do you guys have food?</Link>
            </div>
          </div>
        </section>
        <section className="main-events">
          <h3>Upcoming Events</h3>
          <ul>
            <li>15/12/23 - Lorem Ipsum Lorem</li>
            <li>26/12/23 - Lorem Ipsum Lorem Ipsum</li>
          </ul>
          <Link to="/taproom">Check out our calendar</Link>
        </section>
        <section className="main-newsletter">
          <text>Enter your email address</text>
          <button>Subscribe now</button>
          <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers</p>
        </section>
    </>
  );
};