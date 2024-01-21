// imports
import { useContext } from 'react';
import { StrapiContext } from '../root';

// asset imports
import diamond from './../../public/assets/icons/diamond.svg';

export function Hours() {

    const { hours } = useContext(StrapiContext);
    let showAsterisk = false;
    let formattedHours = [];

    for (let [key, value] of Object.entries(hours)) {
      let dayHours;
      if (value['service'] === 'closed') {
        dayHours = <li key={key + `-hours`}>
          {key}: <span className='time'>Closed</span>
        </li>
      } else if (value['service'] === 'open') {
        dayHours = <li key={key + `-hours`}>
          {key}: <span className='time'>{value.start} – {value.end}</span>
        </li>
      } else if (value['service'] === 'bottle shop') {
        showAsterisk = true;
        dayHours = <li key={key + `-hours`}>
          {key}: <span className='time'>{value.start} – {value.end}<span className="symbol">*</span></span>
        </li>
      }
      formattedHours.push(dayHours);
    };

    return <div className="hours">
      <h4>Taproom Hours</h4>
      <div className="diamond-border">
        <img src={diamond} className="button-icon" />
        <img src={diamond} className="button-icon" />
        <img src={diamond} className="button-icon" />
        <img src={diamond} className="button-icon" />
        <img src={diamond} className="button-icon" />
      </div>
      <ul className='schedule'>
        { formattedHours }
        { showAsterisk ? <div className="asterisk"><hr/><p><span className="symbol">*</span> bottle shop only</p></div> : null }
      </ul>
    </div>;

}