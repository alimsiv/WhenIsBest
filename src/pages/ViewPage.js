import React, { Component } from 'react';
import { Form, Toast, Modal, Button } from 'react-bootstrap';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import TimeSlotTable from "../shared/TimeSlotTable";
import { getMeetingInfo, fixTable, fixDays, getResponses, addResponseToDB, updateResponseInDB } from "../database/database";
import '../styling/styles.css';
import { outputColorMap } from '../shared/temp_alg';
import { convertToGroups } from '../shared/temp_alg';
import ApiCalendar from 'react-google-calendar-api';
import { DateUtils } from 'react-day-picker';
const math = require('mathjs')

class ViewPage extends Component {
    inputOptions = {
        OPTIONS: "options",
        GOOGLE_CALENDAR: "google_calendar",
        MANUAL: "manual"
    }

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.handleUpdateDB = this.handleUpdateDB.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUpdateMinRequired = this.handleUpdateMinRequired.bind(this);
        this.handleUserGroup = this.handleUserGroup.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.inputTable = React.createRef();
        this.repsonsesTable = React.createRef();
        this.handleCalenderClick = this.handleCalenderClick.bind(this);

        this.state = {
            meetingID: [],
            days: [],
            minStart: [],
            tableRow: [],
            tableCol: [],
            showTimeSlotTable: [],
            daytype: [],
            name: [],
            hostID: [],
            priorityType: [], //"G" for group, "P" for person
            groupList: [], //List of group names
            responses: [],
            userGroup: "",
            userID: "",
            userName: "",
            inputChoice: this.inputOptions.OPTIONS,
            showAdvancedSettings: false,
            showModal: false,
            signedIn: false,
            events: [],
            eventAdded: false,
            groups: [],
            req: false,
            reload: false,
            overall_checked: true,

            //TODO set to authenticated user id if logged in
        }
    }

    handleUserGroup(e) {
        console.log(e.target.value);
        this.setState({
            userGroup: e.target.value
        });
    }

    handleCloseModal() {
        this.setState({
            showModal: false
        });
    }


    async componentDidMount() {
        const meetingID = this.getID();
        const info = await getMeetingInfo(meetingID);
        const twoDTable = fixTable(info.showTimeSlot, info.tableCol);
        const days = (info.daytype === 1) ? info.days : fixDays(info.days);
        const responseList = await getResponses(meetingID);
        const modal = info.priorityType === "G";

        this.setState({
            meetingID: meetingID,
            days: days,
            minStart: info.minStart,
            tableRow: info.tableRow,
            tableCol: info.tableCol,
            showTimeSlotTable: twoDTable,
            daytype: info.daytype,
            name: info.name,
            hostID: info.hostID,
            priorityType: info.priorityType,
            groupList: info.groupList,
            responses: responseList,
            showModal: modal,
            groups: null,
            req: false,
        });
    }

    getID() {
        const url = window.location.href.toString();
        const url_split = url.split("/");
        const id = url_split.slice(-1)[0];
        console.log(id);
        return id;
    }

    AdjustTimezone() {
        const seoul = new Date(1489199400000);
        const ny = new Date(1489199400000 - ((this.state.timezoneOffset - seoul.getTimezoneOffset()) * 60 * 1000));

        console.log(Date.formatDate(seoul));  // 2017/3/11 11:30
        console.log(Date.formatDate(ny));     // 2017/3/10 21:30
    }

    handleUpdatePriority(name, id, priority) {
        //TODO: update priority of name
        const responses = this.state.responses;
        if (this.state.priorityType == "P") {
            const isCorrectResponse = (element) => element.id === id;
            const indx = responses.findIndex(isCorrectResponse);
            console.log(indx);
            responses[indx].priority = priority;
        }
        else {
            for (let i = 0; i < math.size(responses); i++) {
                if (responses[i].group == id) {
                    responses[i].priority = priority;
                }
            }
        }
        this.setState({
            responses: responses
        });
    }

    handleUpdateMinRequired(group, minRequired) {
        //TODO: update min required of group
        this.state.req = false
        if (minRequired > 0)
            this.state.req = true
        if (this.state.groups = null)
            this.state.groups = convertToGroups(this.state.responses, this.state.groupList)
        console.log(group + " requires at least: " + minRequired);
        for (let i = 0; i < math.size(this.state.groups); i++) {
            if (this.state.groups[i].name == group)
                this.state.groups[i].req = minRequired;
            if (this.state.groups[i].req > 0)
                this.state.req = true
        }
        this.setState({
            groups: this.state.groups,
            req: this.state.req
        });
    }

    handleUpdateCheckBox(name, id, status) {
        //TODO: update checkbox of name
        console.log(name + " has been selected: " + status);
        if (this.state.priorityType == "P") {
            for (let i = 0; i < math.size(this.state.responses); i++) {
                if (this.state.responses[i].name == name) {
                    this.state.responses[i].show = status;
                }
            }
        }
        else {
            for (let i = 0; i < math.size(this.state.responses); i++) {
                if (this.state.responses[i].group == id) {
                    this.state.responses[i].show = status;
                }
            }
        }
        this.setState({
            responses: this.state.responses
        });
    }

    handleOverallCheckBox(status) {
        //TODO: update checkbox of name
        console.log("Overall has been selected: " + status);
        if (this.state.priorityType == "P") {
            for (let i = 0; i < math.size(this.state.responses); i++) {
                this.state.responses[i].show = status;
            }
        }
        else {
            for (let i = 0; i < math.size(this.state.responses); i++) {
                this.state.responses[i].show = status;
            }
        }
        this.setState({
            responses: this.state.responses,
            overall_checked: status
        });
    }

    handleUpdateDB(response) {
        console.log("Updating database");
        const name = document.getElementById("user-name-input").value;
        if (this.state.userID !== "") {
            //user already exists in responses database
            updateResponseInDB(this.state.meetingID, this.state.userID, name, response)
        }
        else {
            const userID = addResponseToDB(this.state.meetingID, name,
                this.state.userGroup, response)
            this.setState({
                userID: userID
            });
        }
    }

    handleNameChange(e) {
        this.setState({
            userName: e.target.value
        })
    }

    initialResponseMatrix() {
        const response = new Array(this.props.showTimeSlot.length);
        const width = this.props.showTimeSlot[0].length;
        for (let i = 0; i < response.length; i++) {
            response[i] = new Array(width).fill(0);
        }
        return response;
    }

    //returns only the events that matter
    importantEvents(events) {
        var importantEvents = [];
        //console.log("unfiltered events" + events);
        console.log("Meeting Filtering")
        events.forEach(element => {
            if (element.status != "cancelled") {//&& this.validDay(element.start.dateTime)){
                console.log("added Event:" + element.summary + " to list of calander events")
                importantEvents.push(element);
            }
            else {
                if (element.status == "cancelled") {
                    console.log("ignored " + element.summary + ":cancelled");
                }
                else {
                    console.log("ignored " + element.summary + ":invalid time");
                }

            }
        });
        return importantEvents;
    }

    validDay(time) {
        // console.log("Start" + Date.parse(this.state.days[0])); how to get javascript date into unixt time
        var dayOfEvent = new Date(Date.parse(time)); //Date.parse converts to unix time (1600000000 thing), new Date converts to javascript time
        for (var i = 0; i < this.state.days.length; i++) { //checks if event is say day as any day in calander
            if (DateUtils.isSameDay(this.state.days[i], dayOfEvent)) { return true };
        }
        return false;
    }

    addEventsToState(day, result) {
        console.log("Day: " + day);

        const oldEvents = this.state.events;
        const allItems = [];

        for (let i = 0; i < result.items.length; i++) {
            const currentItem = result.items[i];

            //takes out cancelled and all-day events
            console.log(currentItem);
            if (currentItem.status !== "cancelled" && currentItem.start.dateTime != null) {

                //fixes recurring events
                if (currentItem.recurrence != null) {
                    //If it is a recurring event, sets start and end times
                    const currentStartDate = new Date(Date.parse(currentItem.start.dateTime));
                    const currentEndDate = new Date(Date.parse(currentItem.end.dateTime));
                    const currentDate = new Date(Date.parse(day));
                    console.log("current item: ");
                    console.log(currentItem);
                    console.log("current times: \n" + currentStartDate + "\n" + currentEndDate);
                    const tempStart = (new Date(currentDate.setHours(currentStartDate.getHours()))).setMinutes(currentStartDate.getMinutes());
                    const tempEnd = (new Date(currentDate.setHours(currentEndDate.getHours()))).setMinutes(currentEndDate.getMinutes());
                    currentItem.start.dateTime = (new Date(tempStart)).toISOString();
                    currentItem.end.dateTime = (new Date(tempEnd)).toISOString();
                }
                console.log(currentItem);

                allItems.push(currentItem);
            }
        }
        //Check if times are valid
        oldEvents.push(...this.importantEvents(allItems));

        this.setState({ events: oldEvents });
    }

    handleCalenderClick(name) {
        if (name === 'sign-in') {
            ApiCalendar.handleSignoutClick();
            this.setState({ signedIn: false })
            console.log(ApiCalendar.sign);
            if (!ApiCalendar.sign) {
                ApiCalendar.handleAuthClick();
            }
            console.log(ApiCalendar.sign);
            if (ApiCalendar.sign && !this.state.signedIn) {
                if (this.inputTable.current != null) {
                    console.log(this.inputTable);
                    this.inputTable.current.SetResponseOnes();
                }

                for (let i = 0; i < this.state.days.length; i++) {
                    // gets events for each day
                    const day = this.state.days[i];
                    var min = (new Date(day.setHours(0))).setMinutes(0);
                    min = (new Date(min)).toISOString();

                    var max = (new Date(day.setHours(23))).setMinutes(59);
                    max = (new Date(max)).toISOString();

                    ApiCalendar.listEvents({ timeMax: max, timeMin: min }).then(({ result }) => { //gets all event in calander
                        this.addEventsToState(day, result);
                    })

                    this.setState({ signedIn: true })
                    console.log("successfully signed in");
                }
                console.log(this.state.events);


            }
        }
    }

    /*
    handleCalenderClick(name){
      if (name === 'sign-in') {
          ApiCalendar.handleSignoutClick();
          this.setState({signedIn:false})
          if(!ApiCalendar.sign){
              ApiCalendar.handleAuthClick();
          }
        if (ApiCalendar.sign && !this.state.signedIn){
          //ApiCalendar.listUpcomingEvents(5).then(({ result }) => {   //gets 5 upcoming events //unsure what upcoming is defined at
          var min = (new Date(this.state.days[0].setHours(0))).setMinutes(0);
          min = (new Date(min)).toISOString();

          var max = (new Date(this.state.days[this.state.days.length-1].setHours(23))).setMinutes(59);
          max = (new Date(max)).toISOString();
          console.log(min);
          console.log(max);

          ApiCalendar.listEvents({timeMax:max, timeMin:min}).then(({ result }) => { //gets all event in calander
              //console.log(result.items)
              //return(
              this.setState({events:this.importantEvents(result.items)})
          })
          this.setState({signedIn:true})
          console.log("successfully signed in");
        }
      }
      // } else if (name === 'sign-out') {
      //   ApiCalendar.handleSignoutClick();
      // }
    }
    */

    getResponses(mode, groupList) {
        if (mode == "G") {
            return convertToGroups(this.state.responses, groupList)
        }
        else {
            return this.state.responses
        }
    }

    ResponseRow(name, id, priority, show) {
        console.log("responses")
        console.log(this.state.responses)
        return (
            <tr className="responses-row">
                {this.state.showAdvancedSettings && <td>
                    <Form.Group controlId={id + '_checkbox'} className="responses-checkbox">
                        <Form.Check type="checkbox" checked={show} onChange={(e) => this.handleUpdateCheckBox(name, id, e.target.checked)} />
                    </Form.Group>
                </td>}
                <td className="responses-name">{name}</td>
                {this.state.showAdvancedSettings && <td>
                    <input className="responses-range" type="range" id={id + "_range"} min="1" max="5" step="1" value={priority} onChange={(e) => this.handleUpdatePriority(name, id, e.target.value)} />
                </td>}
                {/*TODO: cap max allowed */}
                {this.state.priorityType === "G" && this.state.showAdvancedSettings && <td>
                    <input className="responses-required" type="number" min="0" id={name + "_required"} onChange={(e) => this.handleUpdateMinRequired(name, e.target.value)} />
                </td>}
            </tr>
        );
    }

    GroupOrPeopleResponses() {
        let responses;
        if (this.state.priorityType === "P") {
            console.log("People Responses");
            if (this.state.responses.length === 0) {
                return (
                    <div>
                        There are no responses yet.
                    </div>
                );
            }

            responses = this.state.responses.map((response) => this.ResponseRow(response.name, response.id, response.priority, response.show));
        }
        else {
            console.log("Group Responses");
            responses = this.state.groupList.map((group) => this.ResponseRow(group, group, group.priority, group.show));
        }
        return (
            <>
                <table className="responses_table">
                    {this.state.showAdvancedSettings && <tr>
                        <td>
                            <Form.Group controlId={'overall_checkbox'} className="responses-checkbox">
                                <Form.Check type="checkbox" checked={this.state.overall_checked} onChange={(e) => this.handleOverallCheckBox(e.target.checked)} />
                            </Form.Group>
                        </td>
                        <td />
                        <td className="flex">
                            <div className="left">low</div>
                            <div className="right">high</div>
                        </td>
                    </tr>}
                    {responses}
                </table>
            </>
        );
    }

    NameAndSubmit() {
        return (
            <div className="flex">
                <form>
                    <input id="user-name-input" type="text" className="form-control" placeholder="Your Name" onChange={this.handleNameChange} />
                </form>
                <Button id="update-availability-button" onClick={() => {
                    if (this.inputTable != null) {
                        const availability = this.inputTable.current.GetResponse();
                        if (availability != null) {
                            if (this.state.userName === "") {
                                alert("Please enter your name.");
                            }
                            else if (availability.flat().reduce((total, num) => { return total + num }) === 0) {
                                alert("Please select some availabilities.");
                            }
                            else {
                                console.log("Updating availability");

                                this.handleUpdateDB(availability)
                                alert("Your responses has been submitted. Reload to see the updated heatmap.");
                            }
                        }
                        else {
                            console.log("Availability responses is null")
                        }
                    }
                    else {
                        console.log("TimeSlotTable does not exist yet.");
                    }
                }}>
                    Add Availability
                        </Button >
            </div >

        );
    }

    GetEvents() {
        if (this.state.signedIn) {
            return (
                this.state.events.map((x) => {
                    return (
                        <div>{x.summary}</div>
                    )
                })
            )
            //ApiCalendar.listEvents().then(({ result }) => {       //gets all events in calander
            // ApiCalendar.listUpcomingEvents(5).then(({ result }) => {   //gets 5 upcoming events //unsure what upcoming is defined at
            //     //console.log(result.items)
            //     //return(
            //     this.setState({events:result.items})
            //result.items.map((x) => {

            //console.log(x.summary)
            // return(
            // <>
            //     <div>
            //     {x.summary} 
            //     </div>
            //     <div>
            //         {x.start} 
            //         {x.end}
            //     </div>
            // </>
            // )
            //this.setState({events:this.state.events.push(x.summary)})
            // })
            //);
            //});
        }
    }

    addEvents() {
        this.state.events.forEach()
        //table.rows[3].cells[2].innerHTML = "testEvent";
    }

    getRowfromTime(time) {
        var timeInMins = time.getHours() * 60 + time.getMinutes();
        return (Math.floor((timeInMins - this.state.minStart) / 15) + 1)
    }

    getCol(time) {
        var dayOfEvent = new Date(Date.parse(time));
        for (var i = 0; i < this.state.days.length; i++) { //checks if event is say day as any day in calander
            if (DateUtils.isSameDay(this.state.days[i], dayOfEvent)) { return i + 1 };
        }
    }

    getLocation(e) {
        var startTime = new Date(Date.parse(e.start.dateTime));
        var endTime = new Date(Date.parse(e.end.dateTime));
        var startRow = this.getRowfromTime(startTime);
        var endRow = this.getRowfromTime(endTime) - 1;
        var col = this.getCol(startTime)
        return [startRow, endRow, col]
    }

    addEvent() {
        var border = "2px solid #0000FF";
        if (this.inputTable != null) {
            //console.log("table" + table)
            //this.setState({eventAdded:true})
            var table = document.getElementById("userInputTable");
            console.log("table Events" + table)
            console.log(table)
            if (table != null) {
                //console.log("Filtered Events" + this.state.events);
                this.state.events.forEach((e) => {
                    //console.log(e)
                    const location = this.getLocation(e);
                    //console.log(location)
                    var cols;
                    if (table.rows[location[0]] != null) {
                        (table.rows[location[0]].cells[0].classList.contains("timeslotHourTitleCell") ? cols = location[2] : cols = location[2] - 1);

                        if (table.rows[location[0]].cells[cols] != null) {
                            table.rows[location[0]].cells[cols].innerHTML = e.summary;
                            table.rows[location[0]].cells[cols].style.fontSize = "8px";
                            table.rows[location[0]].cells[cols].style.borderTop = border;
                            for (var i = location[0]; i <= location[1]; i++) {
                                if (table.rows[i] == null) {
                                    location[1] = i - 1;
                                    break;
                                }
                                (table.rows[i].cells[0].classList.contains("timeslotHourTitleCell") ? cols = location[2] : cols = location[2] - 1)
                                table.rows[i].cells[cols].style.borderLeft = border;
                                table.rows[i].cells[cols].style.borderRight = border;
                                //TODO: make it only change to white at the beginning
                                const id = table.rows[i].cells[cols].id;
                                this.inputTable.current.UpdateEventAt(id);
                            }
                            table.rows[location[1]].cells[cols].style.borderBottom = border;
                        }
                    }
                })
            }

        }
        //table.rows[3].cells[2].innerHTML = "testEvent";
    }

    GoogleCalendarInput() {
        if (this.state.signedIn) {
            return (
                <>
                    <div className="flex-child">
                        <TimeSlotTable ref={this.inputTable}
                            isInputTable={true}
                            type={this.state.daytype}
                            dates={this.state.days}
                            showTimeSlot={this.state.showTimeSlotTable}
                            minStartTime={this.state.minStart}
                            handleUpdateDB={this.handleUpdateDB}
                            showPreferredButton={true}
                            events={this.state.events}
                            tableID="userInputTable"
                            setAllToOnes={true}
                        />
                    </div>
                </>
            );
        }
        else {
            return (
                <p>
                    <Button
                        onClick={(e) => this.handleCalenderClick('sign-in')}
                    >
                        sign-in
                </Button>
                </p>
            );

        }
    }

    InputTable() {
        return (
            <div className="flex-child">
                <TimeSlotTable ref={this.inputTable}
                    isInputTable={true} //whether or not the user will be able to select cells on this table
                    type={this.state.daytype}
                    dates={this.state.days}
                    showTimeSlot={this.state.showTimeSlotTable}
                    minStartTime={this.state.minStart}
                    handleUpdateDB={this.handleUpdateDB}
                    showPreferredButton={true}
                    events={[]}
                    tableID="userInputTable"
                />
            </div>
        );
    }

    InputOptions() {
        switch (this.state.inputChoice) {
            case this.inputOptions.OPTIONS:
                return (
                    <div>
                        <br />
                        <br />
                        <br />

                        {this.state.daytype === 0 &&
                            <Button id="get-google-calendar-button" onClick={() => {
                                this.setState({
                                    inputChoice: this.inputOptions.GOOGLE_CALENDAR
                                });
                            }}>
                                Get availabilites from Google Calendar
                        </Button>}

                        <br />
                        <br />
                        <br />

                        <Button id="get-input-table-button" onClick={() => {
                            this.setState({
                                inputChoice: this.inputOptions.MANUAL
                            });
                        }}>
                            Input availabilities manually
                        </Button>

                    </div>
                );
            case this.inputOptions.GOOGLE_CALENDAR:
                return this.GoogleCalendarInput();
            case this.inputOptions.MANUAL:
                return this.InputTable();

            default:
                console.log("InputOptions ERROR")
                break;
        }


    }

    duplicateResponces(responceList){
        var newResponces = [];
        console.log(responceList)
        for(var i = 0; i < responceList.length; i++){
            var curResponce = responceList[i];
            // newResponces.push({
            //     availability:   [...curResponce.availability],
            //     group:      curResponce.group,
            //     id:     curResponce.id,
            //     name:curResponce.name,
            //     priority:curResponce.priority,
            //     show:curResponce.show
            // })
            console.log(curResponce);
            newResponces.push(JSON.parse(JSON.stringify(curResponce)))
        }
        return newResponces;
    }

    preferredOnly(responceList){
        //console.log("responceList Start")
        var perfferedResponceList = this.duplicateResponces(responceList);
        console.log(perfferedResponceList);
        for(var i = 0; i < responceList.length;i++){
            perfferedResponceList[i].availability = (this.convertToPreferredOnly(perfferedResponceList[i].availability))
            //responceList[i].avail_map = (this.convertToPreferredOnly(responceList[i].avail_map))
            //console.log(responceList[i]);
        }
        //console.log("responceList End")
        return perfferedResponceList;
    }

    convertToPreferredOnly(availability){
        var oldavailability = [...availability];
        var newavailability = [...availability];
        var noPreferred = true;
        console.log(availability);
        for(var i = 0; i < availability.length; i++){
            //console.log("randome" + availability[i])
            if(newavailability[i] == 1){
                newavailability[i] = 0;
            }
            else if(noPreferred && newavailability[i] ==2 ) noPreferred = false;
        }
        if (noPreferred){
            return oldavailability;
        }
        else return newavailability;
    }

    Responses() {
        return (
            <div className="flex-child">
                <div className="flex">
                    <div className="flex-child">
                        <h4>{(this.state.priorityType === "G" ? "Group Responses" : "Responses")}</h4>
                    </div>
                    <div className="flex-child">
                        <Button id="advanced-settings-button" onClick={() => {
                            this.setState({
                                showAdvancedSettings: !this.state.showAdvancedSettings
                            });
                        }}>
                            {this.state.showAdvancedSettings ? "Hide advanced settings" : "Show advanced settings"}
                        </Button>
                    </div>
                </div>
                <br />
                {this.GroupOrPeopleResponses()}
            </div>

        );
    }


    render() {
        if (this.state.days.length === 0) {
            console.log("Loading database still")
            return (
                <div>
                    <p>Loading....</p>
                </div>
            );
        }
        else {
            console.log(this.state);
            //var responses = this.getResponses(this.state.priorityType, this.state.groupList);
            return (
                <div className="ViewPage">
                    <br />
                    <h1>{this.state.name}</h1>
                    <br />
                    <br />


                    <div className="flex">

                        {this.Responses()}

                        {this.InputOptions()}
                        {this.addEvent()}
                        <div className="flex-child">

                            <TimeSlotTable ref={this.repsonsesTable}
                                isInputTable={false}
                                type={this.state.daytype}
                                dates={this.state.days}
                                showTimeSlot={this.state.showTimeSlotTable}
                                minStartTime={this.state.minStart}
                                showPreferredButton={true}
                                events={[]}
                                tableID="meetingTable"
                                colorMap={outputColorMap(this.state.responses, this.state.groupList, this.state.req)}
                                preferredColorMap={outputColorMap(this.preferredOnly(this.state.responses), this.state.groupList, this.state.req)}
                                tableRow={this.state.tableRow}
                                tableCol={this.state.tableCol}
                            />
                            <div className="gradient-box"></div>
                            <div className="flex">
                                <div className="left">
                                    {//(this.responcesTable.getCurrentButton() == "A" ?  "0 people available" :  "0 people preferred")}
                                                 }
                                0 people availble
                                </div>
                                {/*TODO: get max available */}
                                <div className="right">
                                    {this.state.responses.length + "people available"}{ //(this.responcesTable.getCurrentButton() == "A" ?  "people available" :  "people preferred")}
                                                                                        }
                                </div>
                            </div>

                            {/*TODO make it work with groups too*/}
                        </div>
                    </div>
                    <br />
                    {(this.state.userGroup !== "") && <p>Your group is {this.state.userGroup}. Reload to change groups.</p>}
                    {(this.state.inputChoice != this.inputOptions.OPTIONS) && this.NameAndSubmit()}
                    <br />
                    <br />
                    <br />
                    <Modal show={this.state.showModal && (this.state.inputChoice !== this.inputOptions.OPTIONS)} hide={this.handleCloseModal}>
                        <Modal.Header>
                            <Modal.Title>Please select your group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RadioGroup aria-label="gender" name="gender1" value={this.state.userGroup} onChange={this.handleUserGroup}>
                                {this.state.groupList.map((group) =>
                                    <FormControlLabel value={group} control={<Radio />} label={group} />
                                )}
                            </RadioGroup>
                            <Button variant="primary" onClick={this.handleCloseModal}>
                                Confirm
                            </Button>
                        </Modal.Body>
                    </Modal>

                </div>
            );
        }
    }
}

export default ViewPage;