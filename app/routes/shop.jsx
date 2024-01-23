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
    {title: 'Online Shop | True History Brewing'},
    {description: 'Brewing Low & Slow'},
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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
    <div className="recommended-products">
      <h2>{selectedCategory}</h2>
        {/* <h3>Currently under construction</h3> */}
        <div className="recommended-products-grid">
          {collectionProducts.nodes.map((product) => (
            <Link
              key={product.id}
              className="recommended-product"
              to={`/products/${product.handle}`}
            >
              <Image
                data={product.featuredImage}
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

//  if (!collection) return null;
//  const image = collection?.image;
//  return (
//    <Link
//      className="featured-collection"
//      to={`/collections/${collection.handle}`}
//    >
//      {image && (
//        <div className="featured-collection-image">
//          <Image data={image} sizes="100vw" />
//        </div>
//      )}
//      <h1>{collection.title}</h1>
//    </Link>
//  );
}

// /**
//  * @param {{
//  *   collection: FeaturedCollectionFragment;
//  * }}
//  */
// function FeaturedCollection({collection}) {

//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

// /**
//  * @param {{
//  *   products: Promise<RecommendedProductsQuery>;
//  * }}
//  */
// function RecommendedProducts({products}) {
//   return (
//     <div className="recommended-products">
//       <h2>Beers</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {({products}) => (
//             <div className="recommended-products-grid">
//               {products.nodes.map((product) => (
//                 <Link
//                   key={product.id}
//                   className="recommended-product"
//                   to={`/products/${product.handle}`}
//                 >
//                   <Image
//                     data={product.images.nodes[0]}
//                   />
//                   <h4>{product.title}</h4>
//                   <small>
//                     <Money data={product.priceRange.minVariantPrice} />
//                   </small>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//       <br />
//     </div>
//   );
// }

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

// const FEATURED_COLLECTION_QUERY = `#graphql
//   fragment FeaturedCollection on Collection {
//     id
//     title
//     image {
//       id
//       url
//       altText
//       width
//       height
//     }
//     handle
//   }
//   query FeaturedCollection($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...FeaturedCollection
//       }
//     }
//   }
// `;

// const RECOMMENDED_PRODUCTS_QUERY = `#graphql
//   fragment RecommendedProduct on Product {
//     id
//     title
//     handle
//     priceRange {
//       minVariantPrice {
//         amount
//         currencyCode
//       }
//     }
//     images(first: 1) {
//       nodes {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     products(first: 4, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...RecommendedProduct
//       }
//     }
//   }
// `;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
