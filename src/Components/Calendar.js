import {useState, useEffect} from 'react';
import moment from 'moment';

export default function Calendar(props) {
    const [value, setValue] = useState(moment());
    const [calendar, setCalendar] = useState([]);


    const monthStart =  value.clone().startOf("month");
    const monthEnd = value.clone().endOf("month")

    const startDay = value.clone().startOf("month").startOf("week");
    const endDay = value.clone().endOf("month").endOf("week")


    useEffect(() => {
        const day = startDay.clone().subtract(1, 'day');
        const calendarClone = [];
        while(day.isBefore(endDay)) {
            calendarClone.push(
                Array(7).fill(0).map(() => day.add(1, 'day').clone())
            );
        }
        setCalendar(calendarClone)
    }, [value])
    
    

    const monthYear = () => {
        return `${value.format("MMMM")} ${value.format("YYYY")}`
    }


    return (
        <div id="calendar">
            <h2>calendar</h2>
            <div className="calendar-container">
                <div className="calendar-header">{monthYear()}</div>
                <div className="calendar-inner">
                { calendar.map((week, i) => (
                    <div className="week" key={i}>
                        {week.map((day, i) => (
                            <div
                                onClick={()=> setValue(day)} 
                                className={(day._d < monthStart._d) 
                                        ? 'day not-month' : day._d > monthEnd._d
                                            ? 'day not-month' : 'day same-month'}
                                key={i}>
                                <div
                                    className={value.isSame(day, "day") ? 'today' : ''}
                                    >
                                    {day.format("D").toString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}