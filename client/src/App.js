import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { HomePage } from './HomePageComponents';
import { MyNavbar } from './NavbarComponents';
import { LoginForm } from './LoginComponents';
import { useEffect, useState } from 'react';
import API from './API';
import { CreatePlan } from './CreatePlanComponents';

//FIXME: rileggere le specifiche
//FIXME: PRECARICA DATABASE
//FIXME: migliora grafica
//FIXME: aggiungi messaggi successo / insuccesso
//FIXME: fai check lato server
//FIXME: mostra in homepage loggata il tipo di iscrizione e il numero di crediti
//FIXME: colorare le righe della tabella in edit 
//FIXME: aggiungi commenti al codice!!!
//FIXME:controlla che non ci siano warning
//FIXME: compila readme

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [exams, setExams] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState(''); //TODO: show messages
  const [successMessage, setsuccessMessage] = useState(''); //TODO: show messages
  const [dirty, setDirty] = useState(false);
  const navigate = useNavigate();

  function handleError(err) {
    console.log(err);
  }

  const checkAuth = async () => {
    try {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    checkAuth();
    API.getAllCourses()
      .then((exams) => { setExams(exams); setDirty(false); })
      .catch(err => console.log(err))
  }, [dirty])

  useEffect(() => {
    if (loggedIn)
      API.getStudyPlan()
        .then((courses) => { setStudyPlan(courses); setDirty(false); })
        .catch(err => handleError(err))
  }, [loggedIn, dirty])

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  }

  const deleteStudyPlan = async () => {
    API.decrementStudentsNumber()
      .then(() => API.deleteStudyPlan())
      .then(() => API.setEnrollmentNull())
      .then(() => {
        navigate('/');
        //FIXME: set success message
        setStudyPlan([]);
        user.enrollment = null;
        setDirty(true);
      })
      .catch(err => {
        setMessage(err);
      }) //TODO: add messagge
  }

  const addStudyPlan = async (enrollment, studyPlan) => {

    if (user.enrollment !== null) {
      //delete old study plan
      await API.decrementStudentsNumber()
        .then(() => API.deleteStudyPlan())
    }
    //add new study plan
    API.addStudyPlan(studyPlan.map((e) => e.code))
      //update student's enrollment
      .then(() => API.updateEnrollment(enrollment))
      //update number of students
      .then(() => API.incrementStudentsNumber())
      .then(() => {
        navigate('/');
        //FIXME: set success message
        setStudyPlan(studyPlan);
        user.enrollment = enrollment;
        setDirty(true);
      })
      .catch(err => {
        setMessage(err);
      })
    //TODO: 
    //success message
  }

  return (
    <>
      <MyNavbar name={user.name} loggedIn={loggedIn} logout={doLogOut} />
      <br />
      <Container>
      <Row className="justify-content-center"><Col xs={6}>
          {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
        </Col></Row>
        <Routes>
          <Route path='/' element={<HomePage exams={exams} studyPlan={studyPlan} delete={deleteStudyPlan} loggedIn={loggedIn} user={user}></HomePage>} />
          <Route path='/login' element={loggedIn ?
            <Navigate to='/' />
            : <LoginForm login={doLogIn} setDirty={setDirty} />} />
          <Route path='/edit' element={loggedIn ?
            <CreatePlan exams={exams} studyPlan={studyPlan} user={user} save={addStudyPlan} setDirty={setDirty} />
            : <Navigate to='/login' />} />
          <Route path='*' element={<h1 className='text-center'>Page not found</h1>}> </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
