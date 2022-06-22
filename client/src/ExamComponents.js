import { Table, Button } from 'react-bootstrap';
import { useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { MdOutlineExpandMore, MdExpandLess, MdOutlineAdd } from "react-icons/md";
import './TableColor.css'

function ExamTable(props) {

  return (
    <>
      {props.edit ? <ColorLegend /> : false}
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

function ColorLegend() {
  return (
    <>
      <br />
      <Table borderless size="sm">
        <tbody>
          <tr className='legend'>
            <td><span className="presence" /></td>
            <td>Esame aggiunto al piano di studio</td>
            <td><span className="cfu" /></td>
            <td>CFU rimasti insufficienti</td>
            <td><span className="incompatibility" /></td>
            <td>Esame incompatibile con il piano di studio</td>
          </tr>
          <tr className='legend'>
            <td><span className="prerequisite" /></td>
            <td>E' richiesto un esame propedeutico</td>
            <td><span className="max" /></td>
            <td>Massimo numero di iscritti raggiunto</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export { ExamTable };