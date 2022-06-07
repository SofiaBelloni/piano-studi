import { Table, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { MdOutlineExpandMore, MdExpandLess, MdOutlineAdd, MdDeleteForever } from "react-icons/md";
import Form from 'react-bootstrap/Form'
import { BackButton } from './Utility';
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';

function CreatePlan(props) {
    const [addedExams, setAddedExams] = useState([]);
    const [cfu, setCfu] = useState(0);

    function handleAdd(examId) {
        const newExam = props.exams.find(e => e.code === examId);
        setAddedExams(oldFilms => [...oldFilms, newExam]);
        setCfu(old => old + newExam.cfu);
    }
    function handleDelete(examId) {
        setAddedExams(addedExams.filter(e => e.code !== examId));
        setCfu(old => old - props.exams.find(e => e.code === examId).cfu);
    }

    return (
        <>
            <BackButton />
            <PlanType></PlanType>
            <TotCFU cfu={cfu} />
            <br />
            {addedExams.length > 0 ? <PlanTable exams={addedExams} handleDelete={handleDelete} /> : false}
            <ExamTable exams={props.exams} handleAdd={handleAdd}></ExamTable>
        </>
    );
}

function TotCFU(props) {
    return (
        <Row>
            <Col md-2>
                <Form.Label>Crediti selezionati:</Form.Label>
            </Col>
            <Col md-2>
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
                <Form.Select aria-label="Tipo di iscrizione"> Tipo di iscrizione
                    <option value="1">Full Time</option>
                    <option value="2">Part Time</option>
                </Form.Select>
            </Form.Group>
        </>
    );
}

function ExamTable(props) {

    return (
        <>
            <h1>Esami</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Nome</th>
                        <th>CFU</th>
                        <th>Studenti Iscritti</th>
                        <th>Massimo Studenti</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.exams.map((ex) => <ExamRow handleAdd={props.handleAdd} exam={ex} />)
                    }
                </tbody>
            </Table>
        </>
    );
}

function ExamRow(props) {
    const [expand, setExpand] = useState(false);

    function moreInfo(old) {
        setExpand(!old);
    }

    return (
        <>
            <tr><ExamData exam={props.exam} expand={expand} moreInfo={moreInfo} handleAdd={props.handleAdd} /></tr>
            {expand ? <ExamInfo exam={props.exam}/> : false}
        </>
    );
}

function ExamInfo(props) {
    return (
      <>
        <tr>
          <th>Propedeutici</th>
          <td>{props.exam.prerequisite ? props.exam.prerequisite : "/"}</td>
        </tr>
        <tr>
          <th>Incompatibili</th>
          <td>ciao</td>
        </tr>
      </>
    );
  }

function ExamData(props) {
    return (
        <>
            <td>{props.exam.code}</td>
            <td>{props.exam.name}</td>
            <td>{props.exam.cfu}</td>
            <td>{props.exam.student}</td>
            <td>{props.exam.maxStudent}</td>
            <td><Button onClick={() => { props.moreInfo(props.expand) }}>
                {props.expand ? <MdExpandLess /> : <MdOutlineExpandMore />}</Button></td>
            <td>
                <Button onClick={() => props.handleAdd(props.exam.code)} ><MdOutlineAdd /></Button>
            </td>
        </>
    );
}

function PlanTable(props) {
    const navigate = useNavigate();
    return (
        <>
            <h1>Piano degli studi</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Nome</th>
                        <th>CFU</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.exams.map((ex) => <PlanRow exam={ex} handleDelete={props.handleDelete} />)
                    }
                </tbody>
            </Table>
            <Row>
                <Col md>
                    <Button className='mx-3' variant="secondary" onClick={() => navigate('/')}>Salva</Button>
                </Col>
                <Col md>
                    <Button className='mx-3' variant="secondary" onClick={() => navigate('/')}>Cancella</Button>
                </Col>
            </Row>
        </>
    );
}

function PlanRow(props) {
    return (
        <tr><PlanData exam={props.exam} handleDelete={props.handleDelete} /></tr>
    );
}

function PlanData(props) {
    return (
        <>
            <td>{props.exam.code}</td>
            <td>{props.exam.name}</td>
            <td>{props.exam.cfu}</td>
            <td>
                <Button onClick={() => props.handleDelete(props.exam.code)}><MdDeleteForever /></Button>
            </td>
        </>
    );
}


export { CreatePlan };