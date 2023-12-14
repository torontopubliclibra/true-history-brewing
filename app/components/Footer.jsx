import {Link} from '@remix-run/react';

export function Footer() {
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