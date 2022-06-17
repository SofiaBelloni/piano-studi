import { Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import { BackButton } from './Utility';
import { PlanTable } from './StudyPlanComponents';
import { ExamTable } from './ExamComponents'
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';

//FIXME: evidenzia righe non aggiungibili

function CreatePlan(props) {
    const [addedExams, setAddedExams] = useState(props.studyPlan ? props.studyPlan : []);
    const [cfu, setCfu] = useState(props.studyPlan ? computeCFU() : 0);
    const [enrollment, setEnrollment] = useState(props.user.enrollment ? props.user.enrollment : "fullTime");

    //compute the number of cfu of the current study plan
    function computeCFU() {
        let cfu = 0;
        addedExams.forEach(e => cfu += e.cfu);
        return cfu;
    }

    //when an exam is added to the studyPlan
    function handleAdd(examId) {
        let newExam = props.exams.find(e => e.code === examId);
        setAddedExams(oldFilms => [...oldFilms, newExam]);
        setCfu(old => old + newExam.cfu);
        newExam.student += 1;
    }

    //when an exam is removed from the studyPlan
    function handleDelete(examId) {
        setAddedExams(addedExams.filter(e => e.code !== examId));
        setCfu(old => old - props.exams.find(e => e.code === examId).cfu);
        props.exams.find(e => e.code === examId).student -= 1;
    }

    //when the study plan is confirmed
    function handleSave() {
        props.save(enrollment, addedExams);
    }

    //check if is possible to add exam with id examId to the study plan
    const isAddable = (examId) => {
        const selectedExam = props.exams.find(e => e.code === examId);
        //check cfu
        switch (enrollment) {
            case "fullTime":
                if (selectedExam.cfu + cfu >= 80)
                    return false;
                break;
            case "partTime":
                if (selectedExam.cfu + cfu >= 40)
                    return false;
                break;
            default:
        }
        //to add an exam only once
        if (addedExams.find(e => e.code === examId))
            return false;
        //check prerequisite
        if (selectedExam.prerequisite !== null) {
            if (!addedExams.find(e => e.code === selectedExam.prerequisite))
                return false;
        }
        //check incompatibility
        if (selectedExam.incompatibility[0] !== null) {
            let value = true;
            selectedExam.incompatibility.forEach(inc => {
                if (inc !== null && addedExams.find(e => e.code === inc)) {
                    value = false;
                }
            });
            if (!value)
                return false;
        }
        //check max number of student
        if (selectedExam.maxStudent !== null && selectedExam.student >= selectedExam.maxStudent)
            return false;
        return true;
    }

    //check if is possible to remove an exam with id examId from the study plan
    const isDeletable = (examId) => {
        let value = true;
        addedExams.forEach(ex => {
            if (ex.prerequisite !== null && ex.prerequisite === examId)
                value = false;
        });
        return value;
    }

    //check if the studyPlan respects cfu constraints
    const savePlan = () => {
        switch (enrollment) {
            case "fullTime":
                if (cfu >= 60 && cfu <= 80)
                    return true;
                break;
            case "partTime":
                if (cfu >= 20 && cfu <= 40)
                    return true;
                break;
            default:
                return false;
        }
    }

    return (
        <>
            <BackButton setDirty={props.setDirty}/>
            <PlanType setEnrollment={setEnrollment} enrollment={enrollment} user={props.user}></PlanType>
            <TotCFU cfu={cfu} />
            <br />
            {addedExams.length > 0 ?
                <>
                    <PlanTable exams={addedExams} handleDelete={handleDelete} delete={isDeletable} edit={true} />
                    <Save save={savePlan} setDirty={props.setDirty} add={handleSave} />
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
            <Col className='text-center'>
                <Button className='mx-3' variant="primary" onClick={() => props.add()} disabled={!props.save()}>Salva modifiche</Button>
            </Col>
            <Col className='text-center'>
                <Button className='mx-3' variant="danger" onClick={() => {props.setDirty(true); navigate('/');}}>Cancella modifiche</Button>
            </Col>
        </Row>
    );
}

export { CreatePlan };