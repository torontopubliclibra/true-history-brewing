/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Bottle Shop | True History Brewing'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {
  return (
    <>
        <section className="heading bottle-shop-heading">
          <h2>Bottle Shop</h2>
        </section>
    </>
  );
};