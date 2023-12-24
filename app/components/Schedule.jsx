import { useContext } from 'react';
import { StrapiContext } from '../root';
import diamond from './../../public/assets/icons/diamond.svg';

export function Schedule() {

    const { schedule } = useContext(StrapiContext);
  
    let formattedHours = [];
  
    for (let [key, value] of Object.entries(schedule)) {
      formattedHours.push(
        <li key={key}>
          {key}: <span className='time'>{value}</span>
        </li>
      );
    };

    return <div className="hours">
              <h4>Hours this Week</h4>
              <div className="diamond-border">
                <img src={diamond} className="button-icon" />
                <img src={diamond} className="button-icon" />
                <img src={diamond} className="button-icon" />
                <img src={diamond} className="button-icon" />
                <img src={diamond} className="button-icon" />
              </div>
              <ul className='schedule'>
              {formattedHours}
              </ul>
            </div>;

}