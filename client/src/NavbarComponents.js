import { Container, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBook } from "react-icons/fa";
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';

function MyNavbar(props) {
  const navigate = useNavigate();
  return (
    <Navbar variant="dark" bg="primary">
      <Container fluid>
        <Navbar.Brand><Button onClick={() => navigate(`/`)}><FaBook width="30" height="30" /></Button></Navbar.Brand>
        <Navbar.Brand>
          {props.loggedIn ? "Benvenuta Sofia"
            : "Piano degli studi"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Brand>
          {props.loggedIn ? <Button onClick={props.logout}>Logout</Button>
            : <Button onClick={() => navigate(`/login`)}>Login</Button>
          }
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export { MyNavbar };

