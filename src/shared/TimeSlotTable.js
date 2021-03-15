import '../styling/TimeSlotTable.css';
import {Component} from "react";


/** Creates the TimeSlotTable
 * @param type NEW if days of week or calander
 * @param dates Date objects for each date, which is translated into each column
 * @param showTimeSlot 2x2 Boolean array that is the total size of the table, with each boolean denoting whether or not that element is "available"
 * @param minStartTime Integer. The earliest time that the table should start, aka the first row. Minutes since midnight.
*/

class TimeSlotTable extends Component {
    response = this.initialResponseMatrix();

    constructor(props) {
        super(props);

        this.handleTimeSlotClicked = this.handleTimeSlotClicked.bind(this);
        this.handleMulti = this.handleMulti.bind(this);
        this.maybeMulti = this.maybeMulti.bind(this);

        this.state = {
            multiSelect: false
        }
    }

    handleMulti(isOn){
        if(this.state.multiSelect != isOn){
            this.setState({multiSelect: isOn});
            if(isOn){
                console.log("start the shit");
            }
            else{
                console.log("end this shit");
            }
        }
    }

    maybeMulti(keyName){
        if(this.state.multiSelect){
            this.handleTimeSlotClicked(keyName);
        }
    }

    initialResponseMatrix(){
        const response = new Array(this.props.showTimeSlot.length);
        const width = this.props.showTimeSlot[0].length;
        for (let i = 0; i < response.length; i++){
            response[i] = new Array(width).fill(0);
        }
        return response;
    }

    getMatrixLocation(id){
        const parsedID = id.split(':'); //example: timeslot:0:540
        const row = (parsedID[2] - this.props.minStartTime)/15;
        return [row, parsedID[1]];
    }


    handleTimeSlotClicked(id){
        console.log("Clicked: " + id);
        const location = this.getMatrixLocation(id);
        if (this.response[location[0]][location[1]] === 0){
            this.response[location[0]][location[1]] = 1;
            document.getElementById(id).style.backgroundColor = "#84D6E7";
        }
        else {
            this.response[location[0]][location[1]] = 0;
            document.getElementById(id).style.backgroundColor = "#ffffff";
        }
        console.table(this.response);
    }

    /**
     * Adds each table header to the top row of TimeSlotTable is the dates/days
     * @param date
     * @returns {JSX.Element}
     * @constructor
     */
    AddHeaderDate(date){
        const options = {weekday: 'long', month: 'long', day: 'numeric'};
        const dateString = date.toLocaleDateString(undefined, options).split(',') //Uses local OS language
        return (
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
    AddHeaderWeekDay(date){
        const DaysEnum = Object.freeze({"Sunday":0, "Monday":1, "Tuesday":2, "Wednesday":3, "Thursday":4, "Friday":5, "Saturday":6});
        //const options = { weekday: 'long', month: 'long', day: 'numeric' };
        //const dateString = date.toLocaleDateString(undefined, options).split(',') //Uses local OS language
        return (
            //Key is Unix time (milliseconds)
            //Title is day of the week, and then Month and Date
            <th key={date}>
                {date}
            </th>
        );
    }

    AddSideHeaderHour(timestamp, rows){
        if(timestamp%60 === 0) {
            const hour = timestamp / 60;
            const title = (hour < 12) ? hour + ' AM' : (hour - 12) + ' PM';
            return (
                <td className="timeslotHourTitleCell" rowSpan={rows}>
                    {title}
                </td>);
        }
        else {
            return (
                <td className="timeslotHourTitleCell" />);
        }
    }



    /**
     * Creates a tr (a table row) of the TimeSlotTable
     * @param timestamp Integer corresponding to the timestamp for that row. Minutes since midnight.
     * @param showTimeSlot Boolean array for this row, denoting which data cells should be available for users to click on
     * @returns {JSX.Element}
     * @constructor
     */
    TimeSlotRow(timestamp, showTimeSlot){
        let rowClassName;
        let isHourRow = false;

        switch (timestamp % 60) {
            case 0:
                //if timestamp is an hour mark, add title
                rowClassName = 'timeslotClickableHour';
                isHourRow = true;
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
                    {this.AddSideHeaderHour(timestamp, 4)}
                    {showTimeSlot.map(show => {
                        const keyName = 'timeslot:' + dayCount + ':' + timestamp;
                        dayCount++;

                        if (show) {
                            //if the admin choose for this time to be available to be selected, make it clickable,
                            // otherwise mark as unavailable slot and do not attach any event handlers
                            return <td
                                key={keyName}
                                id={keyName}
                                className={rowClassName}
                                onClick={() => this.handleTimeSlotClicked(keyName)}
                                onMouseDown = {() => {this.handleMulti(true); this.handleTimeSlotClicked(keyName)}}
                                //if they dont letup mouse within table, wont register
                                onMouseUp = {() => {this.handleMulti(false)}}
                                onMouseEnter = {() => {this.maybeMulti(keyName)}}
                                />
                        } else {
                            return <td
                                key={keyName}
                                id={keyName}
                                className="timeslotUnavailable"/>
                        }
                    })}
                </tr>
            </>
        );
    }

    /**
     * Creates the tbody of the TimeSlotTable. Goes through each 15-minute timeslot and creates the row for it
     * @returns {JSX.Element}
     */
    TimeSlotCreateRows(){
        let timestamp = this.props.minStartTime;
        const rows = [];
        for (let i = 0; i < this.props.showTimeSlot.length; i++) {
            rows.push(this.TimeSlotRow(timestamp, this.props.showTimeSlot[i]));
            timestamp += 15; //Add 15 minutes for the next row
        }

        return (
            <tbody>
            {rows}
            </tbody>
        )
    }


    render() {

        return (
            <div className="TimeSlotTable">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th/>
                        {this.props.type ? (this.props.dates.map((date) => this.AddHeaderWeekDay(date))) :
                                           (this.props.dates.map((date) => this.AddHeaderDate(date)))}
                    </tr>
                    </thead>
                    {this.TimeSlotCreateRows()}
                </table>
            </div>
        );
    }
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
