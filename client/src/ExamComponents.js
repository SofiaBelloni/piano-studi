import { Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import { MdOutlineExpandMore, MdExpandLess } from "react-icons/md";

function ExamList(props) {
  return (
    <ExamTable exams={props.exams}></ExamTable>
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
            props.exams.map((ex) => <ExamRow exam={ex} key={ex.code} />)
          }
        </tbody>
      </Table>
      { }
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
      <tr><ExamData exam={props.exam} expand={expand} moreInfo={moreInfo} /></tr>
      {expand ? <ExamInfo /> : false}
    </>
  );
}

function ExamInfo(props) {
  return (
    <>
      <tr>
        <th>Propedeutici</th>
        <td>ciao</td>
      </tr>
      <tr>
        <th scope="row">Incompatibili</th>
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
    </>
  );
}

export { ExamList };