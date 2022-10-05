import {Navbar, Nav, Container} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

export default function Header() {
    return (
      <header>
        <Navbar bg="light" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>Django-Api-Project</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to='/'>
                  <Nav.Link><i className='fas fa-home'></i> Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to='/login'>
                  <Nav.Link href="/login"><i className='fas fa-user'></i> Login</Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    )
}
