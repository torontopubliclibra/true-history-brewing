import logo from './../../public/assets/thb-logo.png';
import barSketch from './../../public/assets/bar-sketch.png';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'True History Brewing | Toronto, ON'},
    {description: 'Brewing Low & Slow'},
  ];
};

export default function Homepage() {
  return (
    <>
        <div className="main-heading">
          <img src={logo} className="thb-logo" alt="True History Brewing logo" />
        </div>
        <div className="main-subheading">
          <img src={barSketch} className="bar-sketch" alt="" />
          <h2>Brewing low & slow in Toronto, ON</h2>
        </div>
    </>
  );
};