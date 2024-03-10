import { Suspense, useState, useEffect } from 'react';
import { Await, Link, NavLink } from '@remix-run/react';
import { useLocation } from 'react-router-dom';
import icon from './../../public/assets/thb-icon.webp';
import cart from './../../public/assets/icons/cart.svg';
import home from './../../public/assets/icons/home.svg';
import beer from './../../public/assets/icons/beer.svg';
import contact from './../../public/assets/icons/contact.svg';
import instagram from './../../public/assets/icons/instagram.svg';
import compass from './../../public/assets/icons/compass.svg';
import retail from './../../public/assets/icons/retail.svg';
import basket from './../../public/assets/icons/basket.svg';
import mobileMenu from './../../public/assets/icons/mobile-menu.svg';

/**
 * @param {HeaderProps}
 */
export function Header({header, cart, asideOpen, updateAsideOpen}) {

  let [ aside, setAside ] = useState({
    open: false,
    id: ""
  });

  useEffect(() => {
    
    if (asideOpen.open) {
      setAside({
        open: true,
        id: asideOpen.aside
      });
    } else {
      setAside({
        open: false,
        id: ""
      });
    }

  }, [asideOpen]);

  const {menu} = header;
  const location = useLocation();

  if (location.pathname === '/') {
    
    return (
      <header className="landing-header">
      </header>
    )

  } else { 

    return (
      <header>
        <a
          href="/home"
          onClick={aside.open ? () => updateAsideOpen("", false) : null}
        >
          <img src={icon} className="thb-icon" alt="True History Brewing icon" />
        </a>
        <HeaderMenu
          menu={menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderSubmenu
          cart={cart}
          aside={aside}
          updateAsideOpen={updateAsideOpen}
        />
      </header>
    )
  }
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu() {
  
  return (
    <>
      <nav className="header-menu-mobile" role="navigation">
      <a
          // end
          // onClick={closeAside("./home")}
          // prefetch="intent"
          // className={activeLinkStyle}
          href="./home"
          >
          <span className="nav-text">Home</span>
          <img src={home} className="button-icon" alt="home icon"  />
        </a>
        <a
          // end
          // onClick={closeAside("./taproom")}
          // prefetch="intent"
          // className={activeLinkStyle}
          href="./taproom"
          // state={{ selectedMenu: "beers" }}
          >
          <span className="nav-text">Taproom</span>
          <img src={beer} className="button-icon" alt="beer icon" />
        </a>
        <a
          // end
          // onClick={closeAside("./retail")}
          // prefetch="intent"
          // className={activeLinkStyle}
          href="./retail"
          // state={{ selectedItems: "beers" }}
          >
          <span className="nav-text">Retail</span>
          <img src={retail} className="button-icon" alt="retail shop icon" />
        </a>
        {/* <Link
          end
          onClick={closeAside(event, "./shop")}
          prefetch="intent"
          className={activeLinkStyle}
          to="./shop"
          >
          <span className="nav-text">Online Shop</span>
          <img src={basket} className="button-icon" alt="shopping basket icon" />
        </Link> */}
        <a
          // end
          // onClick={closeAside("./contact")}
          // prefetch="intent"
          // className={activeLinkStyle}
          href="./contact"
          >
          <span className="nav-text">Contact</span>
          <img src={contact} className="button-icon" alt="message icon" />
        </a>
        <div className="mobile-only-links">
          <a href="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8" target="_blank" className="mobile-only">
            <img src={compass} className="button-icon compass" alt="compass icon" />
          </a>
          <a href="https://instagram.com/truehistorybrewing" target="_blank" className="mobile-only">
            <img src={instagram} className="button-icon" alt="Instagram icon" />
          </a>
        </div>
      </nav>
      <nav className="header-menu-desktop" role="navigation">
      <NavLink
          end
          prefetch="intent"
          className={activeLinkStyle}
          to="./home"
          >
          <span className="nav-text">Home</span>
          <img src={home} className="button-icon" alt="home icon"  />
        </NavLink>
        <NavLink
          end
          prefetch="intent"
          className={activeLinkStyle}
          to="./taproom"
          state={{ selectedMenu: "beers" }}
          >
          <span className="nav-text">Taproom</span>
          <img src={beer} className="button-icon" alt="beer icon" />
        </NavLink>
        <NavLink
          end
          prefetch="intent"
          className={activeLinkStyle}
          to="./retail"
          state={{ selectedItems: "beers" }}
          >
          <span className="nav-text">Retail</span>
          <img src={retail} className="button-icon" alt="retail shop icon" />
        </NavLink>
        {/* <NavLink
          end
          prefetch="intent"
          className={activeLinkStyle}
          to="./shop"
          >
          <span className="nav-text">Online Shop</span>
          <img src={basket} className="button-icon" alt="shopping basket icon" />
        </NavLink> */}
        <NavLink
          end
          prefetch="intent"
          className={activeLinkStyle}
          to="./contact"
          >
          <span className="nav-text">Contact</span>
          <img src={contact} className="button-icon" alt="message icon" />
        </NavLink>
      </nav>
    </>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>;}
 */
function HeaderSubmenu({cart, aside, updateAsideOpen}) {
  return (
    <nav className="header-submenu" role="navigation">
      {/* <CartToggle cart={cart} aside={aside} updateAsideOpen={updateAsideOpen} /> */}
      <HeaderMenuMobileToggle aside={aside} updateAsideOpen={updateAsideOpen} />
      <Link to="https://instagram.com/truehistorybrewing" target="_blank" className='button button-primary mobile-hide'>
        Instagram
        <img src={instagram} className="button-icon" alt="Instagram icon" />
      </Link>
    </nav>
  );
}

function HeaderMenuMobileToggle({aside, updateAsideOpen}) {
  if (aside.open && aside.id === "menu") {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary menu-toggle menu-active" onClick={() => updateAsideOpen("menu", false)}>
        <img src={mobileMenu} className="button-icon" alt="mobile menu icon" />
        <span className="button-label">Menu</span>
      </a>
    );
  } else if (aside.open && aside.id !== "cart") {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary menu-toggle" onClick={() => updateAsideOpen("menu", true)}>
        <img src={mobileMenu} className="button-icon" alt="mobile menu icon" />
        <span className="button-label">Menu</span>
      </a>
    );
  } else {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary menu-toggle" onClick={() => updateAsideOpen("menu", true)}>
        <span className="button-label">Menu</span>
        <img src={mobileMenu} className="button-icon" alt="mobile menu icon" />
      </a>
    );
  }
}

