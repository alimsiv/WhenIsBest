import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import TimeSlotTable from "../shared/TimeSlotTable";
import {getMeetingInfo, fixTable, fixDays, getResponses, addResponseToDB, updateResponseInDB} from "../database/database";
import '../styling/styles.css';


class ViewPage extends Component{

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week

        this.handleUpdateDB = this.handleUpdateDB.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.currentTable = React.createRef();

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
            responses: responseList
        });
    }

    getID() {
        const url = window.location.href.toString();
        const url_split = url.split("/");
        const id = url_split.slice(-1)[0];
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
                            if(this.currentTable != null){
                                const availability = this.currentTable.current.responses;
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
                                console.log("TimeSlotTable does not exist yet.");
                            }
                            }}>
                            Add Availability
                        </button>
                    </div>

        );
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
                        <div className="flex-child">
                            {
                                //TODO: input from user
                            }
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <p>Input from user here</p>
                        </div>
                        <div className="flex-child">
                            <TimeSlotTable ref = {this.currentTable} type={this.state.daytype} 
                                           dates={this.state.days}
                                           showTimeSlot={this.state.showTimeSlotTable}
                                           minStartTime={this.state.minStart}
                                           handleUpdateDB={this.handleUpdateDB}
                                           AddAvailabilityButton={this.AddAvailabilityButton}/>
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