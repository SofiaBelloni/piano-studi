import { Table} from 'react-bootstrap';
import { BrowserRouter as Navigate, useNavigate } from 'react-router-dom';

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
        </>
    );
}

function PlanRow(props) {
    return (
        <tr><PlanData exam={props.exam} /></tr>
    );
}

function PlanData(props) {
    return (
        <>
            <td>{props.exam.code}</td>
            <td>{props.exam.name}</td>
            <td>{props.exam.cfu}</td>
        </>
    );
}

export { PlanTable };