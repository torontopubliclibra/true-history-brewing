import { useState } from "react";

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Contact | True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {

  let [ contactForm, setContactForm ] = useState("general");
  let [ submitStatus, setSubmitStatus ] = useState('Submit');
  let [ messageDetails, setMessageDetails ] = useState({ 
    name: "",
    email: "",
    message: "",
  });

  let handleContactChange = (form) => {
    setContactForm(form);
  }

  let buttonClass = (button) => {
    if (button == contactForm) {
      return 'button button-primary selected';
    } else {
      return 'button button-primary';
    }
  }

  let handleSubmit = async (event) => {

    event.preventDefault();
    setSubmitStatus("Sending...");

    const { name, email, message } = event.target.elements;
    setMessageDetails({
      name: name.value,
      email: email.value,
      message: message.value,
    });
    // let response = await fetch("http://localhost:5000/contact", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //   },
    //   body: JSON.stringify(details),
    // });
    setSubmitStatus("Submit");
    console.log(messageDetails);
    // let result = await response.json();
    // alert(result.status);
  };

  let ContactForm = () => {
    if (contactForm == "general") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea id="message" required />
          </div>
          <button className="button" type="submit">{submitStatus}</button>
        </form>
      );
    } else if (contactForm == "licensee") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="business-name">Business name:</label>
            <input type="text" id="business-name" required />
          </div>
          <div className="form-field">
            <label htmlFor="business-address">Business address:</label>
            <input type="text" id="business-address" required />
          </div>
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea id="message" required />
          </div>
          <button className="button" type="submit">{submitStatus}</button>
        </form>
      );
    } else if (contactForm == "events") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div className="double-field">
            <div className="small-field">
              <label htmlFor="guests"># of guests:</label>
              <input type="number" id="guests" required />
            </div>
            <div className="small-field">
              <label htmlFor="dining">Dining? Y/N</label>
              <input type="radio" id="dining" required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea id="message" required />
          </div>
          <div className="form-field">
            <label htmlFor="special">Special requests:</label>
            <textarea id="special" required />
          </div>
          <button className="button" type="submit">{submitStatus}</button>
        </form>
      );
    }
  };

  return (
    <>
        <section className="heading contact-heading">
          <h2>Contact</h2>
        </section>
        <section className="contact-content">
          <ul className='contact-nav'>
            <li>
              <button onClick={() => handleContactChange("general")} className={buttonClass("general")}>
                General inquiries
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("events")} className={buttonClass("events")}>
                Event booking
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("licensee")} className={buttonClass("licensee")}>
                Licensees & retailers
              </button>
            </li>
          </ul>
          <ContactForm />
        </section>
    </>
  );
};