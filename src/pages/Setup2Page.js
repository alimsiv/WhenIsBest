import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import history from './../history'
import TimeSlotTable from "../shared/TimeSlotTable";


class Setup2Page extends Component{
    
    daysofweekMode() {
        const state = this.props.location.state 
        var weekdays = ["Monday","Tuesday","Wednesday","Thursday", "Friday", "Saturday", "Sunday"]
        var days = [];
        var innerArr = [];
        const showTimeSlot = [];
        var timeslots = (state.end - state.start) * 4; //number of 15 min timeslots we need (will need to change to account for minutes)

        //translates true/false format into days of week
        for(var i = 0; i < 7;i++){
            if(state.days[i]){
               days.push(weekdays[i]); 
            }
        }

        //make an inner array with all true
        for(var j = 0; j < days.length; j++){
            innerArr.push(true);
        }

        //add an inner array to showTimeSlot for each timeslot
        for(var i = 0; i < timeslots;i++ ){
            showTimeSlot.push(innerArr);
        }

        return(    
            <> 
                <TimeSlotTable type = {state.type} dates={days} showTimeSlot={showTimeSlot} minStartTime={state.start*60}/>
            </>
        );
    }

    calanderMode() {
        const state = this.props.location.state 
        return(    
            <> 
                {state.days.forEach(day => day)}
            </>
        );
    }
    
    timeTable() {
        //true = days of week, false = calander
        if(this.props.location.state.type){
            return this.daysofweekMode();
        }
        else{
            return this.calanderMode();
        }
    }

    groups(){
        return(
            <h2>priority/group stuff</h2>


        )
    }
    
    render() {
        //get things passed from the previous page
        const state = this.props.location.state 
        return (
            <div className="Setup2Page">
                <h1>Setup2 Page</h1>
                <div className="flex">
                    <div className="flex-child">
                        {
                            //TODO: List of who has responded and sliders/checkmarks
                        }
                    </div>
                <div className="flex-child"></div>
                    {this.timeTable()}
                    {this.groups()}
                </div>
                <button onClick={() => {history.goBack()}}>Back</button>
                <button onClick={() => {history.push({ 
                                                            pathname: '/view',
                                                            //pass things through state
                                                            state: {days: 2,
                                                                    type: state.type}
                                                            })}}>Continue</button>
            </div>
        );
    }
}

export default Setup2Page;