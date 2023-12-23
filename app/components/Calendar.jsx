import { useContext } from 'react';
import { StrapiContext } from '../root';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

export function Calendar() {

const { events } = useContext(StrapiContext);

let parseDate = (datetimeString) => {
    const dateTime = new Date(datetimeString);

    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    return `${year}-${month}-${day}`;
}

let parseTime = (datetimeString) => {
    const dateTime = new Date(datetimeString);

    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();

    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;

    return `${hour}:${minute}`;
}

let formattedEvents = [];

if (events.event1_title) {
    let event1 = {
        title: events.event1_title,
        date: parseDate(events.event1_date),
        time: parseTime(events.event1_date)
    }
    formattedEvents.push(event1)
}

if (events.event2_title) {
    let event2 = {
        title: events.event2_title,
        date: parseDate(events.event2_date),
        time: parseTime(events.event2_date)
    }
    formattedEvents.push(event2)
}

if (events.event3_title) {
    let event3 = {
        title: events.event3_title,
        date: parseDate(events.event3_date),
        time: parseTime(events.event3_date)
    }
    formattedEvents.push(event3)
}

if (events.event4_title) {
    let event4 = {
        title: events.event4_title,
        date: parseDate(events.event4_date),
        time: parseTime(events.event4_date)
    }
    formattedEvents.push(event4)
}

return  <div className="calendar">
            <h4>Calendar</h4>
            <FullCalendar
                plugins={[ dayGridPlugin, listPlugin ]}
                initialView="listMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek'
                }}
                buttonIcons={false}
                events={formattedEvents}
            />
        </div>;
}