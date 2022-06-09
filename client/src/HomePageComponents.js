import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { PlanTable } from './StudyPlanComponents';
import { ExamList } from './ExamComponents';
import { MdOutlineAdd, MdDeleteForever} from "react-icons/md";

function HomePage(props) {
    return (
        <>
            {props.loggedIn ?
                props.user.enrollment ? <PlanTable exams={props.studyPlan}/> : false
                : false}
            {props.loggedIn ? props.user.enrollment ? <DeletePlan/> : <AddPlan/> : false}
            
            <ExamList exams={props.exams} />
        </>
    );
}

function AddPlan() {
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