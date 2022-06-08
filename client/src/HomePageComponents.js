import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { PlanTable } from './StudyPlanComponents';
import { ExamList } from './ExamComponents';
import { MdOutlineAdd} from "react-icons/md";

function HomePage(props) {
    const addedExams = props.exams;
    return (
        <>
            {props.loggedIn ?
                !props.user.type ? <PlanTable exams={addedExams} /> : <AddPlan />
                : false}
            <ExamList exams={props.exams} />
        </>
    );
}

function AddPlan(props) {
    const navigate = useNavigate();

    return (
        <Row>
            <Col>
                <Button onClick={() => navigate(`/edit`)}><MdOutlineAdd />Aggiungi piano di studio</Button>
            </Col>
        </Row>
    );

}

export { HomePage };