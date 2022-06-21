import { Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { MdOutlineExpandMore, MdExpandLess, MdOutlineAdd } from "react-icons/md";
import './TableColor.css'

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
            props.exams.map((ex) => <ExamRow exam={ex} key={ex.code} edit={props.edit} addable={props.addable} handleAdd={props.handleAdd} />)
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

  let add = null;
  //render color table
  if (props.edit) {
    add = props.addable(props.exam.code); //return value of isAddable function
  }
  return (
    <>
      <tr className={add ? add.value : null}><ExamData exam={props.exam} expand={expand} moreInfo={moreInfo} edit={props.edit} addable={add} handleAdd={props.handleAdd} /></tr>
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
        <td>{props.exam.incompatibility ? props.exam.incompatibility.toString() : "/"}</td>
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
      <td><Button className='secondary' onClick={() => { props.moreInfo(props.expand) }}>
        {props.expand ? <MdExpandLess /> : <MdOutlineExpandMore />}</Button></td>
      {props.edit ?
        <td>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{props.addable.reason}</Tooltip>}>
            <span className="d-inline-block">
            <Button className='secondary' onClick={() => props.handleAdd(props.exam.code)} disabled={!props.addable.addable} ><MdOutlineAdd /></Button>
            </span>
          </OverlayTrigger>
         </td>
        : false

      }
    </>
  );
}

export { ExamTable };