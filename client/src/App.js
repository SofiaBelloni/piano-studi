import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ExamList } from './ExamComponents';
import { MyNavbar } from './NavbarComponents';
import { LoginForm } from './LoginComponents';
import { useEffect, useState } from 'react';


import { CreatePlan } from './CreatePlanComponents';

const fakeExams = [
  { code: '01TYMOV', name: 'Information systems security', cfu: 30, student: 5, maxStudent: 100 },
  { code: '01SQJOV', name: 'Data Science and Database Technology', cfu: 21, student: 5, maxStudent: 100 },
  { code: '04GSPOV', name: 'Software Engineering', cfu: 26, student: 5, maxStudent: 100 }
];

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({});

  function doLogOut(){
    setLoggedIn(false);
    /*await API.logOut();
    setLoggedIn(false);
    setUser({});
    setCourses([]);
    setExams([]);*/
  }


  return (
    <>
      <MyNavbar user={user} loggedIn={loggedIn} logout={doLogOut}/>
      <br />
      <Container>
        <Routes>
          <Route path='/' element={
            loggedIn ? <CreatePlan exams={fakeExams}></CreatePlan>
              : <ExamList exams={fakeExams}></ExamList>} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='*' element={<h1>Page not found</h1>}> </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
