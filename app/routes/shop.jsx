// imports
import { Await, useLoaderData, Link } from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { useState, useEffect, Suspense } from 'react';
import { Image, getPaginationVariables, Money } from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing | Online shop'},
    {description: 'Brewery and taproom in Toronto, Ontario'},
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({ context, request }) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  const collectionHandles = collections.nodes.map((collection) => collection.handle);

  const collectionTitles = collections.nodes.map((collection) => collection.title);

  const collectionData = await Promise.all(
    collectionHandles.map((handle) =>
      context.storefront.query(COLLECTION_QUERY, {
        variables: { handle, ...paginationVariables },
      })
    )
  );

  return json({collectionTitles, collectionData});
}

export default function Homepage() {

  /** @type {LoaderReturnData} */
  const {collectionTitles, collectionData} = useLoaderData();

  let [ shopCollections, setShopCollections ] = useState({});
  let [ shopCategories, setShopCategories ] = useState(["Beers"]);
  let [ selectedCategory, setSelectedCategory ] = useState("Beers");

  useEffect(() => {

    if (collectionData !== shopCollections) {
      setShopCollections(collectionData);
    }

    if (shopCategories !== collectionTitles) {
      setShopCategories(collectionTitles);
    }

  }, []);

  useEffect(() => {

    let newCategories = collectionTitles;
    newCategories.sort((a, b) => a === "Beers" ? -1 : b === "Beers" ? 1 : 0);

    setShopCategories(newCategories);

  }, [collectionTitles]);

  let handleCategoryChange = (category) => {
    setSelectedCategory(category);
  }

  let buttonClass = (button) => {
    if (button == selectedCategory) {
      return 'button button-primary selected';
    } else {
      return 'button button-primary';
    }
  }

  let shopNavItems = () => {
    let navItems = [];

    if (shopCategories) {
      for (let i = 0; i < shopCategories.length; i++) {
        let category = shopCategories[i];
        navItems.push(
          <li key={category}>
            <button onClick={() => handleCategoryChange(category)} className={buttonClass(category)}>
              {category}
            </button>
          </li>
        );
      }
    }

    return navItems;
  }

  return (
    <>
      <section className="heading shop-heading">
        <h2>Online Shop</h2>
      </section>
      <section className="shop-nav">
        <ul>
          {shopNavItems()}
        </ul>
      </section>
      <section className="shop">
        <SelectedCollection selectedCategory={selectedCategory} collectionData={collectionData} />
      </section>
      <section className="shop-disclaimers">
        <div className="text-box">
          <h3>Delivery & Pickup Conditions</h3>
          <p>Products are shipped via <a href="https://shipnoble.com/" target="_blank">Ship Noble</a>. Minimum orders of $15. A $10 flat delivery rate applies for all orders under $100. Deliveries are fulfilled within 5 business days. Pickup is available within 24 hours at True History Brewing (1154 St. Clair Avenue West, Toronto, Ontario).</p>
        </div>
      </section>
    </>
  );
}

function SelectedCollection({selectedCategory, collectionData}) {

  let collectionProducts = {};

  for (let i = 0; i < collectionData.length; i++) {
    let collection = collectionData[i].collection;
    if (collection.title === selectedCategory) {
      collectionProducts = collection.products;
    }
  }

  console.log(collectionProducts)

  return (
    <div className="collection-products">
      <h2>{selectedCategory}</h2>
      <hr/>
        {/* <h3>Currently under construction</h3> */}
        <div className="collection-products-grid">
          {collectionProducts.nodes.map((product) => (
            <Link
              key={product.id}
              className="collection-product"
              to={`/products/${product.handle}`}
            >
              <Image
                data={product.featuredImage}
                size={500}
              />
              <h4>{product.title}</h4>
              <small>
                <Money data={product.priceRange.minVariantPrice} />
              </small>
            </Link>
          ))}
        </div>
      <br />
    </div>
  )
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
