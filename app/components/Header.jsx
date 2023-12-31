import { Suspense } from 'react';
import { Await, NavLink } from '@remix-run/react';
// import { useRootLoaderData } from '~/root';
import { useLocation } from 'react-router-dom';
import icon from './../../public/assets/thb-icon.png';
import cart from './../../public/assets/icons/cart.svg';
// import signIn from './../../public/assets/icons/sign-in.svg';
// import instagram from './../../public/assets/icons/instagram.svg';
import cornerRightDown from './../../public/assets/icons/corner-right-down.svg';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {

  const {menu} = header;
  const location = useLocation();

  if (location.pathname === '/') {
    
    return (
      <header className="header landing-header">
      </header>
    )

  } else {

    return (
      <header className="header">
        <NavLink prefetch="intent" to="/home" className={activeLinkStyle} end>
          <img src={icon} className="thb-icon" alt="True History Brewing icon" />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderSubmenu
          cart={cart}
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
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/taproom"
        >
        <span className="nav-text">Taproom</span>
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/bottle-shop"
        >
        <span className="nav-text">Bottle Shop</span>
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/store"
        >
        <span className="nav-text">Online Store</span>
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        className={activeLinkStyle}
        to="/contact"
        >
        <span className="nav-text">Contact</span>
      </NavLink>
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>;}
 */
function HeaderSubmenu({cart}) {
  return (
    <nav className="header-submenu" role="navigation">
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="button button-primary menu-toggle" href="#mobile-menu-aside">
      Menu
      <img src={cornerRightDown} className="button-icon" />
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return <a href="#cart-aside" className="button button-primary">
    Cart ({count})
    <img src={cart} className="button-icon" />
  </a>;
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
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
  return isActive ? 'active' : ''
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
