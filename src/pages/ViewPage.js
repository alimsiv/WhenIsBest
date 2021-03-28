import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import TimeSlotTable from "../shared/TimeSlotTable";
import {getMeetingInfo, fixTable, fixDays, getResponses} from "../database/database";
import '../styling/styles.css';


class ViewPage extends Component{

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week

        this.state = {
            days: [],
            minStart: [],
            showTimeSlotTable: [],
            daytype: [],
            name: [],
            hostID: [],
            priorityType: [], //"G" for group, "P" for person
            groupList: [], //List of group names
            responses: ["Marlee", "Ali", "Levi"],
            userName: [],
            userGroup: [],

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

    getResponses(mode,groupList){
        if(mode == "G"){
            return groupList
        }
        else{
            return this.state.responses
        }
    }

    PeopleResponses(response) {
/*
        return (
            <tr>
                <td className="responses_name">
                <Form.Group controlId={response + '_checkbox'} className='response'>
                    <Form.Check type="checkbox" label={response} />
                </Form.Group>
                </td>
                <td className="responses_range">
                <Form.Group controlId={response + '_range'}>
                    <Form.Control type="range" custom
                                  onChange={(e) => this.handleUpdatePriority(response, e.target.value)} />
                </Form.Group>
                </td>

            </tr>
        );

 */
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

                    <div className="flex">
                        <div className="flex-child">
                            <h4>{(this.state.priorityType == "G" ? "Groups" : "Responces")}</h4>
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
                            <TimeSlotTable type={this.state.daytype} dates={this.state.days}
                                           showTimeSlot={this.state.showTimeSlotTable}
                                           minStartTime={this.state.minStart}/>
                        </div>
                    </div>

                </div>
            );
        }
    }
}

export default ViewPage;