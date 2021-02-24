import { Component } from 'react'
import {Dropdown, Nav, Navbar} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import TimezoneDropdown from "../shared/TimezoneDropdown";
import TimeSlotTable from "../shared/TimeSlotTable";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../styling/Setup1Page.css';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';



class Setup1Page extends Component{
    dateTypes = ["Specific Dates", "Days of the Week"];


    constructor(props) {
        super(props);

        this.handleMonthViewDaySelected = this.handleMonthViewDaySelected.bind(this);
        this.handleDateTypesChanged = this.handleDateTypesChanged.bind(this);
        this.handleTimeRangeChanged = this.handleTimeRangeChanged.bind(this);
        this.handleCreateEvent = this.handleCreateEvent.bind(this);

        this.state = {
            //0 for Specific Dates, 1 for Days of the Week
            dateType: 0,
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
        } else {
            selectedDays.push(day);
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

    handleTimeRangeChanged() {
        console.log('Time range changed')
    }

    handleCreateEvent() {
        console.log('Event created')
    }

    // Top portion: name input and create button
    EventNameAndCreate() {
        return (
            <div className="flex">
                <form>
                    <input id="event-name-input" type="text" className="form-control" placeholder="Event Name"/>
                </form>

                <button id="create-event-button" onClick={this.handleCreateEvent}>Continue</button>
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
                        <form>
                            <input id="time-range-start" type="time" className="form-control" placeholder="From"/>
                        </form>
                    </div>
                    <div className="flex-child">
                        <small>To:  </small>
                    </div>
                    <div className="flex-child">
                        <form>
                            <input id="time-range-end" type="time" className="form-control" placeholder="To"/>
                        </form>
                    </div>
                </div>
            </>
        );
    }

    // Left side: Week or Month view
    DateView() {
        if (this.state.dateType === 0){
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
                <TimeSlotTable headerTitles={["Sun","Mon","Tues","Wed","Thurs","Fri","Sun"]} times={[""]}/>
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
                        <Dropdown.Item onClick={this.handleTimeRangeChanged}>Work-day hours (8-5)</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleTimeRangeChanged}>All-day (7-11)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <select id="TimeRange" name="TimeRange" onChange={this.handleTimeRangeChanged}>
                    <option value="WorkDay">Work-day hours (8-5)</option>
                    <option value="AllDay">All-day (7-11)</option>
                </select>

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
                <NavigationBar/>
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