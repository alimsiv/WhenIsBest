import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

const NavigationBar = () => {
    return (
        <div className="NavigationBar">
            <link rel="stylesheet"
                  href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
                  integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
                  crossOrigin="anonymous"></link>
            <Navbar expand="sm" bg="dark" variant="dark">
                <Navbar.Brand href="/">WhenIsBest</Navbar.Brand>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="menu-options">
                        <Nav.Link href="/setup1">Create Meeting</Nav.Link>
                        {/* no link yet */}
                        <Nav.Link href="/">Add Availability</Nav.Link>
                        {/* no link yet */}
                        <Nav.Link href="/">Sign Up</Nav.Link>
                        {/* no link yet */}
                        <Nav.Link href="/">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default NavigationBar;