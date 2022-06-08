import { PlanTable } from './StudyPlanComponents';
import { ExamList } from './ExamComponents';

function HomePage(props) {
    const addedExams = [];
    return (
        <>
            {props.loggedIn ? <PlanTable exams={addedExams}/> : false}
            <ExamList exams={props.exams}/>
        </>
    );
}

export { HomePage };