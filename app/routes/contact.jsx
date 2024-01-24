import { useState } from "react";
import mail from './../../public/assets/icons/mail.svg';

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
    let [ messageDetails, setMessageDetails ] = useState({});
    let [ name, setName ] = useState("");
    let [ email, setEmail ] = useState("");
    let [ message, setMessage ] = useState("");
    let [ businessName, setBusinessName ] = useState("");
    let [ businessAddress, setBusinessAddress ] = useState("");
    let [ eventDate, setEventDate ] = useState("");
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
  
      let newMessageDetails = {
        name: name,
        email: email,
        message: message,
      }
      if (businessName) {
        newMessageDetails.businessName = businessName;
      }
      if (businessAddress) {
        newMessageDetails.businessAddress = businessAddress;
      }
      if (guests) {
        newMessageDetails.guests = guests;
      }
      if (dining) {
        newMessageDetails.dining = dining;
      }
      if (special) {
        newMessageDetails.special = special;
      }

      console.log(newMessageDetails);
      setMessageDetails(newMessageDetails);
  
      // setMessageDetails(newMessageDetails);
      // let response = await fetch("http://localhost:5000/contact", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json;charset=utf-8",
      //   },
      //   body: JSON.stringify(details),
      // });
      
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setBusinessName("");
        setBusinessAddress("");
        setGuests(0);
        setDining(false);
        setSpecial("");
        setSubmitStatus("Sent!");
      }, 1000);

      setTimeout(() => {
        setSubmitStatus("Send email");
      }, 5000);

      // let result = await response.json();
      // alert(result.status);
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
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" /></button>
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
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" /></button>
        </form>
      );
    } else if (contactForm == "events") {
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
            <label htmlFor="date">Event date:</label>
            <input
              type="date"
              id="date"
              min={minDate()}
              max={maxDate()}
              value={eventDate}
              onChange={(event) => handleFieldChange("eventDate", event)}
              required />
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
          <button className="button" type="submit" disabled={submitStatus !== "Send email" ? true : false} >{submitStatus} <img src={mail} className="button-icon" /></button>
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
              <button onClick={() => handleContactChange("events")} className={buttonClass("events")}>
                Event requests
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