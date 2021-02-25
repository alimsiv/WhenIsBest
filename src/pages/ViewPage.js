import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import TimeSlotTable from "../shared/TimeSlotTable";
import '../styling/Setup1Page.css';



class ViewPage extends Component{

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.state = {
            dateTimes: [[new Date(2021, 1, 22), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
                        [new Date(2021, 1, 26), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
                        [new Date(2021, 1, 27), ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]]],
            dates: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            /*times: [[new Date(2021, 1, 22, 8, 0), new Date(2021, 1, 22, 16, 0)],
                [new Date(2021, 1, 26, 8, 0), new Date(2021, 1, 27, 16, 0)],
                [new Date(2021, 1, 26, 8, 0), new Date(2021, 1, 27, 16, 0)]],*/
            times: [["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"], ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"], ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]],
            //times: [[new Date()], "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]
            timezoneOffset: 0,
            minStartTime: 0, //The earliest time slot for the range of dates/days chosen
            maxStopTime: 0, //The latest time slot for the range of dates/days chosen
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
                    <TimeSlotTable dates={this.state.dates} times={this.state.times} minStartTime={this.state.minStartTime} maxEndTime={this.state.maxEndTime}/>
                </div>


            </div>
        );
    }
}

export default ViewPage;