import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { HomePage } from './HomePageComponents';
import { MyNavbar } from './NavbarComponents';
import { LoginForm } from './LoginComponents';
import { useEffect, useState } from 'react';
import API from './API';


import { CreatePlan } from './CreatePlanComponents';

/*const fakeExams = [
  { code: '01TYMOV', name: 'Information systems security', cfu: 30, student: 5, maxStudent: 100 },
  { code: '01SQJOV', name: 'Data Science and Database Technology', cfu: 21, student: 5, maxStudent: 100 },
  { code: '04GSPOV', name: 'Software Engineering', cfu: 26, student: 5, maxStudent: 100 }
];*/

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {

  const [exams, setExams] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();


  function handleError(err) {
    console.log(err);
  }

  //to load courses at the beginning
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
    // fetch  /api/courses
    API.getAllCourses()
      .then((exams) => setExams(exams))
      .catch(err => console.log(err))
  }, [])


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
  }

  return (
    <>
      <MyNavbar user={user} loggedIn={loggedIn} logout={doLogOut} />
      <br />
      <Container>
        <Routes>
          <Route path='/' element={<HomePage exams={exams} loggedIn={loggedIn} user={user}></HomePage>} />
          <Route path='/login' element={<LoginForm login={doLogIn}/>} />
          <Route path='/edit'  element={ <CreatePlan exams={exams} /> } />
          <Route path='*' element={<h1>Page not found</h1>}> </Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
