import icon from './../../public/assets/thb-icon.png';
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
  return (
    <section className='landing'>
        <div className="landing-welcome">
          <img src={icon} className="thb-icon" alt="True History Brewing icon" />
          <h1>Welcome to <br/><span className="title">True History Brewing</span></h1>
        </div>
        <div className="landing-main">
          <p>By clicking Enter, you verify that you are 19 years of age or older</p>
          <div className="landing-buttons">
            <Link to="/home" className='button-primary'>Enter</Link>
            <Link to="https://google.com" className='button-primary'>Exit</Link>
          </div>
        </div>
    </section>
  );
};
