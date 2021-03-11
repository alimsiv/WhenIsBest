import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import history from './../history'
import TimeSlotTable from "../shared/TimeSlotTable";


class Setup2Page extends Component{
    
    constructor(props) {
        super(props);

        this.handleGroupListChange = this.handleGroupListChange.bind(this);
        this.handleGroupListRemove = this.handleGroupListRemove.bind(this);
        this.handleAddGroup = this.handleAddGroup.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.state = {
            groupList: ["",""],
            mode: "P"
        }

    }

    handleGroupListChange(e,index){
        const {value} = e.target;
        const ls = this.state.groupList;
        if(this.state.groupList[index] != value){
            ls[index] = value;
            this.setState({groupList: ls});
        }
    }

    handleGroupListRemove(index){
        const ls = this.state.groupList;
        ls.splice(index,1);
        this.setState({groupList:ls});

    }
    
    handleAddGroup(){
        var temp = this.state.groupList;
        temp.push(" ");
        this.setState({groupList:temp})
    }

    handleModeChange(type){
        if(this.state.type != type){
            this.setState({type: type});
        }
        console.log(this.state.type);
    }


    handlegroupList(){
        var temp = this.state.groupList;
        return(
        //<div>
        temp.map((x, i) => {
            return(
                <>
            <div className="box">
            <input
              name="groupName"
                placeholder="Enter Group Name"
              value={x}
              onChange={e => this.handleGroupListChange(e, i)}
            />
              {this.state.groupList.length >2 && <button
                className="mr10"
                onClick={() => this.handleGroupListRemove(i)}>Remove</button>}
            </div>
            <div>
              {this.state.groupList.length - 1 === i && <button onClick={() => this.handleAddGroup()}>Add</button>}
            </div>
            </>
            )
        })
        //</div>

        );
    }

    groups(){
        return(
            <>
            <div>
            <form>
                <p>What type of form</p>
                <input type="radio" name="chooseone" value="Group"onClick={() => this.handleModeChange("G")}/><label for="Group"> Group</label><br/>
                <input type="radio" name="chooseone" value="Person"onClick={() => this.handleModeChange("P")}/><label for="Person"> Person</label><br/>
            </form>
            <div>
            {this.state.type == "G" ? this.handlegroupList(): ""}
            </div>
            </div>
            </>
        )
    }



    startAndEndStuff(){
        const state = this.props.location.state 
        var stSplit = state.start.split(':');
        var sthr = parseInt(stSplit[0]);
        var stmin = parseInt(stSplit[1]);

        var endSplit = state.end.split(':');
        var endhr = parseInt(endSplit[0]);
        var endmin = parseInt(endSplit[1]);

        var timeslots = (endhr - sthr) * 4;
        timeslots += Math.ceil((endmin - stmin) / 15);

        var minStart = sthr * 60 + (Math.ceil(stmin / 15) *15)

        return [timeslots,minStart]
    }


    daysofweekMode() {
        const state = this.props.location.state 
        var weekdays = ["Monday","Tuesday","Wednesday","Thursday", "Friday", "Saturday", "Sunday"]
        var days = [];
        var innerArr = [];
        const showTimeSlot = [];
        //var timeslots = (state.end - state.start) * 4; //number of 15 min timeslots we need (will need to change to account for minutes)

        var timeStuff = this.startAndEndStuff();
        var minStart = timeStuff[1];
        var timeslots = timeStuff[0];
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
                <TimeSlotTable type = {state.type} dates={days} showTimeSlot={showTimeSlot} minStartTime={minStart}/>
            </>
        );
    }

    calanderMode() {
        const state = this.props.location.state 
        return(    
            <> 
                Calander mode is not done yet. Go back and select days of week. 
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