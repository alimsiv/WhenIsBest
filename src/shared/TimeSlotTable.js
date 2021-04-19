import '../styling/TimeSlotTable.css';
import { Component } from "react";
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';


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
        this.handleAvailabilityType = this.handleAvailabilityType.bind(this);

        this.state = {
            multiSelect: false,
            multiType: true, //true == add, false == remove highlight
            availabilityType: "A",
        }
    }

    GetResponse() {
        return this.response;
    }

    handleMulti(isOn, id) {
        if (this.state.multiSelect !== isOn) {
            this.setState({ multiSelect: isOn });
            if (isOn) {
                var location = this.getMatrixLocation(id);
                if (this.response[location[0]][location[1]] === 0) {
                    this.setState({ multiType: (this.state.availabilityType == "A" ? 1 : 2) });
                }
                else if (this.response[location[0]][location[1]] === 1) {
                    this.setState({ multiType: (this.state.availabilityType == "A" ? 0 : 2) });
                }
                else {
                    this.setState({ multiType: (this.state.availabilityType == "A" ? 1 : 0) });
                }
                console.log("start the shit");
            }
            else {
                console.log("end this shit");
            }
        }
    }

    //todo: dealing with selecting entire row at once
    //need more info on keyName
    maybeMulti(id) {
        if (this.state.multiSelect) {
            const location = this.getMatrixLocation(id);
            var current = this.response[location[0]][location[1]];
            if (current != this.state.multiType && !(this.state.availabilityType == "A" ? (current == 2 && this.state.multiType == 0) : (current == 1 && this.state.multiType == 0))) //decides if the current spot should change
                this.handleTimeSlotClicked(id);
        }
    }

    initialResponseMatrix() {
        const response = new Array(this.props.showTimeSlot.length);
        const width = this.props.showTimeSlot[0].length;
        for (let i = 0; i < response.length; i++) {
            response[i] = new Array(width).fill(0);
        }
        return response;
    }

    // Returns matrix location from cell id
    getMatrixLocation(id) {
        const parsedID = id.split(':'); //example: timeslot:0:540
        const row = (parsedID[2] - this.props.minStartTime) / 15;
        return [row, parsedID[1]];
    }


    handleTimeSlotClicked(id) {
        var availColor = "#84D6E7";
        var perColor = "#14D6E7";
        var unselColor = "#ffffff"
        console.log("Clicked: " + id);
        const location = this.getMatrixLocation(id);
        if (this.response[location[0]][location[1]] === 0) {
            this.response[location[0]][location[1]] = (this.state.availabilityType == "A" ? 1 : 2);
            document.getElementById(id).style.backgroundColor = (this.state.availabilityType == "A" ? availColor : perColor);
        }
        else if (this.response[location[0]][location[1]] === 1) {
            this.response[location[0]][location[1]] = (this.state.availabilityType == "A" ? 0 : 2);
            document.getElementById(id).style.backgroundColor = (this.state.availabilityType == "A" ? unselColor : perColor);
        }
        else {
            this.response[location[0]][location[1]] = (this.state.availabilityType == "A" ? 1 : 0);
            document.getElementById(id).style.backgroundColor = (this.state.availabilityType == "A" ? availColor : unselColor);
        }
    }

    /**
     * Adds each table header to the top row of TimeSlotTable is the dates/days
     * @param date
     * @returns {JSX.Element}
     * @constructor
     */
    AddHeaderDate(date) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString(undefined, options).split(',') //Uses local OS language
        return (
            //Key is Unix time (milliseconds)
            //Title is day of the week, and then Month and Date
            <th key={date.getTime()}>
                {dateString[0]}
                <br />
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
    AddHeaderWeekDay(date) {
        const DaysEnum = Object.freeze({ "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 });
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

    AddSideHeaderHour(timestamp, rows) {
        if (timestamp % 60 === 0) {
            let title = "";
            const hour = timestamp / 60;
            title = (hour < 13) ? hour : (hour - 12);
            title += (hour < 12) ? ' AM' : ' PM';
            return (
                <td className="timeslotHourTitleCell" rowSpan={4}>
                    {title}
                </td>);
        }
    }

    /**
     * Creates a tr (a table row) of the TimeSlotTable
     * @param timestamp Integer corresponding to the timestamp for that row. Minutes since midnight.
     * @param showTimeSlot Boolean array for this row, denoting which data cells should be available for users to click on
     * @returns {JSX.Element}
     * @constructor
     */
    TimeSlotRow(timestamp, showTimeSlot) {
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
            <tr className="timeslotRow">
                {this.AddSideHeaderHour(timestamp, 4)}
                {showTimeSlot.map(show => {
                    const keyName = 'timeslot:' + dayCount + ':' + timestamp;
                    dayCount++;

                    if (show) {
                        //if the admin choose for this time to be available to be selected, make it clickable,
                        // otherwise mark as unavailable slot and do not attach any event handlers
                        if (this.props.isInputTable) {
                            // If this table should accept user input
                            return <td
                                key={keyName}
                                id={keyName}
                                className={rowClassName}
                                onMouseDown={() => { this.handleMulti(true, keyName); this.handleTimeSlotClicked(keyName) }}
                                onMouseUp={() => { this.handleMulti(false, keyName) }}
                                onMouseEnter={() => { this.maybeMulti(keyName) }}
                            />
                        }
                        else {
                            // If this table is used for the heatmap display
                            return <td
                                key={keyName}
                                id={keyName}
                                className={rowClassName}
                            />
                        }
                    } else {
                        const unavailableClassName = (rowClassName == 'timeslotClickableHour') ? 'timeslotUnavailableHour' : 'timeslotUnavailable';

                        return <td
                            key={keyName}
                            id={keyName}
                            className={unavailableClassName} />
                    }
                })}
            </tr>
        );
    }

    /**
     * Creates the tbody of the TimeSlotTable. Goes through each 15-minute timeslot and creates the row for it
     * @returns {JSX.Element}
     */
    TimeSlotCreateRows() {
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

    handleAvailabilityType = (newType) => {
        if (this.state.availabilityType != newType) {
            this.setState({ availabilityType: newType });
        }
        if (!this.props.isInputTable){
            //TODO: Update heatmap algorithm to only show preferred timeslots
        }
    }

    addEvent(event){
        var table = document.getElementById("userInputTable");
        console.log("table" + table)
        if(table != null){
            table.rows[3].cells[2].innerHTML = "testEvent";
        }
        //table.rows[3].cells[2].innerHTML = "testEvent";
    }

    PreferredButton(){
        return (
            <ToggleButtonGroup id="preferredToggle" type="radio" name="preferredTypeButton" value={this.state.availabilityType} onChange={this.handleAvailabilityType}>
                <ToggleButton defaultChecked value="A">
                    Available
                </ToggleButton>
                <ToggleButton value="P">
                    Preferred
                </ToggleButton>

            </ToggleButtonGroup>
        )
    }


    render() {
        console.log(this.props.tableID + "created")
        return (
            <div className="TimeSlotTable">
                {this.props.showPreferredButton && this.PreferredButton()}
                <table className="styled-table" id={this.props.tableID} onMouseLeave={() => { this.handleMulti(false) }}>
                    <thead>
                        <tr>
                            <th />
                            {this.props.type ? (this.props.dates.map((date) => this.AddHeaderWeekDay(date))) :
                                (this.props.dates.map((date) => this.AddHeaderDate(date)))}
                        </tr>
                    </thead>
                    {this.TimeSlotCreateRows()}
                </table>
                <br />
            </div>

        );
    }
}
export default TimeSlotTable;