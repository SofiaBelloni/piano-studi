import { Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import { BackButton } from './Utility';
import { PlanTable } from './StudyPlanComponents';
import { ExamTable } from './ExamComponents'
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';

function CreatePlan(props) {
    const [addedExams, setAddedExams] = useState(props.studyPlan ? props.studyPlan : []);
    const [cfu, setCfu] = useState(props.studyPlan ? computeCFU() : 0);
    const [enrollment, setEnrollment] = useState(props.user.enrollment ? props.user.enrollment : "fullTime");

    function computeCFU() {
        let cfu = 0;
        addedExams.forEach(e => cfu += e.cfu);
        return cfu;
    }

    function handleAdd(examId) {
        const newExam = props.exams.find(e => e.code === examId);
        setAddedExams(oldFilms => [...oldFilms, newExam]);
        setCfu(old => old + newExam.cfu);
    }
    function handleDelete(examId) {
        setAddedExams(addedExams.filter(e => e.code !== examId));
        setCfu(old => old - props.exams.find(e => e.code === examId).cfu);
    }

    const isAddable = (examId) => {
        const selectedExam = props.exams.find(e => e.code === examId);
        if (cfu > 80) return false;
        if (addedExams.find(e => e.code === examId))
            return false;
        if (selectedExam.prerequisite !== null) {
            if (!addedExams.find(e => e.code === selectedExam.prerequisite))
                return false;
        }
        return true;
    }

    //check if the studyPlan respects cfu constraints
    const savePlan = () => {
        switch (enrollment) {
            case "fullTime":
                if (cfu >= 60 && cfu <= 80)
                    return true;
            case "partTime":
                if (cfu >= 20 && cfu <= 40)
                    return true;
            default:
                return false;
        }
    }

    return (
        <>
            <BackButton />
            <PlanType setEnrollment={setEnrollment} enrollment={enrollment} user={props.user}></PlanType>
            <TotCFU cfu={cfu} />
            <br />
            {addedExams.length > 0 ?
                <>
                    <PlanTable exams={addedExams} handleDelete={handleDelete} edit={true} />
                    <Save save={savePlan} />
                </>
                : false}
            <br />
            <ExamTable exams={props.exams} edit={true} handleAdd={handleAdd} addable={isAddable} ></ExamTable>
        </>
    );
}

function TotCFU(props) {
    return (
        <Row>
            <Col>
                <Form.Label>Crediti selezionati:</Form.Label>
            </Col>
            <Col>
                <Form.Control value={props.cfu} disabled />
            </Col>
        </Row>
    );
}

function PlanType(props) {
    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>Tipo di iscrizione:</Form.Label>
                <Form.Select aria-label="Tipo di iscrizione" value={props.enrollment} onChange={(event) => props.setEnrollment(event.target.value)} disabled={props.user.enrollment ? true : false}> Tipo di iscrizione
                    <option value="fullTime">Full Time</option>
                    <option value="partTime">Part Time</option>
                </Form.Select>
            </Form.Group>
        </>
    );
}

function Save(props) {
    const navigate = useNavigate();
    return (
        <Row>
            <Col md>
                <Button className='mx-3' variant="primary" onClick={() => navigate('/')} disabled={!props.save()}>Salva</Button>
            </Col>
            <Col md>
                <Button className='mx-3' variant="danger" onClick={() => navigate('/')}>Cancella</Button>
            </Col>
        </Row>
    );
}

export { CreatePlan };