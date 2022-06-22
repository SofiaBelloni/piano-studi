import { Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { BackButton } from './Utility';
import { PlanTable } from './StudyPlanComponents';
import { ExamTable } from './ExamComponents'
import { useNavigate } from 'react-router-dom';

function CreatePlan(props) {
    const [addedExams, setAddedExams] = useState(props.studyPlan ? props.studyPlan : []);
    const [cfu, setCfu] = useState(props.studyPlan ? computeCFU() : 0);
    const [enrollment, setEnrollment] = useState(props.user.enrollment ? props.user.enrollment : undefined);

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
        props.setExams(exams => exams.map(c => (c.code === newExam.code) ? {
            code: c.code,
            name: c.name,
            cfu: c.cfu,
            student: c.student + 1,
            maxStudent: c.maxStudent,
            prerequisite: c.prerequisite,
            incompatibility: c.incompatibility
        } : c));
    }

    //when an exam is removed from the studyPlan
    function handleDelete(examId) {
        const examDel = props.exams.find(e => e.code === examId);
        setAddedExams(addedExams.filter(e => e.code !== examId));
        setCfu(old => old - examDel.cfu);
        props.setExams(exams => exams.map(c => (c.code === examDel.code) ? {
            code: c.code,
            name: c.name,
            cfu: c.cfu,
            student: c.student - 1,
            maxStudent: c.maxStudent,
            prerequisite: c.prerequisite,
            incompatibility: c.incompatibility
        } : c));
    }

    //when the study plan is confirmed
    function handleSave() {
        if (enrollment)
            props.save(enrollment, addedExams);
    }

    //check if is possible to add exam with id examId to the study plan
    const isAddable = (examId) => {
        //to add the exam you have to choose the type of the plan
        if (!enrollment)
            return { addable: false, value: null, reason: "Per poter inserire gli esami devi prima scegliere il tipo di iscrizione" };
        const selectedExam = props.exams.find(e => e.code === examId);
        //to add an exam only once
        if (addedExams.find(e => e.code === examId))
            return { addable: false, value: 'presence', reason: "Esame già presente" };
        //check cfu
        switch (enrollment) {
            case "fullTime":
                if (selectedExam.cfu + cfu >= 80)
                    return { addable: false, value: 'cfu', reason: "CFU liberi insufficienti" };
                break;
            case "partTime":
                if (selectedExam.cfu + cfu >= 40)
                    return { addable: false, value: 'cfu', reason: "CFU liberi insufficienti" };
                break;
            default:
        }
        //check prerequisite
        if (selectedExam.prerequisite !== null) {
            if (!addedExams.find(e => e.code === selectedExam.prerequisite))
                return { addable: false, value: 'prerequisite', reason: `L'esame ${selectedExam.prerequisite} è propedeutico per questo esame` };
        }
        //check incompatibility
        if (selectedExam.incompatibility[0] !== null) {
            let value = true;
            let incID = null;
            selectedExam.incompatibility.forEach(inc => {
                if (inc !== null && addedExams.find(e => e.code === inc)) {
                    value = false;
                    incID = inc;
                }
            });
            if (!value)
                return { addable: false, value: 'incompatibility', reason: `L'esame ${incID} è incompatibile con questo esame` };
        }
        //check max number of student
        if (selectedExam.maxStudent !== null && selectedExam.student >= selectedExam.maxStudent)
            return { addable: false, value: 'max', reason: "Massimo numero di iscritti raggiunto" };

        return { addable: true, value: null, reason: "Aggiungi esame al piano di studio" };
    }

    //check if is possible to remove an exam with id examId from the study plan
    const isDeletable = (examId) => {
        let value = { delete: true, reason: `Elimina dal piano di studio` };
        addedExams.forEach(ex => {
            if (ex.prerequisite !== null && ex.prerequisite === examId) {
                value.delete = false;
                value.reason = `Esame propedeutico per ${ex.code}`;
            }
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

    const showInstruction = () => {
        if (enrollment === "fullTime")
            return "Compila il tuo piano di studio inserendo min: 60, max: 80 crediti formativi.";
        if (enrollment === "partTime")
            return "Compila il tuo piano di studio inserendo min: 20, max: 40 crediti formativi.";
        return "";
    }

    return (
        <>
            <BackButton setDirty={props.setDirty} />
            <PlanType setEnrollment={setEnrollment} enrollment={enrollment} user={props.user}></PlanType>
            {enrollment ? <p>{showInstruction()}</p> : <p>Per poter inserire gli esami devi prima scegliere il tipo di iscrizione</p>}
            <TotCFU cfu={cfu} />
            <br />
            {addedExams.length > 0 ?
                <>
                    <PlanTable exams={addedExams} handleDelete={handleDelete} delete={isDeletable} edit={true} />
                    <Save save={savePlan} setDirty={props.setDirty} add={handleSave} showInstruction={showInstruction} />
                    <br />
                </>
                : false}
            <ExamTable exams={props.exams} edit={true} handleAdd={handleAdd} addable={isAddable} ></ExamTable>
        </>
    );
}

function TotCFU(props) {
    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3" >Crediti formativi selezionati:</Form.Label>
            <Col sm="1">
                <Form.Control value={props.cfu} readOnly />
            </Col>
        </Form.Group>
    );
}

function PlanType(props) {

    return (
        <>
            <Form.Group as={Row} className="my-3">
                <Form.Label column sm="3">Seleziona il tipo di iscrizione:</Form.Label>
                <Col sm="2">
                    <Form.Select aria-label="Tipo di iscrizione" value={props.enrollment} onChange={(event) => { props.setEnrollment(event.target.value); }} disabled={props.enrollment ? true : false}> Tipo di iscrizione
                        <option />
                        <option value="fullTime">Full Time</option>
                        <option value="partTime">Part Time</option>
                    </Form.Select>
                </Col>
            </Form.Group>
        </>
    );
}

function Save(props) {
    const navigate = useNavigate();

    const toSave = !props.save();
    return (
        <Row>
            <Col className='text-center'>
                {toSave ?
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{props.showInstruction()}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button className='mx-3 primary' onClick={() => props.add()} disabled={toSave}>Salva modifiche</Button>
                        </span>
                    </OverlayTrigger>
                    : <Button className='mx-3 primary' onClick={() => props.add()} disabled={toSave}>Salva modifiche</Button>
                }
            </Col>
            <Col className='text-center'>
                <Button className='mx-3 danger' variant="danger" onClick={() => { props.setDirty(true); navigate('/'); }}>Cancella modifiche</Button>
            </Col>
        </Row>
    );
}

export { CreatePlan };