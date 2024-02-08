// import fetch from 'node-fetch';

// export default action = async ({ request }) => {
//   console.log('Action function called');

//   const formData = await request.formData();
//   const body = new URLSearchParams();
//   for (let [name, value] of formData) {
//     body.append(name, value);
//   }

//   console.log('Sending request to Mailchimp API with body:', body.toString());

//   const response = await fetch('https://beer.us17.list-manage.com/subscribe/post?u=55337f4b502b69807ffce3fb4&id=3474a4e3a4&f_id=009949e0f0', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body,
//   });

//   console.log('Received response from Mailchimp API');

//   if (!response.ok) {
//     console.error('Received error response from Mailchimp API:', response.status, await response.text());
//   } else {
//     console.log('Received successful response from Mailchimp API');
//   }

//   const data = await response.text();
//   return json(data, response.status);
// };