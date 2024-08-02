import { useState, useEffect } from 'react';
import moment from 'moment';
import ButtonIcon from './Button/ButtonIcon';
import rightWhite from './img/rightWhite.svg';
import leftWhite from './img/leftWhite.svg';

export default function Calendar(props) {
    const [value, setValue] = useState(moment());
    const [calendar, setCalendar] = useState([]);

    const monthStart = value.clone().startOf('month');
    const monthEnd = value.clone().endOf('month');

    const startDay = value.clone().startOf('month').startOf('week');
    const endDay = value.clone().endOf('month').endOf('week');

    useEffect(() => {
        const day = startDay.clone().subtract(1, 'day');
        const calendarClone = [];
        while (day.isBefore(endDay)) {
            calendarClone.push(
                Array(7)
                    .fill(0)
                    .map(() => day.add(1, 'day').clone())
            );
        }
        setCalendar(calendarClone);
    }, [value]);

    const prevMonth = () => {
        var valueClone = value.clone().subtract(1, 'months');
        setValue(valueClone);
    };
    const nextMonth = () => {
        var valueClone = value.clone().add(1, 'months');
        setValue(valueClone);
    };

    const monthDate = () => {
        return `${value.format('dddd')} - ${value.format('L')}`;
    };

    return (
        <div id='calendar'>
            <h2>calendar</h2>
            <div className='calendar-container'>
                <div className='calendar-header'>{monthDate()}</div>
                <div className='calendar-inner'>
                    {calendar.map((week, i) => (
                        <div className='week' key={i}>
                            {week.map((day, i) => (
                                <div onClick={() => setValue(day)} className={day._d < monthStart._d ? 'day not-month' : day._d > monthEnd._d ? 'day not-month' : 'day same-month'} key={i}>
                                    <div className={value.isSame(day, 'day') ? 'today' : ''}>{day.format('D').toString()}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className='date-select-row'>
                    <ButtonIcon click={prevMonth} name='Previous Month' icon={leftWhite} />

                    <ButtonIcon click={nextMonth} name='Next Month' icon={rightWhite} />
                </div>
            </div>
        </div>
    );
}
