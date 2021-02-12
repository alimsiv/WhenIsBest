import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

const NavigationBar = () => {
    return (
        <div className="NavigationBar">
            <Navbar expand="sm" bg="light" variant="light">
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