// imports
import {Link} from '@remix-run/react';
import {useLocation} from 'react-router-dom';

// asset imports
import instagram from './../../public/assets/icons/instagram.svg';
import contact from './../../public/assets/icons/contact.svg';
import arrowUp from './../../public/assets/icons/arrow-up.svg';

export function Footer() {
  const location = useLocation();

  let scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (location.pathname === '/') {
    
    return (
      <footer className="footer landing-footer">
      </footer>
    )

  } else if (location.pathname.includes('/contact')) {
      return (
        <footer className="footer">
          <div className="footer-buttons">
            <div className='button button-primary selected'>
              <img src={contact} className="button-icon" />
            </div>
            <a onClick={scrollTop} className='button button-primary'>
              Scroll to top
              <img src={arrowUp} className="button-icon" />
            </a>
            <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button button-primary'>
              <img src={instagram} className="button-icon" />
            </Link>
          </div>
          <hr/>
          <div className="credit">
            <p>Website designed by <a href="https://danateagle.com" target="_blank">Dana Teagle</a></p>
          </div>
          <div className="copyright">
            <p>© True History Brewing, 2024</p>
          </div>
        </footer>
      )
  
    } else {

    return (
      <footer className="footer">
        <div className="footer-buttons">
          <Link to="/contact" className='button button-primary'>
            <img src={contact} className="button-icon" />
          </Link>
          <a onClick={scrollTop} className='button button-primary'>
            Scroll to top
            <img src={arrowUp} className="button-icon" />
          </a>
          <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button button-primary'>
            <img src={instagram} className="button-icon" />
          </Link>
        </div>
        <hr/>
        <div className="credit">
          <p>Website designed by <a href="https://danateagle.com" target="_blank">Dana Teagle</a></p>
        </div>
        <div className="copyright">
          <p>© True History Brewing, 2024</p>
        </div>
      </footer>
    )

  };
};