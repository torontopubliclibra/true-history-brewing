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

  return (
    <>
        <section className="heading contact-heading">
          <h2>Contact</h2>
        </section>
        <section className="contact-content">
          <ul className='contact-nav'>
            <li>
              <button onClick={() => handleContactChange("general")} className={buttonClass("general")}>
                General
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("licensee")} className={buttonClass("licensee")}>
                Licensees
              </button>
            </li>
            <li>
              <button onClick={() => handleContactChange("events")} className={buttonClass("events")}>
                Event booking
              </button>
            </li>
          </ul>
        </section>
    </>
  );
};