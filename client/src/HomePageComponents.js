import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { PlanTable } from './StudyPlanComponents';
import { ExamTable } from './ExamComponents';
import { MdOutlineAdd, MdDeleteForever, MdEditNote } from "react-icons/md";
import './ComponentsStyle.css';

function HomePage(props) {
    return (
        <>
            {props.loggedIn ?
                props.user.enrollment ? <PlanTable exams={props.studyPlan} edit={false}/> : false
                : <p className='dologin text-info'> Effettua il login per visualizzare il tuo piano di studio </p>}
            {props.loggedIn ? props.user.enrollment ? <PlanManagement delete={props.delete} /> : <AddPlan /> : false}

            <ExamTable exams={props.exams} edit={false}/>
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

function PlanManagement(props) {
    const navigate = useNavigate();
    
    return (
        <Row>
            <Col>
                <Button variant="primary" onClick={() => navigate(`/edit`)}><MdEditNote /> Modifica piano di studio</Button>
            </Col>
            <Col>
                <Button variant="danger" onClick={() => props.delete()}><MdDeleteForever /> Elimina piano di studio</Button>
            </Col>
        </Row>
    );
}


export { HomePage };