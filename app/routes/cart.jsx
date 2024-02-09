import { redirect } from '@shopify/remix-oxygen';

export async function loader() {
  return redirect('/shop#cart-aside');
}

export async function action() {
  return redirect('/shop#cart-aside');
}