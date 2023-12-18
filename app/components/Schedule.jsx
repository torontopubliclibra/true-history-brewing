import {useState, useEffect} from 'react';

export function Schedule() {

    const [schedule, setSchedule] = useState({});

    useEffect(() => {
  
      const fetchSchedules = async () => {
        const response = await fetch(`https://thb-data-3vd2n.ondigitalocean.app/api/schedules`);
        const newSchedule = await response.json();
        setSchedule(newSchedule.data[0].attributes);
      };
  
      fetchSchedules();
    }, []);
  
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
      Tues: "4:00pm-11:00pm",
      Weds: "4:00pm-11:00pm",
      Thurs: "4:00pm-11:00pm",
      Fri: "12:00pm-12:00am",
      Sat: "12:00pm-12:00am",
      Sun: "12:00pm-10:00pm"
    };
  
    if (schedule.publishedAt) {
  
      taproomHours = {
        Mon: "Closed",
        Tues: convertTimeToAmPm(schedule.tues_start) + `-` + convertTimeToAmPm(schedule.tues_end),
        Weds: convertTimeToAmPm(schedule.weds_start) + `-` + convertTimeToAmPm(schedule.weds_end),
        Thurs: convertTimeToAmPm(schedule.thurs_start) + `-` + convertTimeToAmPm(schedule.thurs_end),
        Fri: convertTimeToAmPm(schedule.fri_start) + `-` + convertTimeToAmPm(schedule.fri_end),
        Sat: convertTimeToAmPm(schedule.sat_start) + `-` + convertTimeToAmPm(schedule.sat_end),
        Sun: convertTimeToAmPm(schedule.sun_start) + `-` + convertTimeToAmPm(schedule.sun_end)
      };
    }
  
    let formattedHours = [];
  
    for (let [key, value] of Object.entries(taproomHours)) {
      formattedHours.push(<li>{key}: {value}</li>);
    };

    return <div className="hours">
        <p>Hours this Week:</p>
        <ul>
        {formattedHours}
        </ul>
    </div>;

}