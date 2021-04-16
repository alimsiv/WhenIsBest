import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import TimeSlotTable from "../shared/TimeSlotTable";
import {getMeetingInfo, fixTable, fixDays, getResponses, addResponseToDB, updateResponseInDB} from "../database/database";
import '../styling/styles.css';
import {outputColorMap} from '../shared/temp_alg';
import ApiCalendar from 'react-google-calendar-api';
import { DateUtils } from 'react-day-picker';


class ViewPage extends Component{
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
        this.inputTable = React.createRef();
        this.handleCalenderClick = this.handleCalenderClick.bind(this);

        this.state = {
            meetingID: [],
            days: [],
            minStart: [],
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
            signedIn: false,
            events:[],
            eventAdded: false,

            //TODO set to authenticated user id if logged in

            /*
            dates: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            weekdays: ["Monday","Tuesday","Wednesday"],
            showTimeSlot: [[true, true, true], [false, false, false], [false, true, true], [false, true, true], [true, true, false], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true]],
            minStartTime: 540, //The earliest time slot for the range of dates/days chosen (minutes since midnight)
            timezoneOffset: 0,
            responses: ["Marlee", "Ali", "Levi"],
            */

        }
    }

    


    async componentDidMount() {
        const meetingID = this.getID();
        const info = await getMeetingInfo(meetingID);
        const twoDTable = fixTable(info.showTimeSlot,info.tableCol);
        const days = (info.daytype === 1) ? info.days : fixDays(info.days);
        const responseList = await getResponses(meetingID);

        this.setState({
            meetingID: meetingID,
            days: days,
            minStart:info.minStart,
            showTimeSlotTable:twoDTable,
            daytype: info.daytype,
            name: info.name,
            hostID: info.hostID,
            priorityType:info.priorityType,
            groupList:info.groupList,
            responses: responseList,
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
        const ny = new Date(1489199400000 - ((this.state.timezoneOffset-seoul.getTimezoneOffset()) * 60 * 1000));

        console.log(Date.formatDate(seoul));  // 2017/3/11 11:30
        console.log(Date.formatDate(ny));     // 2017/3/10 21:30
    }

    handleUpdatePriority(person, priority){
        //TODO: update priority of name
        console.log(person.name + "'s priority is: " + priority);
    }

    handleUpdateCheckBox(person, status){
        //TODO: update checkbox of name
        console.log(person.name + " has been selected: " + status);
    }

    handleUpdateDB(response){
        console.log("Updating database");
        const name = document.getElementById("user-name-input").value;
        if (this.state.userID !== ""){
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

    handleNameChange(e){
        this.setState({
            userName: e.target.value
        })
    }

    initialResponseMatrix(){
        const response = new Array(this.props.showTimeSlot.length);
        const width = this.props.showTimeSlot[0].length;
        for (let i = 0; i < response.length; i++){
            response[i] = new Array(width).fill(0);
        }
        return response;
    }

    //returns only the events that matter
    importantEvents(events){
        var importantEvents = [];
        events.forEach(element => {
            if(element.status != "cancelled" && this.validTime(element.start.dateTime)){
                console.log("added Event:" + element.summary + " to list of calander events")
                importantEvents.push(element);
            }
        });
        return importantEvents;
    }

    validTime(time){
        // console.log("Start" + Date.parse(this.state.days[0])); how to get javascript date into unixt time
        var dayOfEvent = new Date(Date.parse(time)); //Date.parse converts to unix time (1600000000 thing), new Date converts to javascript time
        for(var i = 0; i < this.state.days.length;i++){ //checks if event is say day as any day in calander
            if(DateUtils.isSameDay(this.state.days[i],dayOfEvent)){ return true};
        }
        return false;
    }

    handleCalenderClick(name){
        if (name === 'sign-in') {
            ApiCalendar.handleSignoutClick();
            this.setState({signedIn:false})
            if(!ApiCalendar.sign){
                ApiCalendar.handleAuthClick();
            }
          if (ApiCalendar.sign && !this.state.signedIn){
            //ApiCalendar.listUpcomingEvents(5).then(({ result }) => {   //gets 5 upcoming events //unsure what upcoming is defined at
            ApiCalendar.listEvents().then(({ result }) => { //gets all event in calander
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

    getResponses(mode,groupList){
        if(mode == "G"){
            return groupList
        }
        else{
            return this.state.responses
        }
    }

    PeopleResponses(response) {
        return (
            <tr>
                <td className="responses_name">
                    <Form.Group controlId={response.id + '_checkbox'} className='response'>
                        <Form.Check type="checkbox" label={response.name} onChange={(e) => this.handleUpdateCheckBox(response, e.target.value)}/>
                    </Form.Group>
                </td>
                <td className="responses_range">
                    <input type="range" id={response.id + "_range"} min="1" max="5" step="1" onChange={(e) => this.handleUpdatePriority(response, e.target.value)}/>

                </td>

            </tr>
        );
    }

    GroupResponses(group) {
        return (
            <tr>
                <td className="responses_name">
                    <Form.Group controlId={group + '_checkbox'} className='response'>
                        <Form.Check type="checkbox" label={group} onChange={(e) => this.handleUpdateCheckBox(group, e.target.value)}/>
                    </Form.Group>
                </td>
                <td className="responses_range">
                    <input type="range" id={group + "_range"} min="1" max="5" step="1" onChange={(e) => this.handleUpdatePriority(group, e.target.value)}/>

                </td>

            </tr>
        );
    }

    GroupOrPeopleResponses() {
        if (this.state.priorityType === "P"){
            console.log("People Responses");
            if (this.state.responses.length === 0){
                return (
                    <div>
                        There are no responses yet.
                    </div>
                );
            }
            return (
                <>
                    <tr>
                        <td/>
                        <td className="flex">
                            <h7>low</h7>
                            <h7>high</h7>
                        </td>
                    </tr>
                    {this.state.responses.map((response) => this.PeopleResponses(response))}
                </>
            );
        }
        else{
            console.log("Group Responses");
            return (
                <>
                    <tr>
                        <td/>
                        <td className="flex">
                            <h7>low</h7>
                            <h7>high</h7>
                        </td>
                    </tr>
                    {this.state.groupList.map((group) => this.GroupResponses(group))}
                </>
            );
        }
    }

    NameAndSubmit(){
        return (
            <div className="flex">
                        <form>
                            <input id="user-name-input" type="text" className="form-control" placeholder="Your Name" onChange={this.handleNameChange}/>
                        </form>
                        <button id="update-availability-button" onClick={() => {
                            if(this.inputTable != null){
                                const availability = this.inputTable.current.GetResponse();
                                if (availability != null){
                                if(this.state.userName === ""){
                                    alert("Please enter your name.");
                                }
                                else if(availability.flat().reduce((total, num) => {return total + num}) === 0){
                                    alert("Please select some availabilities.");
                                }
                                else {
                                    console.log("Updating availability");

                                    this.handleUpdateDB(availability)           
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
                        </button>
                    </div>

        );
    }

    GetEvents(){
        if (this.state.signedIn){
            return(
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

    addEvents(){
        this.state.events.forEach()
        //table.rows[3].cells[2].innerHTML = "testEvent";
    }

    getRowfromTime(time){
        var timeInMins = time.getHours() *60 + time.getMinutes();
        return(Math.floor((timeInMins - this.state.minStart)/15) +1)
    }

    getCol(time){
        var dayOfEvent = new Date(Date.parse(time));
        for(var i = 0; i < this.state.days.length;i++){ //checks if event is say day as any day in calander
            if(DateUtils.isSameDay(this.state.days[i],dayOfEvent)){ return i+1};
        }
    }

    getLocation(e){
        console.log(e.summary);
        var startTime  = new Date(Date.parse(e.start.dateTime));
        var endTime = new Date(Date.parse(e.end.dateTime));
        var startRow = this.getRowfromTime(startTime);
        var endRow = this.getRowfromTime(endTime);
        var col = this.getCol(startTime)
        return [startRow,endRow,col]
    }

    addEvent(event){
        var location;
        if(this.inputTable != null){
            //console.log("table" + table)
            //this.setState({eventAdded:true})
            var table = document.getElementById("userInputTable");
            console.log("table" + table)
            if(table != null){
                this.state.events.forEach((e) => {
                    location = this.getLocation(e);
                    table.rows[location[0]].cells[location[2]].innerHTML = e.summary;
                })
            }

        }
        //table.rows[3].cells[2].innerHTML = "testEvent";
    }

    GoogleCalendarInput(){


        if(this.state.signedIn){
            return(
                <>
                   <div className="flex-child">
                        <TimeSlotTable ref = {this.inputTable} 
                        isInputTable = {true}
                        type={this.state.daytype} 
                        dates={this.state.days}
                        showTimeSlot={this.state.showTimeSlotTable}
                        minStartTime={this.state.minStart}
                        handleUpdateDB={this.handleUpdateDB}
                        perferred= {true}
                        events = {this.state.events}
                        tableID = "userInputTable"
                        />
                </div>
                </>

            );
        }
        else{
            return (
                <p>
                    <button
                    onClick={(e) => this.handleCalenderClick('sign-in')}
                >
                    sign-in
                </button>
                </p>
            );
        }
    }

    InputTable(){

        return (
            <div className="flex-child">
                <TimeSlotTable ref = {this.inputTable} 
                    isInputTable = {true}
                    type={this.state.daytype} 
                    dates={this.state.days}
                    showTimeSlot={this.state.showTimeSlotTable}
                    minStartTime={this.state.minStart}
                    handleUpdateDB={this.handleUpdateDB}
                    perferred= {true}
                    events = {[]}
                    tableID="userInputTable"
                    />
            </div>
        );
    }

    InputOptions(){
        switch (this.state.inputChoice) {
            case this.inputOptions.OPTIONS:
                return (
                    <div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        
                        <button id="get-google-calendar-button" onClick={() => {
                                    this.setState({
                                        inputChoice: this.inputOptions.GOOGLE_CALENDAR
                                    });
                                }}>
                            Get availabilites from Google Calendar
                        </button>
        
                        <br/>
                        <br/>
                        <br/>
        
                        <button id="get-input-table-button" onClick={() => {
                                    this.setState({
                                        inputChoice: this.inputOptions.MANUAL
                                    });
                                }}>
                            Input availabilities manually
                        </button>
        
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


    render() {
        if (this.state.days.length === 0){
            console.log("Loading database still")
            return (
              <div>
                  <p>This is a loading page.</p>
              </div>
            );
        }
        else {
            console.log(this.state);
            //var responses = this.getResponses(this.state.priorityType, this.state.groupList);
            return (
                <div className="ViewPage">
                    <h1>View Page</h1>
                    <br/>
                    <br/>
                    

                    <div className="flex">
                        <div className="flex-child">
                            <h4>{(this.state.priorityType === "G" ? "Groups" : "Responses")}</h4>
                            <br/>
                            {this.GroupOrPeopleResponses()}
                        </div>
                        
                        {this.InputOptions()}
                        {this.addEvent()}
                        <div className="flex-child">
                            <TimeSlotTable ref = {this.responsesTable}
                                           isInputTable = {false}
                                           type={this.state.daytype} 
                                           dates={this.state.days}
                                           showTimeSlot={this.state.showTimeSlotTable}
                                           minStartTime={this.state.minStart}
                                           perferred = {false}
                                           events = {[]}
                                            tableID="meetingTable"
                                           />
                                           {/*colorMap={outputColorMap(this.state.responses, null, false)}*/}
                                           {/*TODO make it work with groups too*/}
                        </div>
                    </div>
                    <br/>
                    {this.NameAndSubmit()}
                    <br/>
                    <br/>
                    <br/>
                </div>
            );
        }
    }
}

export default ViewPage;