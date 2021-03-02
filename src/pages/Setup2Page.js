import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import history from './../history'


class Setup2Page extends Component{
    
    daysofweekMode() {
        const state = this.props.location.state 
        return(    
            <> 
                <h1>Days Slected</h1>
                <h2>{(state.type && state.days[0]) ? "mon" : ""}</h2>
                <h2>{(state.type && state.days[1]) ? "tue" : ""}</h2>
                <h2>{(state.type && state.days[2]) ? "wed" : ""}</h2>
                <h2>{(state.type && state.days[3]) ? "thu" : ""}</h2>
                <h2>{(state.type && state.days[4]) ? "fri" : ""}</h2>
                <h2>{(state.type && state.days[5]) ? "sat" : ""}</h2>
                <h2>{(state.type && state.days[6]) ? "sun" : ""}</h2>
            </>
        );
    }

    calanderMode() {
        const state = this.props.location.state 
        return(    
            <> 
                {state.days.forEach(day => day)};
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
    
    render() {
        //get things passed from the previous page
        const state = this.props.location.state 
        return (
            <div className="Setup2Page">
                <h1>Setup2 Page</h1>
                start:  {state.start} 
                end:  {state.end}

                <div className="time_table">
                    {this.timeTable()}
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