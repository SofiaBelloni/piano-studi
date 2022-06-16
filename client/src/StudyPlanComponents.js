import { Table, Button } from 'react-bootstrap';
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";

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
                        props.exams.map((ex) => <PlanRow exam={ex} edit={props.edit} handleDelete={props.handleDelete} key={ex.code + 'plan'} />)
                    }
                </tbody>
            </Table>
        </>
    );
}

function PlanRow(props) {
    return (
        <tr><PlanData exam={props.exam} edit={props.edit} handleDelete={props.handleDelete}/></tr>
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
                    <Button onClick={() => props.handleDelete(props.exam.code)}><MdDeleteForever /></Button>
                </td>
                : false
            }
        </>
    );
}

export { PlanTable };