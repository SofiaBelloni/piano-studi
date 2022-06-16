import { Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import { MdOutlineExpandMore, MdExpandLess, MdOutlineAdd} from "react-icons/md";

function ExamTable(props) {

  return (
    <>
      <h1>Offerta formativa</h1>
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
            props.exams.map((ex) => <ExamRow exam={ex} key={ex.code} edit={props.edit} addable={props.addable} handleAdd={props.handleAdd}/>)
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
      <tr><ExamData exam={props.exam} expand={expand} moreInfo={moreInfo} edit={props.edit} addable={props.addable} handleAdd={props.handleAdd}/></tr>
      {expand ? <ExamInfo exam={props.exam} /> : false}
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
      {props.edit ?
        <td>
          <Button onClick={() => props.handleAdd(props.exam.code)} disabled={!props.addable(props.exam.code)} ><MdOutlineAdd /></Button>
        </td>
        : false

      }
    </>
  );
}

export { ExamTable };