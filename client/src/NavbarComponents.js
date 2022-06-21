import { Container, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUniversity } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './ComponentsStyle.css';

function MyNavbar(props) {
  const navigate = useNavigate();
  return (
    <Navbar variant="dark" className='myNavBar'>
      <Container fluid>
        <Navbar.Brand><Button className='btn-lg icon' onClick={() => navigate(`/`)}><FaUniversity size='1.1em'/></Button>
        {props.loggedIn ? `Bentornato, ${props.name}`
            : "Piano degli studi"}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Brand>
          {props.loggedIn ? <Button className='btn-lg primary' onClick={props.logout}>Logout</Button>
            : <Button className='btn-lg primary'  onClick={() => navigate(`/login`)}>Login</Button>
          }
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export { MyNavbar };

