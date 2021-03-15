import { Component, Text, View } from 'react'
import { Button } from '@material-ui/core';
import {Dropdown, Nav, Navbar} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import TimezoneDropdown from "../shared/TimezoneDropdown";
import TimeSlotTable from "../shared/TimeSlotTable";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../styling/styles.css';
import history from './../history'
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import TimePicker from 'react-time-picker';
import TableDragSelect from "react-table-drag-select";

class Setup1Page extends Component{
    dateTypes = ["Specific Dates", "Days of the Week"];

    constructor(props) {
        super(props);

        this.handleMonthViewDaySelected = this.handleMonthViewDaySelected.bind(this);
        this.handleDateTypesChanged = this.handleDateTypesChanged.bind(this);
        this.handleTimeRangeChanged = this.handleTimeRangeChanged.bind(this);
        this.handleTimeRangeStartChanged = this.handleTimeRangeStartChanged.bind(this);
        this.handleTimeRangeEndChanged = this.handleTimeRangeEndChanged.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);

        this.state = {
            //0 for Specific Dates, 1 for Days of the Week
            dateType: 0,
            start: '8:00', end: '17:00', 
            mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false,
            selectedDays: [],
            timezoneOffset: 0 //getTimeZoneOffset, opposite sign, time in minutes (NY=-540)
        }
    }

    handleMonthViewDaySelected(day, {selected}) {
        const {selectedDays} = this.state;
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay, day)
            );
            selectedDays.splice(selectedIndex, 1);
        } else if(!DateUtils.isPastDay(day)) {
            selectedDays.push(day);
        }
        else{
            console.log("day is in past, day ignored");
        }
        this.setState({selectedDays});
        console.log(this.state.selectedDays)
        console.log(selectedDays.to)
    }

    handleDateTypesChanged(newType) {
        console.log('Date type changed')
        console.log('current: ' + this.state.dateType)
        console.log('new: ' + newType)
        if (this.state.dateType !== newType){
            this.setState({dateType:newType});
        }
    }

    handleTimeRangeChanged(newStart,newEnd) {
        console.log('Time range changed')
        if (this.state.start !== newStart){
            this.setState({start:newStart});
        }
        if (this.state.end !== newEnd){
            this.setState({end:newEnd});
        }
    }

    handleTimeRangeStartChanged(newStart) {
        console.log('Time range changed')
        if (this.state.start !== newStart){
            this.setState({start:newStart});
        }
    }

    handleTimeRangeEndChanged(newEnd) {
        console.log('Time range changed')
        if (this.state.end !== newEnd){
            this.setState({end:newEnd});
        }
    }

    handleCreateEvent() {
        console.log('Event created')
    }

    // Top portion: name input and create button
    EventNameAndCreate() {
        return (
            <div className="flex">
                <form>
                    <input id="event-name-input" type="text" className="form-control" placeholder="Event Name" onSubmit/>
                </form>

                <button id="create-event-button" onClick={() => {
                                                        var cango = false;
                                                        var name = document.getElementById("event-name-input").value;
                                                        if(name == ""){
                                                            alert("you have not picked an event name");
                                                        }
                                                        else if(!this.validTime(this.state.start,this.state.end)){
                                                            alert("Your time selection is invalid, make sure your start time is atleast 15 mins before you endtime");
                                                        }
                                                        else if(this.state.dateType){
                                                            
                                                            var days = [this.state.mon,this.state.tue,this.state.wed,this.state.thu,this.state.fri,this.state.sat,this.state.sun]
                                                            if(!days.includes(true)){
                                                                alert("you have not selected any days");
                                                            }
                                                            else{
                                                                cango = true;
                                                            }
                                                        }
                                                        else{
                                                            //make days the calander feild
                                                            var days = this.state.selectedDays;
                                                            if(days.length == 0){
                                                                alert("you have not selected any days");
                                                            }
                                                            else{
                                                                cango = true;
                                                            }
                                                        }
                                                        if(cango){
                                                            history.push({ 
                                                                pathname: '/Setup2',
                                                                //pass things through state
                                                                state: {days: days,
                                                                        name: name,
                                                                        type: this.state.dateType, 
                                                                        start: this.state.start,
                                                                        end: this.state.end
                                                                }
                                                                })
                                                        }
                                                    }}>Continue</button>
            </div>
        );
    }

    // Right side: Time input
    TimeRangeInput() {
        return (
            <>
                <p>Or enter your own hours:</p>
                <div className="flex">
                    <div className="flex-child">
                        <small>From:  </small>
                    </div>
                    <div className="flex-child">
                        {/* <form>
                            <input id="time-range-start" type="time" className="form-control" placeholder="From" value="8:00am"/>
                        </form> */}
                        <TimePicker onChange={value => this.handleTimeRangeStartChanged(value)} value={this.state.start} />
                    </div>
                    <div className="flex-child">
                        <small>To:  </small>
                    </div>
                    <div className="flex-child">
                        <TimePicker onChange={value => this.handleTimeRangeEndChanged(value)} value={this.state.end} />
                    </div>
                </div>
            </>
        );
    }

    //figures out if the time selection is valid
    validTime = (start,end) => {
        var s = start.split(":");
        var sH = parseInt(s[0]);
        var sM = parseInt(s[1]);

        var e = end.split(":");
        var eH = parseInt(e[0]);
        var eM = parseInt(e[1]);

        var hD = eH - sH;
        var mD = eM - sM;

        /*return true if
            Hour difference > 2                             ie 6:00 and 8:00 is valid
            Hour difference  = 1 and min difference > 14    ie 7:59 and 8:14 is valid
            Hour difference = 0 and mind difference > 15    ie 8:00 and 8:15 is valid
        */
        return ((hD >= 2) || (hD == 1 && mD > 14) || (hD == 0 && mD >=15));

    }


    changeMon = () => {
        this.setState({mon: (!this.state.mon)});
    }
    changeTue = () => {
        this.setState({tue: (!this.state.tue)});
    }
    changeWed = () => {
        this.setState({wed: (!this.state.wed)});
    }
    changeThu = () => {
        this.setState({thu: (!this.state.thu)});
    }
    changeFri = () => {
        this.setState({fri: (!this.state.fri)});
    }
    changeSat = () => {
        this.setState({sat: (!this.state.sat)});
    }
    changeSun = () => {
        this.setState({sun: (!this.state.sun)});
    }

    // Left side: Week or Month view
    DateView() {
        if (!this.state.dateType){
            // Month View
            console.log('DateView: month view')
            return (
                //TODO: set to users local calendarType?
                /*
                <Calendar className="month-calendar" calendarType="US" defaultView="month"
                          onClickDay={(value) => this.handleMonthViewDaySelected(value)}>
                </Calendar>

                 */
                <DayPicker
                    selectedDays={this.state.selectedDays}
                    onDayClick={this.handleMonthViewDaySelected}
                />

            );
        }
        else {
            //Week View
            console.log('DateView: week view')
            return(
                <>
                <Button variant="contained" color={this.state.mon
                            ? "Primary"
                            : "Secondary"} onClick={this.changeMon}>Mon </Button>
                <Button variant="contained" color={this.state.tue
                            ? "Primary"
                            : "Secondary"} onClick={this.changeTue}>Tue </Button>
                <Button variant="contained" color={this.state.wed
                            ? "Primary"
                            : "Secondary"} onClick={this.changeWed}>Wed </Button>
                <Button variant="contained" color={this.state.thu
                            ? "Primary"
                            : "Secondary"} onClick={this.changeThu}>Thu </Button>
                <Button variant="contained" color={this.state.fri
                            ? "Primary"
                            : "Secondary"} onClick={this.changeFri}>Fri </Button>
                <Button variant="contained" color={this.state.sat
                            ? "Primary"
                            : "Secondary"} onClick={this.changeSat}>Sat </Button>
                <Button variant="contained" color={this.state.sun
                            ? "Primary"
                            : "Secondary"} onClick={this.changeSun}>Sun </Button>
                
 
                </>
                //<TimeSlotTable dates={["Sun","Mon","Tues","Wed","Thurs","Fri","Sun"]} times={[""]}/>
                  );

        }
    }

    // Left side of website
    DateSelection() {
        return (
            <div className="flex-child">
                <Dropdown>
                    <Dropdown.Toggle variant="success" className="dropdown">
                        {this.dateTypes[this.state.dateType]}
                    </Dropdown.Toggle>

                    <Dropdown.Menu >
                        <Dropdown.Item onSelect={() => this.handleDateTypesChanged(0)}>{this.dateTypes[0]}</Dropdown.Item>
                        <Dropdown.Item onSelect={() => this.handleDateTypesChanged(1)}>{this.dateTypes[1]}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {/*
                <select id="DateTypes" name="DateTypes" onChange={this.DateTypesChanged}>
                    <option value="SpecificDates">{this.dateTypes[0]}</option>
                    <option value="DaysOfTheWeek">{this.dateTypes[1]}</option>
                </select>*/}
                <br/>
                <br/>

                {this.DateView()}
            </div>
        );
    }

    // Right side of website
    TimeSelection() {
        return (
            <div className="flex-child">
                <Dropdown>
                    <Dropdown.Toggle variant="success" class="dropdown">
                        Time Range
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item  onSelect={() => this.handleTimeRangeChanged('8:00','17:00')}>Work-day hours (8-5)</Dropdown.Item>
                        <Dropdown.Item  onSelect={() => this.handleTimeRangeChanged('7:00','23:00')}>All-day (7-11)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* <select id="TimeRange" name="TimeRange" onChange={this.handleTimeRangeChanged}>
                    <option value="WorkDay">Work-day hours (8-5)</option>
                    <option value="AllDay">All-day (7-11)</option>
                </select> */}

                <br/>
                <br/>

                {this.TimeRangeInput()}

                <br/>
                <br/>

                <TimezoneDropdown/>

            </div>
        );
    }

    render() {
        return (
            <div className="Setup1Page">
                <h1>Setup1 Page</h1>

                <br/>
                <br/>

                {this.EventNameAndCreate()}

                <br/>
                <br/>
                <br/>

                <div className="flex">
                    {this.DateSelection()}
                    {this.TimeSelection()}
                </div>
            </div>
        );
    }
}

export default Setup1Page;