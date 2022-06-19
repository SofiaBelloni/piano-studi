import { Table, Button } from 'react-bootstrap';
import { MdDeleteForever } from "react-icons/md";
import './ComponentsStyle.css'

function PlanTable(props) {
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
                        props.exams.map((ex) => <PlanRow exam={ex} edit={props.edit} handleDelete={props.handleDelete} delete={props.delete} key={ex.code + 'plan'} />)
                    }
                </tbody>
            </Table>
        </>
    );
}

function PlanRow(props) {
    return (
        <tr><PlanData exam={props.exam} edit={props.edit} handleDelete={props.handleDelete} delete={props.delete}/></tr>
    );
}

function PlanData(props) {
    return (
        <>
            <td>{props.exam.code}</td>
            <td>{props.exam.name}</td>
            <td>{props.exam.cfu}</td>
            { props.edit ?
                <td>
                    <Button className='secondary' onClick={() => props.handleDelete(props.exam.code)} disabled={!props.delete(props.exam.code)}><MdDeleteForever /></Button>
                </td>
                : false
            }
        </>
    );
}

export { PlanTable };