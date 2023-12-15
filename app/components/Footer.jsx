import {Link} from '@remix-run/react';
import {useLocation} from 'react-router-dom';
import instagram from './../../public/assets/icons/instagram.svg';
import contact from './../../public/assets/icons/contact.svg';

export function Footer() {
  const location = useLocation();

  if (location.pathname === '/') {
    
    return (
      <footer className="footer landing-footer">
        <div className="credit">
          <p>© True History Brewing, 2024</p>
          <p>Website designed by <a href="https://danateagle.com" target="_blank">Dana Teagle</a></p>
        </div>
      </footer>
    )

  } else {

    return (
      <footer className="footer">
        <div className="footer-buttons">
          <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button-primary'>
            Instagram
            <img src={instagram} className="button-icon" />
          </Link>
          <Link to="/contact" className='button-primary'>
            Contact
            <img src={contact} className="button-icon" />
          </Link>
        </div>
        <div className="credit">
          <p>© True History Brewing, 2024</p>
          <p>Website designed by <a href="https://danateagle.com" target="_blank">Dana Teagle</a></p>
        </div>
      </footer>
    );

  };
};