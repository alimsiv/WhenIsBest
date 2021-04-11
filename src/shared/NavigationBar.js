import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NavigationBar = () => {

    const { currentUser } = useAuth()

    return (
        <div className="NavigationBar">
            <link rel="stylesheet"
                  href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
                  integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
                  crossOrigin="anonymous"/>
            <Navbar expand="sm" bg="dark" variant="dark">
                <Navbar.Brand href="/">WhenIsBest</Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="container-fluid">
                        <Nav.Link href="/setup1">Create Meeting</Nav.Link>
                        <Nav.Link href="/">Add Availability</Nav.Link>
                        { currentUser && <Nav.Link href="/profile">Profile</Nav.Link> }
                        <Nav className = "ml-auto">
                            { !currentUser && <Nav.Link href="/signup">Sign Up</Nav.Link> }
                            { !currentUser && <Nav.Link href="/login">Login</Nav.Link> }
                            { currentUser && <Nav.Link href="/login">Logout (Button Not Working Yet, Use Button in Profile Page)</Nav.Link> }
                        </Nav>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default withRouter(NavigationBar);