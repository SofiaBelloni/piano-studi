import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { MdArrowBack } from "react-icons/md";

function BackButton(props){
    const navigate = useNavigate();

    return(
        <Row>
        <Col>
          <Button onClick={() => {props.setDirty(true); navigate(`/`);}}><MdArrowBack/></Button>
        </Col>
      </Row>
    );
}

export { BackButton };