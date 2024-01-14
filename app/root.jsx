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
import { Layout } from '~/components/Layout';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import favicon from '../public/favicon.svg';
import icon from '../public/assets/thb-icon.png';

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

export function parseTime(datetimeString) {
  const dateTime = new Date(datetimeString);

  let hour = dateTime.getHours();
  let minute = dateTime.getMinutes();

  if (hour < 10) hour = '0' + hour;
  if (minute < 10) minute = '0' + minute;

  return `${hour}:${minute}`;
}

export function parseDate(datetimeString) {
  const dateTime = new Date(datetimeString);

  let year = dateTime.getFullYear();
  let month = dateTime.getMonth() + 1;
  let day = dateTime.getDate();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  return `${year}-${month}-${day}`;
}

export function convertTimeToAmPm(time) {
      
  const [hours, minutes] = time.split(':');
  let formattedTime = '';

  if (hours > 12) {
    formattedTime = `${hours - 12}:${minutes}pm`;
  } else if (hours === '12') {
    formattedTime = `${hours}:${minutes}pm`;
  } else if (hours === '00') {
    formattedTime = `12:${minutes}am`;
  } else {
    formattedTime = `${hours}:${minutes}am`;
  }

  return formattedTime;
}

export const StrapiContext = createContext(null);

export default function App() {
  const nonce = useNonce();
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const location = useLocation();

  let [asideOpen, setAsideOpen] = useState({
    value: false,
    aside: "",
  });

  let [bodyTags, setBodyTags] = useState("");

  const updateAsideOpen = (aside, value) => {

    if (aside === "menu") {
      if (value === true) {
        setAsideOpen({
          value: true,
          aside: "menu"
        });
        window.location.href = "#mobile-menu-aside";
        setBodyTags("aside-open menu-open");
      } else {
        setAsideOpen({
          value: false,
          aside: ""
        });
        window.location.href = "#";
        setBodyTags("");
      }
    } else if (aside === "cart") {
      if (value === true) {
        setAsideOpen({
          value: true,
          aside: "cart"
        });
        window.location.href = "#cart-aside";
        setBodyTags("aside-open cart-open");
      } else {
        setAsideOpen({
          value: false,
          aside: ""
        });
        window.location.href = "#";
        setBodyTags("");
      }
    } else {
      if (value === false) {
        setAsideOpen({
          value: false,
          aside: ""
        });
        window.location.href = "/home#";
        setBodyTags("");
      }
    }
  }

  const [schedule, setSchedule] = useState({
    Mon: "Closed",
    Tues: "4:00pm–11:00pm",
    Weds: "4:00pm–11:00pm",
    Thurs: "4:00pm–11:00pm",
    Fri: "12:00pm–12:00am",
    Sat: "12:00pm–12:00am",
    Sun: "12:00pm–10:00pm"
  });
  const [menus, setMenus] = useState({
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
    }
  });
  const [events, setEvents] = useState([]);

  const fetchSchedules = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/schedules`);
    const newSchedule = await response.json();
    let scheduleData = newSchedule.data[0].attributes;
    let taproomHours = {};

    if (schedule) {

      if (scheduleData.mon_service === 'closed') {
        taproomHours.Mon = "Closed";
      } else if ((scheduleData.mon_service === 'open') && scheduleData.mon_start && scheduleData.mon_end) {
        taproomHours.Mon = convertTimeToAmPm(scheduleData.mon_start) + `–` + convertTimeToAmPm(scheduleData.mon_end)
      }

      if (scheduleData.tues_service === 'closed') {
        taproomHours.Tues = "Closed";
      } else if ((scheduleData.tues_service === 'open') && scheduleData.tues_start && scheduleData.tues_end) {
        taproomHours.Tues = convertTimeToAmPm(scheduleData.tues_start) + `–` + convertTimeToAmPm(scheduleData.tues_end)
      }

      if (scheduleData.weds_service === 'closed') {
        taproomHours.Weds = "Closed";
      } else if ((scheduleData.weds_service === 'open') && scheduleData.weds_start && scheduleData.weds_end) {
        taproomHours.Weds = convertTimeToAmPm(scheduleData.weds_start) + `–` + convertTimeToAmPm(scheduleData.weds_end)
      }
      
      if (scheduleData.thurs_service === 'closed') {
        taproomHours.Thurs = "Closed";
      } else if ((scheduleData.thurs_service === 'open') && scheduleData.thurs_start && scheduleData.thurs_end) {
        taproomHours.Thurs = convertTimeToAmPm(scheduleData.thurs_start) + `–` + convertTimeToAmPm(scheduleData.thurs_end)
      }

      if (scheduleData.fri_service === 'closed') {
        taproomHours.Fri = "Closed";
      } else if ((scheduleData.fri_service === 'open') && scheduleData.fri_start && scheduleData.fri_end) {
        taproomHours.Fri = convertTimeToAmPm(scheduleData.fri_start) + `–` + convertTimeToAmPm(scheduleData.fri_end)
      }

      if (scheduleData.sat_service === 'closed') {
        taproomHours.Sat = "Closed";
      } else if ((scheduleData.sat_service === 'open') && scheduleData.sat_start && scheduleData.sat_end) {
        taproomHours.Sat = convertTimeToAmPm(scheduleData.sat_start) + `–` + convertTimeToAmPm(scheduleData.sat_end)
      }

      if (scheduleData.sun_service === 'closed') {
        taproomHours.Sun = "Closed";
      } else if ((scheduleData.sun_service === 'open') && scheduleData.sun_start && scheduleData.sun_end) {
        taproomHours.Sun = convertTimeToAmPm(scheduleData.sun_start) + `–` + convertTimeToAmPm(scheduleData.sun_end)
      }
    }

    setSchedule(taproomHours);
  };

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

  const fetchEvents = async () => {
    const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/events`);
    let newEvents = await response.json();
    let eventsData = newEvents.data[0].attributes;
    let formattedEvents = [];

    if (eventsData.event1_title) {
        let event1 = {
            title: eventsData.event1_title,
            date: parseDate(eventsData.event1_date),
            time: parseTime(eventsData.event1_date)
        }
        formattedEvents.push(event1)
    }

    if (eventsData.event2_title) {
        let event2 = {
            title: eventsData.event2_title,
            date: parseDate(eventsData.event2_date),
            time: parseTime(eventsData.event2_date)
        }
        formattedEvents.push(event2)
    }

    if (eventsData.event3_title) {
        let event3 = {
            title: eventsData.event3_title,
            date: parseDate(eventsData.event3_date),
            time: parseTime(eventsData.event3_date)
        }
        formattedEvents.push(event3)
    }

    if (eventsData.event4_title) {
        let event4 = {
            title: eventsData.event4_title,
            date: parseDate(eventsData.event4_date),
            time: parseTime(eventsData.event4_date)
        }
        formattedEvents.push(event4)
    }

    let sortedEvents = formattedEvents.sort((a, b) => {
       return a.date > b.date;
    });

    setEvents(sortedEvents);
  };

  useEffect(() => {

    if (location.pathname === '/') {
      setBodyTags("landing");
    } else {
      setBodyTags("");
    }

    // fetchSchedules();
    // fetchMenus();
    fetchEvents();

    setAsideOpen({
      value: false,
      aside: ""
    })

    window.scrollTo({top: 0});

  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <style data-fullcalendar />
        <Links />
      </head>
      <body className={bodyTags}>
        <StrapiContext.Provider value={{ schedule: schedule, menus: menus, events: events, currentDate: parseDate(new Date()) }}>
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
            <h1>{errorMessage} ({errorStatus} error)</h1>
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
