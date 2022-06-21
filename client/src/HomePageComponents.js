import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { PlanTable } from './StudyPlanComponents';
import { ExamTable } from './ExamComponents';
import { MdOutlineAdd, MdDeleteForever, MdEditNote } from "react-icons/md";
import './ComponentsStyle.css';

function HomePage(props) {

    //compute the number of cfu of the current study plan
    function computeCFU() {
        let cfu = 0;
        props.studyPlan.forEach(e => cfu += e.cfu);
        return cfu;
    }

    return (
        <>
            {props.loggedIn ?
                props.user.enrollment ?
                    <>
                    <Row className="justify-content-center"><Col xs={3} className='info-div'>
                        <p className='info'> Iscrizione: {props.user.enrollment} </p>
                        <p className='info'> CFU totali: {computeCFU()} </p>
                    </Col></Row>
                        <PlanTable exams={props.studyPlan} edit={false} />
                    </>
                    : false
                : <p className='dologin'> Effettua il login per visualizzare il tuo piano di studio </p>}
            {props.loggedIn ? props.user.enrollment ? <PlanManagement delete={props.delete} /> : <AddPlan /> : false}
            <br/>
            <ExamTable exams={props.exams} edit={false} />
        </>
    );
}

function AddPlan() {
    const navigate = useNavigate();

    return (
        <Row>
            <Col className='text-center'>
                <Button className='primary' onClick={() => navigate(`/edit`)}><MdOutlineAdd /> Aggiungi piano di studio</Button>
            </Col>
        </Row>
    );
}

function PlanManagement(props) {
    const navigate = useNavigate();

    return (
        <Row>
            <Col className='text-center'>
                <Button className="primary" onClick={() => navigate(`/edit`)}><MdEditNote /> Modifica piano di studio</Button>
            </Col>
            <Col className='text-center'>
                <Button className="danger" variant="danger" onClick={() => props.delete()}><MdDeleteForever /> Elimina piano di studio</Button>
            </Col>
        </Row>
    );
}


export { HomePage };