import '../styling/TimeSlotTable.css';

const AddHeaderDate = ({date}) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString(undefined, options).split(',')
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
    console.log("Clicked: " + time.toString())
}

const TimeSlotElement = ({time, cols}) => {
    return (
        <>
            <tr className="timeslotHour">
                <td>{time}</td>
                {cols.map((col) => <td key={col.getTime() + ":" + time}
                                       className="timeslotClickable"
                                       onClick={() => handleTimeSlotClicked(time)}/>)}
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
    return (
        <div className="TimeSlotTable">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th/>
                        {dates.map(date => <AddHeaderDate date={date}/>)}
                    </tr>
                </thead>
                <tbody>
                    {times && times.map(time => <TimeSlotElement time={time} cols={dates}/>)}
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
