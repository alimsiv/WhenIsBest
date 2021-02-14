import { Component } from 'react'
import NavigationBar from '../shared/NavigationBar'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'



class Setup1Page extends Component{
    render() {
        return (
            <div className="Setup1Page">
                <NavigationBar></NavigationBar>
                <h1>Setup1 Page</h1>


                <Calendar calendarType="US" defaultView="month"
                            onClickDay={(value) => console.log('New date is: ' + value)}>
                </Calendar> //TODO: set to users local calendarType?
            </div>
        );
    }
}

export default Setup1Page;