import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { PlanTable } from './StudyPlanComponents';
import { ExamList } from './ExamComponents';
import { MdOutlineAdd, MdDeleteForever} from "react-icons/md";

function HomePage(props) {
    const addedExams = [];
    props.user.type=1;
    return (
        <>
            {props.loggedIn ?
                props.user.type ? <PlanTable exams={addedExams}/> : false
                : false}
            {props.loggedIn ? props.user.type ? <DeletePlan/> : <AddPlan/> : false}
            
            <ExamList exams={props.exams} />
        </>
    );
}

function AddPlan(props) {
    const navigate = useNavigate();

    return (
        <Row>
            <Col>
                <Button onClick={() => navigate(`/edit`)}><MdOutlineAdd /> Aggiungi piano di studio</Button>
            </Col>
        </Row>
    );
}

function DeletePlan(props) {
    return (
        <Row>
            <Col>
                <Button variant="danger"><MdDeleteForever /> Elimina piano di studio</Button>
            </Col>
        </Row>
    );
}


export { HomePage };