import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {

  const {initialNonce, NonceProvider} = createContentSecurityPolicy();

  function updateContentSecurityPolicy(initialNonce) {
    const nonce = initialNonce.toString('base64');

    const csp = `default-src 'self'; connect-src 'self' https://thb-data-3vd2n.ondigitalocean.app; script-src 'self' 'unsafe-inline' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline';`;
  
    return {
      initialNonce,
      header: {
        'Content-Security-Policy': csp,
      },
    };
  }

  const {header, nonce} = updateContentSecurityPolicy(initialNonce);

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
