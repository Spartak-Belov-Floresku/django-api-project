import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown, } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'

export default function Header() {

    const navigate = useNavigate()
    const { userInfo } = useSelector(state => state.userLogedIn)

    const dispatch = useDispatch()

    const logoutHandler = () => {
      dispatch(logout())
      navigate('/login')
    }

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
                {userInfo ? (
                  <NavDropdown title={userInfo.name? userInfo.name: userInfo.email} id='username'>
                      <LinkContainer to='/profile'>
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to='/login'>
                      <Nav.Link><i className='fas fa-user'></i> Login</Nav.Link>
                  </LinkContainer>
                )}

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Admin' id='adminmenu'>

                    <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>

                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    )
}
