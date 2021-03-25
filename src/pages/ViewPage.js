import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import NavigationBar from '../shared/NavigationBar';
import TimeSlotTable from "../shared/TimeSlotTable";
import '../styling/styles.css';


class ViewPage extends Component{


    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.state = {
            dates: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            weekdays: ["Monday","Tuesday","Wednesday"],
            showTimeSlot: [[true, true, true], [false, false, false], [false, true, true], [false, true, true], [true, true, false], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true]],
            minStartTime: 540, //The earliest time slot for the range of dates/days chosen (minutes since midnight)
            timezoneOffset: 0,
            responses: ["Marlee", "Ali", "Levi"],



            //NOTE: Leaving these all commented out for now, just in case we decide to change the implementation back to one of these. Sorry for the mess -Ali

            /*times: [[new Date(2021, 1, 22, 8, 0), new Date(2021, 1, 22, 16, 0)],
                [new Date(2021, 1, 26, 8, 0), new Date(2021, 1, 27, 16, 0)],
                [new Date(2021, 1, 26, 8, 0), new Date(2021, 1, 27, 16, 0)]],*/
            //times: [["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"], ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"], ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
            //times: [[new Date()], "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]
            //maxStopTime: 0, //The latest time slot for the range of dates/days chosen
            /*dateTimes: [[new Date(2021, 1, 22), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
                [new Date(2021, 1, 26), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
                [new Date(2021, 1, 27), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]]],*/
        }
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
        var tableInfo = this.props.location.state;
        return (
            <div className="ViewPage">
                <h1>View Page</h1>

                <div className="flex">
                    <div className="flex-child">
                        <h4>Responses</h4>
                        <br/>
                        <tr>
                            <td/>
                            <td className="flex">
                                <h7>low</h7>
                                <h7>high</h7>
                            </td>
                        </tr>
                        {this.state.responses.map((response) => this.LeftSide(response))}
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
                        <TimeSlotTable type = {tableInfo.type} dates={tableInfo.days} showTimeSlot={tableInfo.showTimeSlotTable} minStartTime={tableInfo.minStart}/>
                    </div>
                </div>


            </div>
        );
    }
}

export default ViewPage;