import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { HomePage } from './HomePageComponents';
import { MyNavbar } from './NavbarComponents';
import { LoginForm } from './LoginComponents';
import { useEffect, useState } from 'react';
import API from './API';
import { CreatePlan } from './CreatePlanComponents';

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
  const [dirty, setDirty] = useState(false);
  //TODO: dirtybit

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

  //to load courses at the beginning
  useEffect(() => {
    checkAuth();
    API.getAllCourses()
      .then((exams) => setExams(exams))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    checkAuth();
  }, [dirty])

  useEffect(() => {
    if (loggedIn)
      API.getStudyPlan()
        .then((courses) => { setStudyPlan(courses); })
        .catch(err => handleError(err))
  }, [loggedIn, dirty])

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
        console.log(user);
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
      .then(navigate('/'))
      .catch(err => {
        setMessage(err);
      }) //TODO: add success messagge
    setStudyPlan([]);
    user.enrollment = null;
    setDirty(true);
  }

  const addStudyPlan = async (enrollment, studyPlan) => {
    //delete old study plan
    API.decrementStudentsNumber()
      .then(() => API.deleteStudyPlan())
      //add new study plan
      .then(() => API.addStudyPlan(studyPlan))
      //update student's enrollment
      .then(() => API.updateEnrollment(enrollment))
      .then(() => API.incrementStudentsNumber())
      .then(navigate('/'))
      .catch(err => {
        setMessage(err);
      })
    //TODO: 
    //success message
    setDirty(true);
  }

  return (
    <>
      <MyNavbar name={user.name} loggedIn={loggedIn} logout={doLogOut} />
      <br />
      <Container>
        <Routes>
          <Route path='/' element={<HomePage exams={exams} studyPlan={studyPlan} delete={deleteStudyPlan} loggedIn={loggedIn} user={user}></HomePage>} />
          <Route path='/login' element={<LoginForm login={doLogIn} />} />
          //FIXME: redirect se non sei loggato
          <Route path='/edit' element={<CreatePlan exams={exams} studyPlan={studyPlan} user={user} save={addStudyPlan} />} />
          <Route path='*' element={<h1>Page not found</h1>}> </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
