/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Retail | True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {
  return (
    <>
        <section className="heading retail-heading">
          <h2>Retail</h2>
        </section>
        <section className="retail-content">
        </section>
    </>
  );
};