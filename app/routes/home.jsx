import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';
import {Link} from '@remix-run/react';
import {useState, useEffect} from 'react';

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

  const [schedule, setSchedule] = useState({});

  useEffect(() => {

    const fetchSchedules = async () => {
      const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/schedules`);
      const newSchedule = await response.json();
      setSchedule(newSchedule.data[0].attributes);
    };

    fetchSchedules();
  }, []);

  function convertTimeToAmPm(time) {
    
    const [hours, minutes] = time.split(':');
    let formattedTime = '';

    if (hours > 12) {
      formattedTime = `${hours - 12}:${minutes}pm`;
    } else if (hours === '12') {
      formattedTime = `${hours}:${minutes}pm`;
    } else {
      formattedTime = `${hours}:${minutes}am`;
    }

    return formattedTime;
  }

  let taproomHours = {
    Mon: "Closed",
    Tues: "4:00pm-11:00pm",
    Weds: "4:00pm-11:00pm",
    Thurs: "4:00pm-11:00pm",
    Fri: "12:00pm-00:00am",
    Sat: "12:00pm-00:00am",
    Sun: "12:00pm-10:00pm"
  };

  if (schedule.publishedAt) {

    taproomHours = {
      Mon: "Closed",
      Tues: convertTimeToAmPm(schedule.tues_start) + `-` + convertTimeToAmPm(schedule.tues_end),
      Weds: convertTimeToAmPm(schedule.weds_start) + `-` + convertTimeToAmPm(schedule.weds_end),
      Thurs: convertTimeToAmPm(schedule.thurs_start) + `-` + convertTimeToAmPm(schedule.thurs_end),
      Fri: convertTimeToAmPm(schedule.fri_start) + `-` + convertTimeToAmPm(schedule.fri_end),
      Sat: convertTimeToAmPm(schedule.sat_start) + `-` + convertTimeToAmPm(schedule.sat_end),
      Sun: convertTimeToAmPm(schedule.sun_start) + `-` + convertTimeToAmPm(schedule.sun_end)
    };
  }

  let formattedHours = [];

  for (let [key, value] of Object.entries(taproomHours)) {
    formattedHours.push(<li>{key}: {value}</li>);
  };

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
          <h3>Come pay us a visit and we'll pour you a cold one!</h3>
          <div className="hours-address">
            <p>1154 St. Clair Avenue West</p>
            <hr/>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button-primary'>Get Directions</Link>
            <div className="hours">
              <p>Hours this Week:</p>
              <ul>
                {formattedHours}
              </ul>
            </div>
            <div className="menu-buttons">
              <Link to="/taproom" className='button-primary'>What's on tap right now?</Link>
              <Link to="/taproom" className='button-primary'>Anything that's not beer?</Link>
              <Link to="/taproom" className='button-primary'>Do you guys have food?</Link>
            </div>
          </div>
        </section>
        <section className="main-events">
          <h3>Upcoming Events</h3>
          <ul>
            <li>15/12/23 - Lorem Ipsum Lorem</li>
            <li>26/12/23 - Lorem Ipsum Lorem Ipsum</li>
          </ul>
          <Link to="/taproom" className='button-primary'>Check out our calendar</Link>
        </section>
        <section className="main-newsletter">
          <text>Enter your email address</text>
          <button className='button-primary'>Subscribe now</button>
          <p>Join our newsletter to stay up to date with all the goings on at the taproom, as well as be the first to hear about new releases, events, and special offers</p>
        </section>
    </>
  );
};