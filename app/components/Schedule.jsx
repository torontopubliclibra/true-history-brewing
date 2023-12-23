import { useContext } from 'react';
import { StrapiContext } from '../root';
import diamond from './../../public/assets/icons/diamond.svg';

export function Schedule() {

    const { schedule } = useContext(StrapiContext);
  
    function convertTimeToAmPm(time) {
      
      const [hours, minutes] = time.split(':');
      let formattedTime = '';
  
      if (hours > 12) {
        formattedTime = `${hours - 12}:${minutes}pm`;
      } else if (hours === '12') {
        formattedTime = `${hours}:${minutes}pm`;
      } else if (hours === '00') {
        formattedTime = `12:${minutes}am`;
      } else {
        formattedTime = `${hours}:${minutes}am`;
      }
  
      return formattedTime;
    }
  
    let taproomHours = {
      Mon: "Closed",
      Tues: "4:00pm–11:00pm",
      Weds: "4:00pm–11:00pm",
      Thurs: "4:00pm–11:00pm",
      Fri: "12:00pm–12:00am",
      Sat: "12:00pm–12:00am",
      Sun: "12:00pm–10:00pm"
    };
  
    if (schedule) {

      if (schedule.mon_service === 'closed') {
        taproomHours.Mon = "Closed";
      } else if ((schedule.mon_service === 'open') && schedule.mon_start && schedule.mon_end) {
        taproomHours.Mon = convertTimeToAmPm(schedule.mon_start) + `–` + convertTimeToAmPm(schedule.mon_end)
      }

      if (schedule.tues_service === 'closed') {
        taproomHours.Tues = "Closed";
      } else if ((schedule.tues_service === 'open') && schedule.tues_start && schedule.tues_end) {
        taproomHours.Tues = convertTimeToAmPm(schedule.tues_start) + `–` + convertTimeToAmPm(schedule.tues_end)
      }

      if (schedule.weds_service === 'closed') {
        taproomHours.Weds = "Closed";
      } else if ((schedule.weds_service === 'open') && schedule.weds_start && schedule.weds_end) {
        taproomHours.Weds = convertTimeToAmPm(schedule.weds_start) + `–` + convertTimeToAmPm(schedule.weds_end)
      }
      
      if (schedule.thurs_service === 'closed') {
        taproomHours.Thurs = "Closed";
      } else if ((schedule.thurs_service === 'open') && schedule.thurs_start && schedule.thurs_end) {
        taproomHours.Thurs = convertTimeToAmPm(schedule.thurs_start) + `–` + convertTimeToAmPm(schedule.thurs_end)
      }

      if (schedule.fri_service === 'closed') {
        taproomHours.Fri = "Closed";
      } else if ((schedule.fri_service === 'open') && schedule.fri_start && schedule.fri_end) {
        taproomHours.Fri = convertTimeToAmPm(schedule.fri_start) + `–` + convertTimeToAmPm(schedule.fri_end)
      }

      if (schedule.sat_service === 'closed') {
        taproomHours.Sat = "Closed";
      } else if ((schedule.sat_service === 'open') && schedule.sat_start && schedule.sat_end) {
        taproomHours.Sat = convertTimeToAmPm(schedule.sat_start) + `–` + convertTimeToAmPm(schedule.sat_end)
      }

      if (schedule.sun_service === 'closed') {
        taproomHours.Sun = "Closed";
      } else if ((schedule.sun_service === 'open') && schedule.sun_start && schedule.sun_end) {
        taproomHours.Sun = convertTimeToAmPm(schedule.sun_start) + `–` + convertTimeToAmPm(schedule.sun_end)
      }
    }
  
    let formattedHours = [];
  
    for (let [key, value] of Object.entries(taproomHours)) {
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