import { useState, useEffect, createContext } from 'react';
import { useNonce } from '@shopify/hydrogen';
import { defer } from '@shopify/remix-oxygen';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
} from '@remix-run/react';
import { Layout } from '~/components/Layout';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import favicon from '../public/favicon.svg';
import icon from '.././public/assets/thb-icon.png';
import logo from '.././public/assets/thb-logo.png';
import wallpaper from '.././public/assets/wallpaper.png';
import woodenBackground from '.././public/assets/wooden-bg.jpg';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 * @type {ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://thb-data-3vd2n.ondigitalocean.app',
    },
    {
      rel: 'preload',
      type: 'image',
      href: icon,
    },
    {
      rel: 'preload',
      type: 'image',
      href: logo,
    },
    {
      rel: 'preload',
      type: 'image',
      href: wallpaper,
    },
    {
      rel: 'preload',
      type: 'image',
      href: woodenBackground,
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: favicon
    },
  ];
}

/**
 * @return {LoaderReturnData}
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data;
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront, session, cart} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // validate the customer access token is valid
  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
    },
    {headers},
  );
}

export const StrapiContext = createContext(null);

export default function App() {
  const nonce = useNonce();
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  const [schedule, setSchedule] = useState({});
  const [menus, setMenus] = useState({});
  const [events, setEvents] = useState({});

  const fetchSchedules = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/schedules`);
    const newSchedule = await response.json();
    setSchedule(newSchedule.data[0].attributes);
  };

  const fetchMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/beer-menus`);
    let newMenus = await response.json();
    setMenus(newMenus.data[0].attributes);
  };

  const fetchEvents = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/events`);
    let newEvents = await response.json();
    setEvents(newEvents.data[0].attributes);
  };

  useEffect(() => {
    fetchSchedules();
    fetchMenus();
    fetchEvents();

    console.log('fetching new data')
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StrapiContext.Provider value={{ schedule: schedule, menus: menus, events: events }}>
          <Layout {...data}>
            <Outlet />
          </Layout>
        </StrapiContext.Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <main className="route-error">
            <h1>{errorStatus}</h1>
            <h2>Looks like you took a wrong turn</h2>
            <Link to="/home" className='button button-tertiary'>
              Go back to the Homepage
            </Link>
          </main>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 *
 * @example
 * ```js
 * const {isLoggedIn, headers} = await validateCustomerAccessToken(
 *  customerAccessToken,
 *  session,
 * );
 * ```
 * @param {LoaderFunctionArgs['context']['session']} session
 * @param {CustomerAccessToken} [customerAccessToken]
 */
async function validateCustomerAccessToken(session, customerAccessToken) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
`;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@remix-run/react').ShouldRevalidateFunction} ShouldRevalidateFunction */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CustomerAccessToken} CustomerAccessToken */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
