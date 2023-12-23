import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'

export function Calendar() {

return  <div className="calendar">
            <h4>Calendar</h4>
            <FullCalendar
                plugins={[ dayGridPlugin, listPlugin ]}
                initialView="listMonth"
                events={[
                    { title: 'Trivia night', date: '2024-01-09' }
                    ]}
            />
        </div>;
}