/**
 * @param {{count: number}}
 */
function CartBadge({count, aside, updateAsideOpen}) {
  if (aside.open && aside.id === "cart") {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary cart cart-active" onClick={() => updateAsideOpen("cart", false)}>
        <span className="button-label">Cart</span>({count})
        <img src={cart} className="button-icon" alt="shopping cart icon" />
      </a>
    );
  } else if (aside.open && aside.id !== "cart") {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary cart" onClick={() => updateAsideOpen("cart", true)}>
        <span className="button-label">Cart</span> ({count})
        <img src={cart} className="button-icon" alt="shopping cart icon" />
      </a>
    );
  } else {
    return (
      /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
      <a className="button button-primary cart" onClick={() => updateAsideOpen("cart", true)}>
        <span className="button-label">Cart</span> ({count})
        <img src={cart} className="button-icon" alt="shopping cart icon" />
      </a>
    );
  }
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart, aside, updateAsideOpen}) {
  return (
    <Suspense fallback={<CartBadge count={0} aside={aside} updateAsideOpen={updateAsideOpen} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} aside={aside} updateAsideOpen={updateAsideOpen} />;
          return <CartBadge count={cart.totalQuantity || 0} aside={aside} updateAsideOpen={updateAsideOpen} />;
        }}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   isActive: boolean;
 * }}
 */
function activeLinkStyle({isActive}) {
  return isActive ? 'active-link' : 'inactive-link'
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */