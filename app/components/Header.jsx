import { Suspense, useState, useEffect } from 'react';
import { Await, NavLink } from '@remix-run/react';
// import { useRootLoaderData } from '~/root';
import { useLocation } from 'react-router-dom';
import icon from './../../public/assets/thb-icon.png';
import cart from './../../public/assets/icons/cart.svg';
import home from './../../public/assets/icons/home.svg';
import beer from './../../public/assets/icons/beer.svg';
import contact from './../../public/assets/icons/contact.svg';
import instagram from './../../public/assets/icons/instagram.svg';
import compass from './../../public/assets/icons/compass.svg';
import store from './../../public/assets/icons/store.svg';
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
          className={activeLinkStyle}
          onClick={aside.open ? () => updateAsideOpen("", false) : null}
        >
          <img src={icon} className="thb-icon" alt="True History Brewing icon" />
        </a>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
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
export function HeaderMenu({viewport}) {
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  
  return (
    <nav className={className} role="navigation">
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/home"
        >
        <span className="nav-text">Home</span>
        <img src={home} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/taproom"
        >
        <span className="nav-text">Taproom</span>
        <img src={beer} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/retail"
        >
        <span className="nav-text">Retail</span>
        <img src={store} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/shop"
        >
        <span className="nav-text">Online Shop</span>
        <img src={basket} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/contact"
        >
        <span className="nav-text">Contact</span>
        <img src={contact} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className="mobile-only"
        to="https://instagram.com/truehistorybrewing"
        target="_blank"
        >
        <span className="nav-text">Instagram</span>
        <img src={instagram} className="button-icon" />
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className="mobile-only"
        to="https://maps.app.goo.gl/uyUZFimEhq7YmVrD8"
        target="_blank"
        >
        <span className="nav-text">Get Directions</span>
        <img src={compass} className="button-icon" />
      </NavLink>
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>;}
 */
function HeaderSubmenu({cart, aside, updateAsideOpen}) {
  return (
    <nav className="header-submenu" role="navigation">
      <CartToggle cart={cart} aside={aside} updateAsideOpen={updateAsideOpen} />
      <HeaderMenuMobileToggle aside={aside} updateAsideOpen={updateAsideOpen} />
    </nav>
  );
}

function HeaderMenuMobileToggle({aside, updateAsideOpen}) {
  if (aside.open && aside.id === "menu") {
    return (
      <a className="button button-primary menu-toggle menu-active" onClick={() => updateAsideOpen("menu", false)}>
        <img src={mobileMenu} className="button-icon" />
        <span className="button-label">Menu</span>
      </a>
    );
  } else if (aside.open && aside.id !== "cart") {
    return (
      <a className="button button-primary menu-toggle" onClick={() => updateAsideOpen("menu", true)}>
        <img src={mobileMenu} className="button-icon" />
        <span className="button-label">Menu</span>
      </a>
    );
  } else {
    return (
      <a className="button button-primary menu-toggle" onClick={() => updateAsideOpen("menu", true)}>
        <span className="button-label">Menu</span>
        <img src={mobileMenu} className="button-icon" />
      </a>
    );
  }
}

// function SearchToggle() {
//   return <a href="#search-aside">Search</a>;
// }

/**
 * @param {{count: number}}
 */
function CartBadge({count, aside, updateAsideOpen}) {
  if (aside.open && aside.id === "cart") {
    return (
      <a className="button button-primary cart cart-active" onClick={() => updateAsideOpen("cart", false)}>
        <span className="button-label">Cart</span>({count})
        <img src={cart} className="button-icon" />
      </a>
    );
  } else if (aside.open && aside.id !== "cart") {
    return (
      <a className="button button-primary cart" onClick={() => updateAsideOpen("cart", true)}>
        <span className="button-label">Cart</span> ({count})
        <img src={cart} className="button-icon" />
      </a>
    );
  } else {
    return (
      <a className="button button-primary cart" onClick={() => updateAsideOpen("cart", true)}>
        <span className="button-label">Cart</span> ({count})
        <img src={cart} className="button-icon" />
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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 * }}
 */
function activeLinkStyle({isActive}) {
  return isActive ? 'active-link' : ''
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
