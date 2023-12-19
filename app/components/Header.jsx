import {Await, NavLink, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {useRootLoaderData} from '~/root';
import { useLocation } from 'react-router-dom';
import icon from './../../public/assets/thb-icon.png';
import cart from './../../public/assets/icons/cart.svg';
import signIn from './../../public/assets/icons/sign-in.svg';
import instagram from './../../public/assets/icons/instagram.svg';

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
        <NavLink prefetch="intent" to="/home" style={activeLinkStyle} end>
          <img src={icon} class="thb-icon" alt="True History Brewing icon" />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
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
export function HeaderMenu({menu, primaryDomainUrl, viewport}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  
  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/home"
        >
          Home
        </NavLink>
      )}
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to="/home"
        >
        Home
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to="/taproom"
        >
        Taproom
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to="/bottle-shop"
        >
        Bottle Shop
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to="/store"
        >
        Online Store
      </NavLink>
      <NavLink
        end
        onClick={closeAside}
        prefetch="intent"
        style={activeLinkStyle}
        to="/contact"
        >
        Contact
      </NavLink>
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <CartToggle cart={cart} />
      {/* <NavLink prefetch="intent" to="/account" style={activeLinkStyle}  className="button button-primary">
        {isLoggedIn ? 'Account' : 'Sign in'}
        <img src={signIn} className="button-icon" />
      </NavLink> */}
      <Link to="https://instagram.com/truehistorybrewing" target="_blank" className="button button-primary">
        Instagram
        <img src={instagram} className="button-icon" />
      </Link>
      {/* <SearchToggle /> */}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
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
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
