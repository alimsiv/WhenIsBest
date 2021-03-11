import { Component } from 'react'
import {Table} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import history from './../history'
import TimeSlotTable from "../shared/TimeSlotTable";
import {AiFillInfoCircle} from "react-icons/ai";
import { Button } from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Popup from 'reactjs-popup';


class Setup2Page extends Component{
    
    constructor(props) {
        super(props);

        this.handleGroupListChange = this.handleGroupListChange.bind(this);
        this.handleGroupListRemove = this.handleGroupListRemove.bind(this);
        this.handleAddGroup = this.handleAddGroup.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handlePopup = this.handlePopup.bind(this);
        this.state = {
            groupList: ["",""],
            mode: "P",
            showPop: false
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

    handlePopup(msg,show){
        console.log(msg);
        if(this.state.showPop != show){
            this.setState({showPop: show});
            console.log(this.state.showPop);
        }
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
                <div>
                What type of form
                <IconButton aria-label="info"
                    onClick={() => this.handlePopup("button",true)}
                    //onMouseLeave={() => this.handlePopup("bad button",false)}
                    >
                       <InfoIcon/> 
                </IconButton>
                </div>
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

    makeTimeSlots(timeslots, days){
        var innerArr = [];
        var showTimeSlot = [];
        //make an inner array with all true
        for(var j = 0; j < days; j++){
            innerArr.push(true);
        }

        //add an inner array to showTimeSlot for each timeslot
        for(var i = 0; i < timeslots;i++ ){
            showTimeSlot.push(innerArr);
        }

        return showTimeSlot;

    }


    daysofweekMode() {
        const state = this.props.location.state 
        var weekdays = ["Monday","Tuesday","Wednesday","Thursday", "Friday", "Saturday", "Sunday"]
        var days = [];
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

        var showTimeSlot = this.makeTimeSlots(timeslots,days.length);

        return(    
            <> 
                <TimeSlotTable type = {state.type} dates={days} showTimeSlot={showTimeSlot} minStartTime={minStart}/>
            </>
        );
    }

    pop(){
            return(
                <Popup open={this.state.showPop} closeOnDocumentClick onClose= { () => this.handlePopup("autopopup",false)} >
                    < div style={{backgroundColor: "lightblue"}}>
                    if you select groups, when someone fills out their avaiblity, they will be asked to select a group.<br/>
                    Later, you can proitize by group, or set requirements on numbers of people from each group.<br/>
                    This is recommend if you have a large number of people filling out your form<br/><br/>

                    if you select people, you will be able to set the priority of each individaul person<br/>
                    <button onClick={ () => this.handlePopup("popup",false)}>close </button>
                    </div>
                </Popup>
            )
    }

    calanderMode() {
        const state = this.props.location.state;
        var timeStuff = this.startAndEndStuff();
        var minStart = timeStuff[1];
        var timeslots = timeStuff[0];
        var showTimeSlot = this.makeTimeSlots(timeslots,state.days.length);
        return(    
            <> 
                <TimeSlotTable type = {state.type} dates={state.days} showTimeSlot={showTimeSlot} minStartTime={minStart}/> 
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
                <h1>{state.name}</h1>
                Please select the times you would like to be avaiblile as well as the type
                <div className="flex">
                    <div className="flex-child">
                        {
                            //TODO: List of who has responded and sliders/checkmarks
                        }
                    </div>
                <div className="flex-child"></div>
                    {this.timeTable()}
                    {this.groups()}
                    {this.pop()}
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