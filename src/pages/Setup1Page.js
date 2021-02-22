import { Component } from 'react'
import {Dropdown, Nav, Navbar} from 'react-bootstrap'
import NavigationBar from '../shared/NavigationBar'
import TimezoneDropdown from "../shared/TimezoneDropdown";
import TimeSlotTable from "../shared/TimeSlotTable";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '../styling/Setup1Page.css';



class Setup1Page extends Component{
    dateTypes = ["Specific Dates", "Days of the Week"];


    constructor(props) {
        super(props);
        //0 for Specific Dates, 1 for Days of the Week
        this.state = {
            dateType: 0
        }
    }

    // Top portion: name input and create button
    EventNameAndCreate() {
        return (
            <div className="flex">
                <form>
                    <input id="event-name-input" type="text" className="form-control" placeholder="Event Name"/>
                </form>

                <button id="create-event-button" onClick={this.CreateEvent}>Create Event</button>
            </div>
        );
    }

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

    // Week or Month view
    DateView() {
        if (this.state.dateType === 0){
            // Month View
            console.log('DateView: month view')
            return (
                //TODO: set to users local calendarType?
                <Calendar className="month-calendar" calendarType="US" defaultView="month"
                          onClickDay={(value) => console.log('New date is: ' + value)}>
                </Calendar>

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
                        <Dropdown.Item onSelect={() => this.DateTypesChanged(0)}>{this.dateTypes[0]}</Dropdown.Item>
                        <Dropdown.Item onSelect={() => this.DateTypesChanged(1)}>{this.dateTypes[1]}</Dropdown.Item>
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
                        <Dropdown.Item onClick={this.TimeRangeChanged}>Work-day hours (8-5)</Dropdown.Item>
                        <Dropdown.Item onClick={this.TimeRangeChanged}>All-day (7-11)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <select id="TimeRange" name="TimeRange" onChange={this.TimeRangeChanged}>
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

    DateTypesChanged(newType) {
        console.log('Date type changed')
        console.log('current: ' + this.state.dateType)
        console.log('new: ' + newType)
        if (this.state.dateType !== newType){
            this.setState({dateType:newType});
        }
    }

    TimeRangeChanged() {
        console.log('Time range changed')
    }

    CreateEvent() {
        console.log('Event created')
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