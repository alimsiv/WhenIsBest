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


const TimeSlotRow = (timestamp, showTimeSlot) => {
    let title = "";
    if (timestamp % 60 === 0){
        //if timestamp is an hour mark, add title
        title = timestamp/60;
        title += (title < 12) ? ' AM' : ' PM';
    }

    //TODO: some sort of mapping to trap which times for which days should be shown. Use a boolean 2x2 array?
    return (
        <>
            <tr>
                <td className="timeslotHourTitleCell">
                    {title}
                </td>
                {showTimeSlot.map(show =>
                    {if(show){
                        //if the admin choose for this time to be available to be selected, make it clickable,
                        // otherwise mark as unavailable slot and do not attach any event handlers
                        //TODO: add key
                        return <td
                                   className="timeslotClickable"
                                   onClick={() => handleTimeSlotClicked(timestamp)}/>
                    } else {
                        return <td
                                   className="timeslotUnavailable"/>
                    }
                    }

                    )}
                {/*{dateTimes.forEach((date, times) => <td key={"date:" + time}
                                       className="timeslotClickable"
                                       onClick={() => handleTimeSlotClicked(time)}/>)}*/}
            </tr>

            {/*<tr className="timeslot">
                <td/>
                {cols.map(() => <td/>)}
            </tr>*/}
        </>
    );
}

const TimeSlotCreateRows = (showTimeSlot, minStartTime) => {
    let timestamp = minStartTime;
    const rows = [];
    for (let i = 0; i < showTimeSlot.length; i++) {
        rows.push(TimeSlotRow(timestamp, showTimeSlot[i]));
        timestamp += 15; //Add 15 minutes for the next row
    }

    return (
        <tbody>
            {rows}
        </tbody>
    )
}


/**
 *
 * @param dates Date objects for each date, which is translated into each column
 * @param times
 * @param showTimeSlot 2x2 Boolean array that is the total size of the table, with each boolean denoting whether or not that element is "available"
 * @param minStartTime The earliest time that the table should start, aka the first row
 * @returns {JSX.Element}
 * @constructor
 */
const TimeSlotTable = ({dates, times, showTimeSlot, minStartTime}) => {
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
                {TimeSlotCreateRows(showTimeSlot,minStartTime)}
                    {/*{timeRange.map((time) => <TimeSlotRow time={time} dateTimes={times} showTimeSlot={showTimeSlot} minStartTime={minStartTime}/>)}*/}

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
