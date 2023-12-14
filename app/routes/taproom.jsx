import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';

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
        <section className="taproom-heading">
          <h2>Our Taproom</h2>
        </section>
        <section className="taproom-address">
            <div className="hours">
                <p>Hours this Week:</p>
                <ul>
                <li>Mon: Closed</li>
                <li>Tues: 4pm-11pm</li>
                <li>Fri: 12pm-12am</li>
                </ul>
            </div>
            <p>1154 St. Clair Avenue West</p>
            <button>Get Directions</button>
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
        </section>
        <section className="taproom-events">
          <h3>Upcoming Events</h3>
          <ul className='events-views'>
            <li>List view</li>
            <li>Calendar view</li>
          </ul>
        </section>
    </>
  );
};