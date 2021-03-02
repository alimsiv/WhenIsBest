import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import TimeSlotTable from "../shared/TimeSlotTable";
import '../styling/styles.css';



class ViewPage extends Component{

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.state = {
            dates: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            showTimeSlot: [[true, true, true], [false, false, false], [false, true, true], [false, true, true], [true, true, false], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true], [true, true, true]],
            minStartTime: 540, //The earliest time slot for the range of dates/days chosen (minutes since midnight)
            timezoneOffset: 0,


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


    render() {

        return (
            <div className="ViewPage">
                <h1>View Page</h1>

                <div className="flex">
                    <div className="flex-child">
                        {
                            //TODO: List of who has responded and sliders/checkmarks
                        }
                    </div>
                    <div className="flex-child">
                        <TimeSlotTable dates={this.state.dates} showTimeSlot={this.state.showTimeSlot} minStartTime={this.state.minStartTime}/>
                    </div>
                </div>


            </div>
        );
    }
}

export default ViewPage;