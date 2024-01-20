// imports
import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

// component imports
import BarLoader from "react-spinners/BarLoader";

// asset imports
import icon from './../../public/assets/thb-icon.png';
import flourishLeft from './../../public/assets/icons/flourish-left.svg';
import flourishRight from './../../public/assets/icons/flourish-right.svg';

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

  let [ loading, setLoading ] = useState(true);
  let [ ageVerified, setAgeVerified ] = useState(false);
  let [ rememberUser, setRememberUser ] = useState(false);

  const handleCheckboxChange = () => {
    setRememberUser(!rememberUser);
  };

  const loaderStyle = {
    backgroundColor: "#1F1F1F",
    display: "block",
    margin: "0 auto",
    width: "225px",
    height: '6px'
  };

  let loadingPage = (
    <section className='loading'>
      <img src={icon} className="thb-icon" alt="True History Brewing icon" />
      <BarLoader
        color='#D8B56E'
        loading={loading}
        cssOverride={loaderStyle}
        className='loader'
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </section>
  )

  let landingPage = (
    <section className='landing-section'>
      <div className="landing-welcome">
        <img src={icon} className="thb-icon" alt="True History Brewing icon" />
        <h1>Welcome to <br/><span className="title">True History Brewing</span></h1>
      </div>
      <div className="landing-main">
        <p>By clicking Enter, you verify that you are 19 years of age or older</p>
        <div className="landing-buttons">
          <Link onClick={() => handleAgeVerification()} to="/home" className='button button-primary decorative'>
            <img src={flourishLeft} className="flourish" />
            Enter
            <img src={flourishRight} className="flourish" />
          </Link>
          <Link to="https://google.com" className='button button-primary'>
            Exit
          </Link>
        </div>
        <div className="remember-user">
          <label for="remember-user">
            Remember me on this device:
            <input
              type="checkbox"
              id="remember-user"
              checked={rememberUser}
              className={rememberUser ? "checked" : ""}
              onChange={handleCheckboxChange}
            />
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    </section>
  )

  let handleAgeVerification = () => {
    setAgeVerified(true);

    if (rememberUser) {
      window.localStorage.setItem("ageVerified", "true");
    }

    window.location.replace("/home");
  }

  useEffect(() => {
    let savedAgeVerified = window.localStorage.getItem("ageVerified");

    setTimeout(() => {
      if (savedAgeVerified === "true") {
        setAgeVerified(true);
        window.location.replace("/home");
      } else {
        setLoading(false);
      }
    }, 3000);

  }, []);

  return loading ? loadingPage : landingPage;
};
