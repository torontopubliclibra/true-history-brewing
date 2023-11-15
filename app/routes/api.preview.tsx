import {LoaderFunction, redirect} from '@shopify/remix-oxygen'

export const loader: LoaderFunction = async function ({request, context}) {
  const {env, sanity} = context
  const {searchParams} = new URL(request.url)

  if (
    !sanity.preview?.session ||
    !searchParams.has('secret') ||
    searchParams.get('secret') !== env.SANITY_PREVIEW_SECRET
  ) {
    throw new Response('Invalid secret', {
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  sanity.preview.session.set('projectId', env.SANITY_PROJECT_ID)

  return redirect(`/`, {
    status: 307,
    headers: {
      'Set-Cookie': await sanity.preview.session.commit(),
    },
  })
}