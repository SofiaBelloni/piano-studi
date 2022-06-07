import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { MdArrowBack } from "react-icons/md";

function BackButton(){
    const navigate = useNavigate();

    return(
        <Row>
        <Col>
          <Button onClick={() => navigate(`/`)}><MdArrowBack/></Button>
        </Col>
      </Row>
    );
}

export { BackButton };