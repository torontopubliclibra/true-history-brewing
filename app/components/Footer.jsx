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

  let footerButtons = (
    <div className="footer-buttons">
      <Link to="/contact" className='button button-primary'>
       <img title="Link to contact page" src={contact} className="button-icon" alt="message icon" />
      </Link>
      <a onClick={scrollTop} className='button button-primary'>
        Scroll to top
        <img src={arrowUp} className="button-icon" alt="up arrow icon" />
      </a>
      <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button button-primary'>
        <img title="Link to Instagram page" src={instagram} className="button-icon" alt="Instagram icon" />
      </Link>
    </div>
  )

  if (location.pathname.includes('/contact')) {
    footerButtons = (
      <div className="footer-buttons">
        <div className='button button-primary selected'>
          <img title="Link to contact page" src={contact} className="button-icon" alt="message icon" />
        </div>
        <a onClick={scrollTop} className='button button-primary'>
          Scroll to top
          <img src={arrowUp} className="button-icon" alt="up arrow icon" />
        </a>
        <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button button-primary'>
          <img title="Link to Instagram page" src={instagram} className="button-icon" alt="Instagram icon" />
        </Link>
      </div>
    )
  }

  if (location.pathname === '/') {
    
    return (
      <footer className="footer landing-footer">
      </footer>
    )

  } else {
      return (
        <footer className="footer">
          {footerButtons}
          <hr/>
          <div className="credit">
            <p>Wallpaper design by <a href="https://www.kategolding.ca/" target="_blank">Kate Golding</a>. Film photography by <a href="https://instagram.com/bea.utifulloser" target="_blank">Ciarán Bailey</a>.</p>
            <p>Website designed and developed by <a href="https://danateagle.com" target="_blank">Dana Teagle</a>.</p>
          </div>
          <div className="copyright">
            <p>© True History Brewing, 2024</p>
          </div>
        </footer>
      )
    };
};