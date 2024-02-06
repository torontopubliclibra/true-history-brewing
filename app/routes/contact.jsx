import { useState } from "react";
import { send } from 'emailjs-com';
import mail from './../../public/assets/icons/mail.svg';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing | Contact'},
    {description: 'Brewery and taproom in Toronto, Ontario'},
  ];
};

export default function Homepage() {

  let [ contactForm, setContactForm ] = useState("general");

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

  let minDate = () => {
    let today = new Date();
    let dd = today.getDate() + 2;
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if ( dd < 10 ){ dd = '0' + dd}
    if( mm < 10 ){ mm= '0' + mm }
    return yyyy + '-' + mm + '-' + dd;
  }

  let maxDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear() + 1;
    if ( dd < 10 ){ dd = '0' + dd}
    if( mm < 10 ){ mm= '0' + mm }
    return yyyy + '-' + mm + '-' + dd;
  }

  let ContactForm = () => {

    let [ submitStatus, setSubmitStatus ] = useState('Send email');
    let [ name, setName ] = useState("");
    let [ email, setEmail ] = useState("");
    let [ message, setMessage ] = useState("");
    let [ businessName, setBusinessName ] = useState("");
    let [ businessAddress, setBusinessAddress ] = useState("");
    let [ eventDate, setEventDate ] = useState("");
    let [ eventTime, setEventTime ] = useState("");
    let [ guests, setGuests ] = useState(0);
    let [ dining, setDining ] = useState(false);
    let [ special, setSpecial ] = useState("");

    const handleFieldChange = (field, event) => {

      if (field == "name") {
        setName(event.target.value);
      }
      if (field == "email") {
        setEmail(event.target.value);
      }
      if (field == "message") {
        setMessage(event.target.value);
      }
      if (field == "businessName") {
        setBusinessName(event.target.value);
      }
      if (field == "businessAddress") {
        setBusinessAddress(event.target.value);
      }
      if (field == "eventDate") {
        setEventDate(event.target.value);
      }
      if (field == "eventTime") {
        setEventTime(event.target.value);
      }
      if (field == "guests") {

        let guestValue = event.target.value;

        if (guestValue.length > 1 && guestValue.startsWith("0")) {
          guestValue = guestValue.substring(1);
        } else if (guestValue > 40) {
          guestValue = 40;
        }

        setGuests(guestValue);
      }
      if (field == "dining") {
        if (dining) {
          setDining(false);
          console.log(false)
        } else {
          setDining(true);
          console.log(true)
        }
      }
      if (field == "special") {
        setSpecial(event.target.value);
      }
    };

    let handleSubmit = (event) => {

      event.preventDefault();
      setSubmitStatus("Sending...");

      let newMessage = "";
      
      let diningStatus = "";

      if (dining) {
        diningStatus = " (dining)";
      }

      if (contactForm == "general") {

        newMessage = 
        `Name: ${name}\n
        Email address: ${email}\n
        Message: ${message}`

      } else if (contactForm == "licensee") {

        newMessage = 
        `Business name: ${businessName}\n
        Business address: ${businessAddress}\n
        Name: ${name}\n
        Email address: ${email}\n
        Message: ${message}`

      } else if (contactForm == "bookings") {

        newMessage = 
        `Name: ${name}\n
        Email address: ${email}\n
        Date: ${eventDate}\n
        Time: ${eventTime}\n
        Number of guests: ${guests}${diningStatus}\n
        Special requests: ${special}\n
        Message: ${message}`

      }

      let messageDetails = {
        name: name,
        email: email,
        message: newMessage,
        message_type: contactForm,
      }

      send(
        'service_6zkrsuq',
        'template_d5dmvqm',
        messageDetails,
        '_7uAM_thaYesriP1U'
      )
      .then((response) => {
        setName("");
        setEmail("");
        setMessage("");
        setBusinessName("");
        setBusinessAddress("");
        setGuests(0);
        setDining(false);
        setSpecial("");
        setSubmitStatus("Sent!");
        console.log('Sent!', response.status, response.text);
      })
      .catch((err) => {
        console.log('Failed to send!', err);
      });

      setTimeout(() => {
        setSubmitStatus("Send email");
      }, 5000);
    };

    if (contactForm == "general") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => handleFieldChange("name", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => handleFieldChange("email", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => handleFieldChange("message", event)}
              required />
          </div>
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" alt="email icon" /></button>
        </form>
      );
    } else if (contactForm == "licensee") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="businessName">Business name:</label>
            <input
              type="text"
              id="businessName"
              value={businessName}
              onChange={(event) => handleFieldChange("businessName", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="businessAddress">Business address:</label>
            <input
            type="text"
            id="businessAddress"
            value={businessAddress}
            onChange={(event) => handleFieldChange("businessAddress", event)}
            required />
          </div>
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => handleFieldChange("name", event)}
            required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => handleFieldChange("email", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => handleFieldChange("message", event)}
              required />
          </div>
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" alt="email icon" /></button>
        </form>
      );
    } else if (contactForm == "bookings") {
      return (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => handleFieldChange("name", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => handleFieldChange("email", event)}
              required />
          </div>
          <div className="double-field">
            <div className="medium-field">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                min={minDate()}
                max={maxDate()}
                value={eventDate}
                onChange={(event) => handleFieldChange("eventDate", event)}
                required />
            </div>
            <div className="small-field">
              <label htmlFor="date">Time:</label>
              <input
                type="time"
                id="time"
                min="12:00"
                max="22:00"
                value={eventTime}
                onChange={(event) => handleFieldChange("eventTime", event)}
                required />
            </div>
          </div>
          <div className="double-field">
            <div className="medium-field">
              <label htmlFor="guests"># of guests:</label>
              <input
                type="number"
                id="guests"
                max="40"
                value={guests}
                onChange={(event) => handleFieldChange("guests", event)}
                required />
            </div>
            <div className="small-field">
              <label htmlFor="dining" className="radio">
                Dining?
                { !dining
                  ? <input
                      type="radio"
                      id="dining"
                      value={dining}
                      onClick={(event) => handleFieldChange("dining", event)}
                      required
                    />
                  : <input
                      type="radio"
                      id="dining"
                      className="selected"
                      value={dining}
                      onClick={(event) => handleFieldChange("dining", event)}
                      required
                    />
                  }
                <input
                  type="radio"
                  id="dining"
                  value={dining}
                  onChange={(event) => handleFieldChange("dining", event)}
                  required
                />
                <span class="radio-button"></span>
              </label>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => handleFieldChange("message", event)}
              required />
          </div>
          <div className="form-field">
            <label htmlFor="special">Special requests:</label>
            <textarea
              id="special"
              value={special}
              onChange={(event) => handleFieldChange("special", event)}
              required />
          </div>
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" alt="email icon" /></button>
        </form>
      );
    }
  };

  return (
    <>
        <section className="heading contact-heading">
          <h2>Contact</h2>
        </section>
        <section className="contact-nav">
        <ul>
            <li>
              <button onClick={() => handleContactChange("general")} className={buttonClass("general")}>
                General inquiries
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("bookings")} className={buttonClass("bookings")}>
                Booking requests
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("licensee")} className={buttonClass("licensee")}>
                Licensees & retailers
              </button>
            </li>
          </ul>
      </section>
        <section className="contact-content">
          <ContactForm />
        </section>
    </>
  );
};