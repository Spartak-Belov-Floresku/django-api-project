import {Navbar, Nav, Container, Row} from 'react-bootstrap'

export default function Header() {
    return (
      <header>
        <Navbar bg="light" expand="lg" collapseOnSelect>
          <Container>
            <Navbar.Brand href="/">Django-Api-Project</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/"><i className='fas fa-home'></i> Home</Nav.Link>
                <Nav.Link href="/login"><i className='fas fa-user'></i> Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    )
}
