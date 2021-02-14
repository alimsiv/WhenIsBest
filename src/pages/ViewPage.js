import { Component } from 'react'
import { Table } from 'react-bootstrap' //https://react-bootstrap.github.io/components/table/
import NavigationBar from '../shared/NavigationBar'



class ViewPage extends Component{
    render() {
        return (
            <div className="ViewPage">
                <NavigationBar></NavigationBar>
                <h1>View Page</h1>


            </div>
        );
    }
}

export default ViewPage;