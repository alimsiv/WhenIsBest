import '../styling/TimeSlotTable.css';
import {forEach} from "react-bootstrap/ElementChildren";

const AddHeaderDate = ({date}) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString(undefined, options).split(',') //Uses local OS language
    return(
        //Key is Unix time (milliseconds)
        //Title is day of the week, and then Month and Date
        <th key={date.getTime()}>
            {dateString[0]}
            <br/>
            {dateString[1]}
        </th>
    );
}

const handleTimeSlotClicked = (time) => {
    console.log("Clicked: " + time);
}


const TimeSlotRow = ({time, dateTimes}) => {
    //if time is an hour mark, add side title

    //TODO: some sort of mapping to trap which times for which days should be shown. Use a boolean 2x2 array?
    return (
        <>
            <tr className="timeslotHour">
                <td>{time}</td>
                {/*{dateTimes.forEach((date, times) => <td key={"date:" + time}
                                       className="timeslotClickable"
                                       onClick={() => handleTimeSlotClicked(time)}/>)}*/}
            </tr>

            {/*<tr className="timeslot">
                <td/>
                {cols.map(() => <td/>)}
            </tr>
            <tr className="timeslot">
                <td/>
                {cols.map(() => <td/>)}
            </tr>
            <tr className="timeslot">
                <td/>
                {cols.map(() => <td/>)}
            </tr>*/}
        </>
    );
}

const TimeSlotTable = ({dates, times}) => {
    // Total time range for min start time to max end time (placeholder below, need to write function)
    const timeRange = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];

    return (
        <div className="TimeSlotTable">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th/>
                        {dates.map((date) => <AddHeaderDate date={date}/>)}
                    </tr>
                </thead>
                <tbody>
                    {timeRange.map((time) => <TimeSlotRow time={time} dateTimes={times} />)}
                </tbody>
            </table>
        </div>
    );
}

export default TimeSlotTable;

/*
<div id="GroupTime1603281600" data-col="1" data-row="0" data-time="1603281600"
        onmouseover="ShowSlot(1603281600);"
        onmouseout="RestoreLeftSide(event);"
        ontouchstart="ShowSlotByTouch(event);"
        ontouchmove="ShowSlotByTouchMove(event);"
        ontouchend="RestoreLeftSide(event);"
        class="time-slot">
      </div>
 */
