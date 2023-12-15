import {Link} from '@remix-run/react';
import {useLocation} from 'react-router-dom';

export function Footer() {
  const location = useLocation();

  if (location.pathname === '/') {
    
    return (
      <footer className="footer">
      </footer>
    )

  } else {

    return (
      <footer className="footer">
        <div className="footer-buttons">
          <Link to="https://instagram.com/truehistorybrewing">Instagram</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>Copyright True History Brewing, 2024</p>
        <p>Website designed by <a href="https://danateagle.com">Dana Teagle</a></p>
      </footer>
    );

  };
};