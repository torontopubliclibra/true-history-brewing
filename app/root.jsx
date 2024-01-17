// imports
import { useState, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';
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

// component imports
import { Layout } from '~/components/Layout';

// style imports
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';

// asset imports
import favicon from '../public/favicon.svg';
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
      rel: 'icon',
      as: 'image',
      href: favicon
    },
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

// parse time from string
export function parseTime(type, string) {

  let hour = '';
  let minute = '';
  let meridiem = 'am';

  if (type === "datetime") {
    let dateTime = new Date(string);

    hour = dateTime.getHours();
    minute = dateTime.getMinutes();

  } else if (type === "time") {
    [ hour, minute ] = string.split(':');

  }

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

  return `${hour}:${minute}${meridiem}`;
}

// parse date from string
export function parseDate(datetimeString) {
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

// App component
export default function App() {

  const data = useLoaderData();
  const location = useLocation();
  const nonce = useNonce();
  /** @type {LoaderReturnData} */

  // initial state variables
  let [ htmlState, setHtmlState ] = useState("aside-closed");
  let [ bodyTags, setBodyTags ] = useState("default-body");
  let [ asideOpen, setAsideOpen ] = useState({
    open: false,
    aside: "",
  });

  // update aside open state
  const updateAsideOpen = (aside, open) => {

    if (open) {
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

    } else {

      setHtmlState("aside-closed");
      setBodyTags("default-body");
      window.location.hash = '';
      setAsideOpen({
        open: false,
        aside: ""
      });
    }
  }

  // initial hours
  const [ hours, setHours ] = useState({
    Mon: "Closed",
    Tues: "4:00pm–11:00pm",
    Weds: "4:00pm–11:00pm",
    Thurs: "4:00pm–11:00pm",
    Fri: "12:00pm–12:00am",
    Sat: "12:00pm–12:00am",
    Sun: "12:00pm–10:00pm"
  });

  // initial menus
  const [ menus, setMenus ] = useState({
    beers: {
      beer1: {
        name: "Polish Pils",
        description: "Polish pilsner hopped w/ Tomyski & Lunga",
        price: "9.25",
        abv: "4.6"
      },
      beer2: {
        name: "Is It Local?",
        description: "Dunkelweizen",
        price: "9.25",
        abv: "6.0"
      },
      beer3: {
        name: "There's Always Money in the Banana Stand",
        description: "Hefeweizen",
        price: "9.25",
        abv: "5.6"
      },
      beer4: {
        name: "Office Hours",
        description: "Rotbier",
        price: "9.25",
        abv: "5.1"
      },
      beer5: {
        name: "Nockherberg Hell",
        description: "Double Decocted Helles Lager",
        price: "9.25",
        abv: "5.1"
      }
    },
    food: {
      item1: {
        name: "Pickles",
        description: "Seasonal Ontario veg",
        price: "8",
        size: "sm"
      },
      item2: {
        name: "Fried Olives",
        description: "Stuffed w/ ricotta & lemon",
        price: "8",
        size: "sm"
      },
      item3: {
        name: "Pretzel",
        description: "German-style pretzel w/ yellow mustard",
        price: "8",
        size: "sm"
      },
      item4: {
        name: "Cucumber Salad",
        description: "Persian cucumber, red onion, buttermilk dressing, dill",
        price: "10",
        size: "med"
      },
      item5: {
        name: "Potato Salad",
        description: "Potatoes, dijon vinaigrette, celery, herbs",
        price: "10",
        size: "med"
      },
      item6: {
        name: "Fried Squash Rings",
        description: "Delicata squash, whipped ricotta, sage, honey",
        price: "15",
        size: "lrg"
      },
      item7: {
        name: "Stuffed Banana Peppers",
        description: "Blue cheese stuffing, tomato sauce, crostini",
        price: "16",
        size: "lrg"
      },
      item8: {
        name: "Bratwurst",
        description: "Pasture Butchery bratwurst on a bun w/ sauerkraut, onion, pickled jalapeno (veg option available)",
        price: "16",
        size: "lrg"
      },
      item9: {
        name: "Pasture Burger",
        description: "Pasture Butchery ground chuck, raclette, onion, lettuce, horseradish remoulade, brioche bun",
        price: "18",
        size: "lrg"
      }
    },
    nonAlc: {
      item1: {
        name: "Barbet sparkling water",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "4"
      },
      item2: {
        name: "Item 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "3"
      },
      item3: {
        name: "Item 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "5"
      },
    },
    wineSeltzersEtc: {
      item1: {
        name: "Item 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "20",
        abv: "8"
      },
      item2: {
        name: "Item 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "40",
        abv: "12"
      },
      item3: {
        name: "Item 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        price: "60",
        abv: "14"
      },
    },
  });

  // initial events
  const [ events, setEvents ] = useState([]);

  // fetch hours from Strapi CMS
  const fetchHours = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/schedules`);
    const newHours = await response.json();
    let hoursData = newHours.data[0].attributes;
    let taproomHours = {};

    if (hours) {

      if (hoursData.mon_service === 'closed') {
        taproomHours.Mon = "Closed";
      } else if ((hoursData.mon_service === 'open') && hoursData.mon_start && hoursData.mon_end) {
        taproomHours.Mon = parseTime("time", hoursData.mon_start) + `–` + parseTime("time", hoursData.mon_end)
      }

      if (hoursData.tues_service === 'closed') {
        taproomHours.Tues = "Closed";
      } else if ((hoursData.tues_service === 'open') && hoursData.tues_start && hoursData.tues_end) {
        taproomHours.Tues = parseTime("time", hoursData.tues_start) + `–` + parseTime("time", hoursData.tues_end)
      }

      if (hoursData.weds_service === 'closed') {
        taproomHours.Weds = "Closed";
      } else if ((hoursData.weds_service === 'open') && hoursData.weds_start && hoursData.weds_end) {
        taproomHours.Weds = parseTime("time", hoursData.weds_start) + `–` + parseTime("time", hoursData.weds_end)
      }
      
      if (hoursData.thurs_service === 'closed') {
        taproomHours.Thurs = "Closed";
      } else if ((hoursData.thurs_service === 'open') && hoursData.thurs_start && hoursData.thurs_end) {
        taproomHours.Thurs = parseTime("time", hoursData.thurs_start) + `–` + parseTime("time", hoursData.thurs_end)
      }

      if (hoursData.fri_service === 'closed') {
        taproomHours.Fri = "Closed";
      } else if ((hoursData.fri_service === 'open') && hoursData.fri_start && hoursData.fri_end) {
        taproomHours.Fri = parseTime("time", hoursData.fri_start) + `–` + parseTime("time", hoursData.fri_end)
      }

      if (hoursData.sat_service === 'closed') {
        taproomHours.Sat = "Closed";
      } else if ((hoursData.sat_service === 'open') && hoursData.sat_start && hoursData.sat_end) {
        taproomHours.Sat = parseTime("time", hoursData.sat_start) + `–` + parseTime("time", hoursData.sat_end)
      }

      if (hoursData.sun_service === 'closed') {
        taproomHours.Sun = "Closed";
      } else if ((hoursData.sun_service === 'open') && hoursData.sun_start && hoursData.sun_end) {
        taproomHours.Sun = parseTime("time", hoursData.sun_start) + `–` + parseTime("time", hoursData.sun_end)
      }
    }

    setHours(taproomHours);
  };

  // fetch menus from Strapi CMS
  const fetchMenus = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/beer-menus`);
    let newMenus = await response.json();
    let menuData = newMenus.data[0].attributes;
    let formattedMenus = {
      beers: {
        beer1: {},
        beer2: {},
        beer3: {},
        beer4: {}
      },
    };

    if (menuData.beer1_name) {
      formattedMenus.beers.beer1 = {
        name: menuData.beer1_name,
        description: menuData.beer1_description,
        price: menuData.beer1_price,
        abv: menuData.beer1_abv,
      }
    }

    if (menuData.beer2_name) {
      formattedMenus.beers.beer2 = {
        name: menuData.beer2_name,
        description: menuData.beer2_description,
        price: menuData.beer2_price,
        abv: menuData.beer2_abv,
      }
    }

    if (menuData.beer3_name) {
      formattedMenus.beers.beer3 = {
        name: menuData.beer3_name,
        description: menuData.beer3_description,
        price: menuData.beer3_price,
        abv: menuData.beer3_abv,
      }
    }

    if (menuData.beer4_name) {
      formattedMenus.beers.beer4 = {
        name: menuData.beer4_name,
        description: menuData.beer4_description,
        price: menuData.beer4_price,
        abv: menuData.beer4_abv,
      }
    }

    setMenus(formattedMenus);
  };

  // fetch events from Strapi CMS
  const fetchEvents = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/events`);
    let newEvents = await response.json();
    let eventsData = newEvents.data[0].attributes;
    let formattedEvents = [];

    if (eventsData.event1_title) {
        let event1 = {
            title: eventsData.event1_title,
            date: parseDate(eventsData.event1_date),
            time: parseTime("datetime", eventsData.event1_date)
        }
        formattedEvents.push(event1)
    }

    if (eventsData.event2_title) {
        let event2 = {
            title: eventsData.event2_title,
            date: parseDate(eventsData.event2_date),
            time: parseTime("datetime", eventsData.event2_date)
        }
        formattedEvents.push(event2)
    }

    if (eventsData.event3_title) {
        let event3 = {
            title: eventsData.event3_title,
            date: parseDate(eventsData.event3_date),
            time: parseTime("datetime", eventsData.event3_date)
        }
        formattedEvents.push(event3)
    }

    if (eventsData.event4_title) {
        let event4 = {
            title: eventsData.event4_title,
            date: parseDate(eventsData.event4_date),
            time: parseTime("datetime", eventsData.event4_date)
        }
        formattedEvents.push(event4)
    }

    let sortedEvents = formattedEvents.sort((a, b) => {
       return a.date > b.date;
    });

    setEvents(sortedEvents);
  };

  // fetch data and reset on page load
  useEffect(() => {

    fetchHours();
    // fetchMenus();
    fetchEvents();

    window.scrollTo({top: 0});
    
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
        <StrapiContext.Provider value={{ hours: hours, menus: menus, events: events, currentDate: parseDate(new Date()) }}>
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

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
  }

  // error page return
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{errorStatus + ` | True History Brewing`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <main className="route-error">
            <h1>Unexpected Error ({errorStatus})</h1>
            <h2>Looks like you took a wrong turn!</h2>
            <Link to="/home" className='button button-tertiary'>
              Go back to the homepage
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
