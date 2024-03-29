// imports
import { useContext } from 'react';
import { StrapiContext } from '../root';

// component imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

export function Calendar() {

    const { events } = useContext(StrapiContext);

    return (
        <div className="calendar">
            <h4>Calendar</h4>
            <FullCalendar
                plugins={[ dayGridPlugin, listPlugin ]}
                initialView="listMonth"
                headerToolbar={{
                    left: 'prev,today,next',
                    center: 'title',
                    right: 'dayGridMonth,listMonth'
                }}
                height={"auto"}
                buttonIcons={false}
                buttonText={{
                    month: 'Calendar',
                    list: 'List',
                    today: 'This Month'
                  }}
                events={events}
            />
        </div>
    );
}