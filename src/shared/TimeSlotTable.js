import '../styling/TimeSlotTable.css';

/**
 * Adds each table header to the top row of TimeSlotTable is the dates/days
 * @param date
 * @returns {JSX.Element}
 * @constructor
 */
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

/**
 * Adds each table header to the top row of TimeSlotTable is the dates/days
 * @param date
 * @returns {JSX.Element}
 * @constructor
 */
const AddHeaderWeekDay = ({date}) => {
    //const options = { weekday: 'long', month: 'long', day: 'numeric' };
    //const dateString = date.toLocaleDateString(undefined, options).split(',') //Uses local OS language
    return(
        //Key is Unix time (milliseconds)
        //Title is day of the week, and then Month and Date
        <th key={date}>
            {date}
        </th>
    );
}

const handleTimeSlotClicked = (time) => {
    console.log("Clicked: " + time);
}

/**
 * Creates a tr (a table row) of the TimeSlotTable
 * @param timestamp Integer corresponding to the timestamp for that row. Minutes since midnight.
 * @param showTimeSlot Boolean array for this row, denoting which data cells should be available for users to click on
 * @returns {JSX.Element}
 * @constructor
 */
const TimeSlotRow = (timestamp, showTimeSlot) => {
    let title = "";
    let rowClassName;

    switch(timestamp % 60) {
        case 0:
            //if timestamp is an hour mark, add title
            title = timestamp / 60;
            title += (title < 12) ? ' AM' : ' PM';
            rowClassName = 'timeslotClickableHour';
            break;
        case 30:
            //if timestamp is on a half hour mark, change className for styling purposes
            rowClassName = 'timeslotClickableHalfHour';
            break;
        default:
            rowClassName = 'timeslotClickable';
    }

    //Counts which day (column) the cell is on. Used for creating key for cells.
    let dayCount = 0;

    return (
        <>
            <tr>
                <td className="timeslotHourTitleCell">
                    {title}
                </td>
                {showTimeSlot.map(show =>
                    {
                        const keyName = 'timeslot:' + dayCount + ':' + timestamp;
                        dayCount++;

                        if(show){
                            //if the admin choose for this time to be available to be selected, make it clickable,
                            // otherwise mark as unavailable slot and do not attach any event handlers
                            return <td
                                    key={keyName}
                                    className={rowClassName}
                                    onClick={() => handleTimeSlotClicked(timestamp)}/>
                        }
                        else {
                            return <td
                                    key={keyName}
                                    className="timeslotUnavailable"/>
                        }
                    })}
            </tr>
        </>
    );
}

/**
 * Creates the tbody of the TimeSlotTable. Goes through each 15-minute timeslot and creates the row for it
 * @param showTimeSlot See TimeSlotTable
 * @param minStartTime See TimeSlotTable
 * @returns {JSX.Element}
 * @constructor
 */
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


/** Creates the TimeSlotTable
 * @param type NEW if days of week or calander
 * @param dates Date objects for each date, which is translated into each column
 * @param showTimeSlot 2x2 Boolean array that is the total size of the table, with each boolean denoting whether or not that element is "available"
 * @param minStartTime Integer. The earliest time that the table should start, aka the first row. Minutes since midnight.
 * @returns {JSX.Element}
 * @constructor
 */
const TimeSlotTable = ({type, dates, showTimeSlot, minStartTime}) => {

    return (
        <div className="TimeSlotTable">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th/>
                        {type ? (dates.map((date) => <AddHeaderWeekDay date={date}/>)) : (dates.map((date) => <AddHeaderDate date={date}/>))}
                    </tr>
                </thead>
                {TimeSlotCreateRows(showTimeSlot,minStartTime)}
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
