import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import TimeSlotTable from "../shared/TimeSlotTable";
import '../styling/Setup1Page.css';



class ViewPage extends Component{

    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.state = {
            //headerTitles: ["Sun","Mon","Tues","Wed","Thurs","Fri","Sun"],
            //headerTitles: [Wed Feb 10 2021 12:00:00 GMT-0500 (hora estándar oriental), Tue Feb 09 2021 12:00:00 GMT-0500 (hora estándar oriental), Tue Feb 16 2021 12:00:00 GMT-0500 (hora estándar oriental), Fri Feb 12 2021 12:00:00 GMT-0500 (hora estándar oriental), Fri Feb 19 2021 12:00:00 GMT-0500 (hora estándar oriental)],
            headerTitles: [new Date(2021, 1, 22),new Date(2021, 1, 25),new Date(2021, 1, 28)],
            times: ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]
        }
    }


    render() {
        return (
            <div className="ViewPage">
                <NavigationBar/>
                <h1>View Page</h1>

                <TimeSlotTable headerTitles={this.state.headerTitles} times={this.state.times}/>


            </div>
        );
    }
}

export default ViewPage;