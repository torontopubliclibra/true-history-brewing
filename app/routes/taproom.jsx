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
        <section className="heading taproom-heading">
          <h2>Taproom</h2>
        </section>
        <section className="taproom-address">
            <Schedule/>
            <p>1154 St. Clair Avenue West</p>
            <Link to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className='button-primary'>Get Directions</Link>
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