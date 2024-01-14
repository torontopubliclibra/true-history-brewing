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
  return (
    <>
        <section className="heading contact-heading">
          <h2>Contact</h2>
        </section>
        <section className="contact-content">
        </section>
    </>
  );
};