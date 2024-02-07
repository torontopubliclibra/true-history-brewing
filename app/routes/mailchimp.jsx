import fetch from 'node-fetch';

export let action = async ({ request }) => {
  const formData = await request.formData();
  const body = new URLSearchParams();
  for (let [name, value] of formData) {
    body.append(name, value);
  }

  const response = await fetch('https://beer.us17.list-manage.com/subscribe/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.text();
  return json(data, response.status);
};