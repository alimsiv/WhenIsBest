import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../shared/NavigationBar';
import TimeSlotTable from "../shared/TimeSlotTable";
import {getMeetingInfo, fixTable, fixDays} from "../database/database";
import '../styling/styles.css';
import firebase from "firebase";
import history from "../history";


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
            priorityType: [],
            groupList: [],
            responses: ["Marlee", "Ali", "Levi"],

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

        this.setState({
            days: days,
            minStart:info.minStart,
            showTimeSlotTable:twoDTable,
            daytype: info.daytype,
            name: info.name,
            hostID: info.hostID,
            priorityType:info.priorityType,
            groupList:info.groupList

            /*
            dates: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            weekdays: ["Monday","Tuesday","Wednesday"],
            showTimeSlot: [[true, true, true], [false, false, false], [false, true, true], [false, true, true], [true, true, false], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true]],
            minStartTime: 540, //The earliest time slot for the range of dates/days chosen (minutes since midnight)
            timezoneOffset: 0,
            responses: ["Marlee", "Ali", "Levi"],
            */

        });
    }

    getID() {
        const url = window.location.href.toString();
        const url_split = url.split("/");
        const id = url_split.slice(-1)[0];
        console.log("CONSOLE url: " + url_split);
        console.log("CONSOLE id: " + id);
        return id;
    }

    AdjustTimezone() {
        const seoul = new Date(1489199400000);
        const ny = new Date(1489199400000 - ((this.state.timezoneOffset-seoul.getTimezoneOffset()) * 60 * 1000));

        console.log(Date.formatDate(seoul));  // 2017/3/11 11:30
        console.log(Date.formatDate(ny));     // 2017/3/10 21:30
    }

    handleUpdatePriority(name, priority){
        //TODO: update priority of name
        console.log(name + "'s priority is: " + priority);
    }

    getResponses(mode,groupList){
        if(mode == "G"){
            return groupList
        }
        else{
            return this.state.responses
        }
    }

    handleUpdateCheckBox(name, status){
        //TODO: update checkbox of name
        console.log(name + " has been selected: " + status);
    }

    LeftSide(response) {
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
                    <Form.Group controlId={response + '_checkbox'} className='response'>
                        <Form.Check type="checkbox" label={response} onChange={(e) => this.handleUpdateCheckBox(response, e.target.value)}/>
                    </Form.Group>
                </td>
                <td className="responses_range">
                    <input type="range" id={response + "_range"} min="1" max="5" step="1" onChange={(e) => this.handleUpdatePriority(response, e.target.value)}/>

                </td>

            </tr>
        );
    }

    render() {
        if (this.state.days.length === 0){
            console.log("This is where we want to be")
            return (
              <div>
                  <p>This is a loading page.</p>
              </div>
            );
        }
        else {
            var responses = this.getResponses(this.state.priorityType, this.state.groupList);
            return (
                <div className="ViewPage">
                    <h1>View Page</h1>

                    <div className="flex">
                        <div className="flex-child">
                            <h4>{(this.state.priorityType == "G" ? "Groups" : "Responces")}</h4>
                            <br/>
                            <tr>
                                <td/>
                                <td className="flex">
                                    <h7>low</h7>
                                    <h7>high</h7>
                                </td>
                            </tr>
                            {responses.map((response) => this.LeftSide(response))}
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