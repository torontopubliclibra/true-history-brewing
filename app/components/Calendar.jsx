import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export function Calendar() {

return  <div className="calendar">
            <h4>Calendar</h4>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={[
                    { title: 'Trivia night', date: '2024-01-09' }
                    ]}
            />
        </div>;
}