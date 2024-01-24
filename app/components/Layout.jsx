// imports
import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';

/**
 * @param {LayoutProps}
 */
export function Layout({cart, children = null, footer, header, isLoggedIn, asideOpen = {open: false, id: ""}, updateAsideOpen}) {

  return (
    <>
      <CartAside cart={cart} updateAsideOpen={updateAsideOpen} />
      <MobileMenuAside menu={header.menu} shop={header.shop} updateAsideOpen={updateAsideOpen} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} asideOpen={asideOpen} updateAsideOpen={updateAsideOpen}/>
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
        </Await>
      </Suspense>
    </>
  );
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart, updateAsideOpen}) {
  return (
    <Aside id="cart-aside" heading="CART" updateAsideOpen={updateAsideOpen}>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 * }}
 */
function MobileMenuAside({menu, shop, updateAsideOpen}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU" updateAsideOpen={updateAsideOpen}>
      <HeaderMenu
        menu={menu}
        viewport="mobile"
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </Aside>
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: boolean;
 * }} LayoutProps
 */

/** @typedef {import('
 * frontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
