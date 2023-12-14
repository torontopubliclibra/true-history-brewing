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
    <>
        <div className="landing-welcome">
          <img src={icon} className="thb-icon" alt="True History Brewing icon" />
          <h1>Welcome to True History Brewing</h1>
        </div>
        <div className="landing-buttons">
          <p>By clicking Enter, you verify that you are 19 years of age or older</p>
          <button>
            <Link to="/home">Enter</Link>
          </button>
          <button>Exit</button>
        </div>
    </>
  );
};
