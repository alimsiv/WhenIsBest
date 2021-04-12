import React, { Component } from 'react';
import { Form, Toast } from 'react-bootstrap';
import TimeSlotTable from "../shared/TimeSlotTable";
import { getMeetingInfo, fixTable, fixDays, getResponses, addResponseToDB, updateResponseInDB } from "../database/database";
import '../styling/styles.css';
import { outputColorMap } from '../shared/temp_alg';


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
        this.inputTable = React.createRef();

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
            showAdvancedSettings: false,

            //TODO set to authenticated user id if logged in
        }
    }


    async componentDidMount() {
        const meetingID = this.getID();
        const info = await getMeetingInfo(meetingID);
        const twoDTable = fixTable(info.showTimeSlot, info.tableCol);
        const days = (info.daytype === 1) ? info.days : fixDays(info.days);
        const responseList = await getResponses(meetingID);

        this.setState({
            meetingID: meetingID,
            days: days,
            minStart: info.minStart,
            showTimeSlotTable: twoDTable,
            daytype: info.daytype,
            name: info.name,
            hostID: info.hostID,
            priorityType: info.priorityType,
            groupList: info.groupList,
            responses: responseList
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

    handleUpdatePriority(person, priority) {
        //TODO: update priority of name
        console.log(person.name + "'s priority is: " + priority);
    }
    
    handleUpdateMinRequired(group, minRequired) {
        //TODO: update min required of group
        console.log(group + " requires at least: " + minRequired);
    }

    handleUpdateCheckBox(person, status) {
        //TODO: update checkbox of name
        console.log(person.name + " has been selected: " + status);
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

    getResponses(mode, groupList) {
        if (mode == "G") {
            return groupList
        }
        else {
            return this.state.responses
        }
    }

    PeopleResponses(response) {
        return (
            <tr className="responses_row">
                {this.state.showAdvancedSettings && <td className="responses_checkbox">
                        <Form.Group controlId={response.id + '_checkbox'} className='response'>
                            <Form.Check type="checkbox" onChange={(e) => this.handleUpdateCheckBox(response, e.target.value)} />
                        </Form.Group>
                </td>}
                <td className="responses_name">{response.name}</td>
                {this.state.showAdvancedSettings && <td className="responses_range">
                        <input type="range" id={response.id + "_range"} min="1" max="5" step="1" onChange={(e) => this.handleUpdatePriority(response, e.target.value)} />
                </td>}
            </tr>
        );
    }

    GroupResponses(group) {
        return (
            <tr className="responses_row">
                <td className="responses_name">
                    <Form.Group controlId={group + '_checkbox'} className='response'>
                        <Form.Check type="checkbox" label={group} onChange={(e) => this.handleUpdateCheckBox(group, e.target.value)} />
                    </Form.Group>
                </td>
                <td className="responses_range">
                    <input type="range" id={group + "_range"} min="1" max="5" step="1" onChange={(e) => this.handleUpdatePriority(group, e.target.value)} />
                </td>
                <td className="responses_required">
                    <input type="form" id={group + "_required"} onChange={(e) => this.handleUpdateMinRequired(group, e.target.value)} />
                </td>

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
            responses = this.state.responses.map((response) => this.PeopleResponses(response));
            /*
            return (
                <>
                    <tr>
                        <td />
                        <td />
                        <td className="flex">
                            <h7>low</h7>
                            <h7>high</h7>
                        </td>
                    </tr>
                    {this.state.responses.map((response) => this.PeopleResponses(response))}
                </>
            );
            */
        }
        else {
            console.log("Group Responses");
            responses = this.state.groupList.map((group) => this.GroupResponses(group));
        }
            return (
                <>
                    {this.state.showAdvancedSettings && <tr>
                        <td />
                        <td />
                        <td className="flex">
                            <h7>low</h7>
                            <h7>high</h7>
                        </td>
                    </tr>}
                    {responses}
                </>
            );
    }

    NameAndSubmit() {
        return (
            <div className="flex">
                <form>
                    <input id="user-name-input" type="text" className="form-control" placeholder="Your Name" onChange={this.handleNameChange} />
                </form>
                <button id="update-availability-button" onClick={() => {
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
                                return (
                                    <Toast>
                                        <Toast.Header>
                                            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                                            <strong className="mr-auto">Your availability has been added.</strong>
                                            <small>Thank you!</small>
                                        </Toast.Header>
                                        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
                                    </Toast>);
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
                        </button >
            </div >

        );
    }

    GoogleCalendarInput() {
        return (
            <p>
                google calendar integration
            </p>
        );
    }

    InputTable() {
        return (
            <div className="flex-child">
                <TimeSlotTable ref={this.inputTable}
                    isInputTable={true}
                    type={this.state.daytype}
                    dates={this.state.days}
                    showTimeSlot={this.state.showTimeSlotTable}
                    minStartTime={this.state.minStart}
                    handleUpdateDB={this.handleUpdateDB}
                    perferred={true}
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

                        <button id="get-google-calendar-button" onClick={() => {
                            this.setState({
                                inputChoice: this.inputOptions.GOOGLE_CALENDAR
                            });
                        }}>
                            Get availabilites from Google Calendar
                        </button>

                        <br />
                        <br />
                        <br />

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

    Responses() {
        return (
            <div className="flex-child">
                <div className="flex">
                    <div className="flex-child">
                        <h4>{(this.state.priorityType === "G" ? "Group Responses" : "Responses")}</h4>
                    </div>
                    <div className="flex-child">
                        <button id="advanced-settings-button" onClick={() => {
                            this.setState({
                                showAdvancedSettings: !this.state.showAdvancedSettings
                            });
                        }}>
                            {this.state.showAdvancedSettings ? "Hide advanced settings" : "Show advanced settings"}
                        </button>
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

                        <div className="flex-child">
                            <TimeSlotTable ref={this.responsesTable}
                                isInputTable={false}
                                type={this.state.daytype}
                                dates={this.state.days}
                                showTimeSlot={this.state.showTimeSlotTable}
                                minStartTime={this.state.minStart}
                                perferred={false}
                            />
                            {/*colorMap={outputColorMap(this.state.responses, null, false)}*/}
                            {/*TODO make it work with groups too*/}
                        </div>
                    </div>
                    <br />
                    {(this.state.inputChoice != this.inputOptions.OPTIONS) && this.NameAndSubmit()}
                    <br />
                    <br />
                    <br />

                </div>
            );
        }
    }
}

export default ViewPage;