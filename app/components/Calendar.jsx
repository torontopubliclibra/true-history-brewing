import { useContext } from 'react';
import { StrapiContext } from '../root';
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
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,listWeek'
                }}
                buttonIcons={false}
                events={events}
            />
        </div>
    );
}