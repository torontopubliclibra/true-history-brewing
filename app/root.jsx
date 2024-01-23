// imports
import { useState, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNonce } from '@shopify/hydrogen';
import { defer } from '@shopify/remix-oxygen';
import {
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

// component imports
import { Layout } from '~/components/Layout';

// style imports
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';

// asset imports
import favicon from '../public/favicon.svg';
import wallpaper from '../public/assets/wallpaper.png';
import woodenBackground from '../public/assets/wooden-bg.png';
import logo from '../public/assets/thb-logo.png';
import icon from '../public/assets/thb-icon.png';

// should revalidate function
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

// initialize Strapi CMS context
export const StrapiContext = createContext(null);

// header and footer links
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
      as: 'image',
      href: icon,
    },
    {
      rel: 'preload',
      as: 'image',
      href: logo,
    },
    {
      rel: 'preload',
      as: 'image',
      href: wallpaper,
    },
    {
      rel: 'preload',
      as: 'image',
      href: woodenBackground,
    },
    {
      rel: 'icon',
      as: 'image',
      href: favicon
    }
  ];
}

// root loader
/**
 * @return {LoaderReturnData}
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data;
};

// storefront loader
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

// App component
export default function App() {

  const data = useLoaderData();
  const location = useLocation();
  const nonce = useNonce();
  /** @type {LoaderReturnData} */

  // initial state variables
  let [ htmlState, setHtmlState ] = useState("default-html");
  let [ bodyTags, setBodyTags ] = useState("default-body");
  let [ asideOpen, setAsideOpen ] = useState({
    open: false,
    aside: "",
  });

  // update aside open state
  const updateAsideOpen = (aside, open) => {

    if (open) {

      window.scrollTo({top: 0, behavior: 'smooth', duration: 200});

      setTimeout(() => {
        setHtmlState("aside-open");

        if (aside === "menu") {
  
          setBodyTags("menu-open");
          window.location.hash = "mobile-menu-aside";
          setAsideOpen({
            open: true,
            aside: "menu"
          });
  
        } else if (aside === "cart") {
  
          setBodyTags("cart-open");
          window.location.hash = "cart-aside";
          setAsideOpen({
            open: true,
            aside: "cart"
          });
        }
      }, 250);
    
    } else {

      window.scrollTo({top: 0, behavior: 'smooth', duration: 200});

      setTimeout(() => {
        setHtmlState("aside-closed");
        setBodyTags("default-body");
        setAsideOpen({
          open: false,
          aside: ""
        });
        
        if (window.location.hash) {
          window.location.hash = '';
        }
      }, 250);
    }
  }

  // initial hours
  let [ hours, setHours ] = useState({
    mon: {
      service: "closed",
      start: "",
      end: ""
    },
    tues: {
      service: "open",
      start: "4pm",
      end: "11pm"
    },
    weds: {
      service: "open",
      start: "4pm",
      end: "11pm"
    },
    thurs: {
      service: "open",
      start: "4pm",
      end: "11pm"
    },
    fri: {
      service: "open",
      start: "12pm",
      end: "12am"
    },
    sat: {
      service: "open",
      start: "12pm",
      end: "12am"
    },
    sun: {
      service: "open",
      start: "12pm",
      end: "10pm"
    },
    updatedAt: "",
  });

  // initial retail items
  const [ retail, setRetail ] = useState({
    beers: {
      items: [],
      updatedAt: "",
    },
  });

  // initial menus
  const [ menus, setMenus ] = useState({
    beers: {
      items: [],
      updatedAt: "",
    },
    food: {
      items: [],
      updatedAt: "",
    },
    nonAlc: {
      items: [],
      updatedAt: "",
    },
    wineSeltzersEtc: {
      items: [],
      updatedAt: "",
    },
  });

  // initial events
  const [ events, setEvents ] = useState(
    {
      events: [],
      updatedAt: ""
    }
  );

  // parse time from string
  let parseTime = (string) => {

    let [ hour, minute ] = string.split(':');
    let meridiem = 'am';

    if (hour > 12) {
      hour = hour - 12;
      meridiem = 'pm';
    } else if (hour == 12) {
      meridiem = 'pm';
    } else if (hour == 0) {
      hour = 12;
    } else if (hour < 10) {
      hour = '0' + hour;
    }

    if (minute < 10 && minute.length <= 1) minute = '0' + minute;
    if (minute == '0') minute = '0' + minute;

    if (minute == '00') {
      return `${hour}${meridiem}`
    } else {
      return `${hour}:${minute}${meridiem}`;
    }
  }

  // parse date from string
  let parseDate = (datetimeString) => {
    const dateTime = new Date(datetimeString);

    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (minute == 0) minute = '00';
    if (hour.length > 1) minute = '0' + hour;
    if (hour < 10) hour = '0' + hour;

    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  }

  // fetch hours from Strapi CMS
  const fetchHours = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/hours?populate=*`);
    const data = await response.json();
    let hoursData = data.data[0].attributes;
    let newHours = hours;

    let setDayHours = (day) => {
      newHours[day].service = hoursData[day].service;
      if (hoursData[day].start) {
        newHours[day].start = parseTime(hoursData[day].start);
      }
      if (hoursData[day].end) {
        newHours[day].end = parseTime(hoursData[day].end);
      }
    }

    if (hoursData) {
      setDayHours('mon');
      setDayHours('tues');
      setDayHours('weds');
      setDayHours('thurs');
      setDayHours('fri');
      setDayHours('sat');
      setDayHours('sun');
      
      if (hours !== newHours) {
        newHours['updatedAt'] = hoursData.updatedAt;
        setHours(newHours);
      }

    }
  };

  let formatPrice = (price) => {
    let priceString = price.toString();
    if (priceString.includes('.')) {
      return "$" + price.toFixed(2);
    } else {
      return "$" + price;
    }
  }

  let formatAbv = (abv) => {
    return abv.toFixed(1) + "%";
  }

  // fetch retail items from Strapi CMS
  const fetchRetail = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/bottle-shop-lists?populate=*`);
    let data = await response.json();
    let beerItemsData = data.data[0].attributes.beer;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newBeers = {
      items: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    }
    if (beerItemsData) {
      beerItemsData.forEach((beer) => {
        let newBeer = {
          title: beer.title,
          abv: formatAbv(beer.abv),
          price: formatPrice(beer.price),
          ml: beer.ml,
          style: beer.style,
        }
        newBeers.items.push(newBeer);
      });
    }
    
    let updatedRetail = retail;
    if (newBeers !== retail.beers) {
      updatedRetail.beers = newBeers;
      setRetail(updatedRetail);
    };
  };

  // fetch menus from Strapi CMS
  const fetchBeerMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/beer-menus?populate=*`);
    let data = await response.json();
    let beerMenuData = data.data[0].attributes.beer;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newBeers = {
      items: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    }
    if (beerMenuData) {
      beerMenuData.forEach((beer) => {
        let newBeer = {
          title: beer.title,
          abv: formatAbv(beer.abv),
          price: formatPrice(beer.price),
          ml: beer.ml,
        }

        if (beer.description) {
          newBeer.description = beer.description;
        }

        newBeers.items.push(newBeer);
      });
    }
    
    let updatedMenus = menus;
    if (newBeers !== updatedMenus.beers) {
      updatedMenus.beers = newBeers;
      setMenus(updatedMenus);
    };
  };

  // fetch menus from Strapi CMS
  const fetchWineSeltzersEtcMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/wine-seltzers-etc-menus?populate=*`);
    let data = await response.json();
    let wineSeltzersEtcMenuData = data.data[0].attributes.beverage;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newWineSeltzersEtc = {
      items: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    }
    if (wineSeltzersEtcMenuData) {
      wineSeltzersEtcMenuData.forEach((beverage) => {
        let newBeverage = {
          title: beverage.title,
          price: formatPrice(beverage.price),
        }
        if (beverage.abv) {
          newBeverage.abv = formatAbv(beverage.abv);
        }
        if (beverage.ml) {
          newBeverage.ml = beverage.ml;
        }
        if (beverage.description) {
          newBeverage.description = beverage.description;
        }
        newWineSeltzersEtc.items.push(newBeverage);
      });
    }

    let updatedMenus = menus;
    if (newWineSeltzersEtc !== updatedMenus.wineSeltzersEtc) {
      updatedMenus.wineSeltzersEtc = newWineSeltzersEtc;
      setMenus(updatedMenus);
    };
  };

  // fetch menus from Strapi CMS
  const fetchNonAlcMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/non-alc-menus?populate=*`);
    let data = await response.json();
    let nonAlcMenuData = data.data[0].attributes.beverage;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newNonAlc = {
      items: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    }
    if (nonAlcMenuData) {
      nonAlcMenuData.forEach((beverage) => {
        let newBeverage = {
          title: beverage.title,
          price: formatPrice(beverage.price),
        }
        if (beverage.ml) {
          newBeverage.ml = beverage.ml;
        }
        if (beverage.abv || beverage.abv === 0) {
          newBeverage.abv = formatAbv(beverage.abv);
        }
        if (beverage.description) {
          newBeverage.description = beverage.description;
        }
        newNonAlc.items.push(newBeverage);
      });
    }

    let updatedMenus = menus;
    if (newNonAlc !== updatedMenus.nonAlc) {
      updatedMenus.nonAlc = newNonAlc;
      setMenus(updatedMenus);
    };
  };

  // fetch menus from Strapi CMS
  const fetchFoodMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/food-menus?populate=*`);
    let data = await response.json();
    let foodMenusData = data.data[0].attributes.item;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newFoods = {
      items: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    }
    if (foodMenusData) {
      foodMenusData.forEach((item) => {
        let newItem = {
          title: item.title,
          price: formatPrice(item.price),
          size: item.size,
        }
        if (item.description) {
          newItem.description = item.description;
        }
        newFoods.items.push(newItem);
      });
    }
    let updatedMenus = menus;
    if (newFoods !== updatedMenus.food) {
      updatedMenus.food = newFoods;
      setMenus(updatedMenus);
    };
  };

  // fetch events from Strapi CMS
  const fetchEvents = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/events-lists?populate=*`);
    let data = await response.json();
    let eventsData = data.data[0].attributes;
    let updatedAt = new Date(data.data[0].attributes.updatedAt);
    let newEvents = {
      events: [],
      updatedAt: updatedAt.toLocaleString("en-US", {timeZone: "America/New_York"})
    };

    if (eventsData) {
      eventsData.event.forEach((event) => {
        let newEvent = {
          title: event.title,
          start: parseDate(event.start),
        }
        if (event.end) {
          newEvent.end = newEvent.start.substring(0, 10) + `T` + event.end;
          newEvent.allDay = false;
        }
        newEvents.events.push(newEvent);
      });
    }

    let updatedEvents = events;
    if (newEvents !== updatedEvents) {

      newEvents.events = newEvents.events.sort((a, b) => {
        return a.start > b.start;
      })
      updatedEvents = newEvents;
      setEvents(updatedEvents);
    };
  };

  // fetch data and reset on page load
  useEffect(() => {

    fetchHours();
    fetchEvents();
    fetchRetail();
    fetchBeerMenus();
    fetchWineSeltzersEtcMenus();
    fetchNonAlcMenus();
    fetchFoodMenus();
    
    updateAsideOpen("", false)

    if (location.pathname === '/') {
      setBodyTags("landing");
    } else {
      setBodyTags("default-body");
    }

  }, []);

  // default root return
  return (
    <html lang="en" className={htmlState}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <style data-fullcalendar />
        <Links />
      </head>
      <body className={bodyTags}>
        <StrapiContext.Provider value={{ retail: retail, hours: hours, menus: menus, events: events, currentDate: parseDate(new Date()) }}>
          <Layout {...data} asideOpen={asideOpen} updateAsideOpen={updateAsideOpen}>
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

// error boundary
export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorStatus = 500;
  let errorMessage = `Oops! Something went wrong!`;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
  }

  if (errorStatus.toString().startsWith('4')) {
    errorMessage = `Looks like you took a wrong turn!`;
  }

  // error page return
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{errorStatus + ` Error | True History Brewing`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <main className="route-error">
            <div className="error-message">
              <h1>{errorStatus} Error</h1>
              <h2>{errorMessage}</h2>
              <a href="/home" className='button button-tertiary'>
                Go back to the homepage
              </a>
            </div>
          </main>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

// customer validation
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

// menu fragment
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

// header query
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

// footer query
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
