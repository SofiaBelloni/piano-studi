'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const userDao = require('./user-dao'); // module for accessing the users in the DB
const cors = require('cors');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // for login
const session = require('express-session'); // enable sessions

// init express
const app = new express();
const port = 3001;

/*** Set up Passport ***/
//function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Username o password erreti' });

      return done(null, user);
    })
  }
));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); //per l'esame


// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});


/*** APIs ***/

// GET /api/courses
app.get('/api/courses', (req, res) => {
  dao.listCourses()
    .then(courses => res.json(courses))
    .catch((err) => {
      res.status(500).json({ errors: `Database error while retrieving courses` }).end()
    });
});

// GET /api/studyplan
app.get('/api/studyplan', isLoggedIn, async (req, res) => {
  try {
    const studyPlan = await dao.listStudyPlan(req.user.id);
    res.json(studyPlan);
  } catch (err) {
    res.status(500).json({ error: `Database error while retrieving study plan` }).end();
  }
});

//DELETE /api/studyplan
app.delete('/api/studyplan', isLoggedIn, async (req, res) => {
  try {
    await dao.deleteStudyPlan(req.user.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of studyplan` });
  }
});

//UPDATE enrollment api/enrollment
app.put('/api/enrollment', isLoggedIn, [
  check('enrollment').isIn(['partTime', 'fullTime', null]),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const enrollment = {
    id: req.user.id,
    enrollment: req.body.enrollment,
  };
  try {
    await dao.updateEnrollment(enrollment);
    res.status(200).end();
  }
  catch (err) {
    res.status(503).json({ error: `Database error during the update of enrollment` });
  }
});

//UPDATE increment student's number api/increment/students
app.put('/api/increment/students', isLoggedIn, [
  check().custom((val, { req }) => {
    return dao.listStudyPlan(req.user.id)
    .then(studyPlan => {
      for(const course of studyPlan){
        if (course.maxStudent !== null && course.student >= course.maxStudent)
          throw new Error(`Error: course ${course.code} reached max number of students`);
      }
    })
  })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await dao.incrementStudentsNumber(req.user.id);
      res.status(200).end();
    }
    catch (err) {
      res.status(503).json({ error: `Database error during the increment of students number` });
    }
  });

//UPDATE decrement student's number api/decrement/students
app.put('/api/decrement/students', isLoggedIn, [
  check().custom((val, { req }) => {
    return dao.listStudyPlan(req.user.id)
    .then(studyPlan => {
      for(const course of studyPlan){
        if (course.student - 1 < 0)
          throw new Error(`Error: course ${course.code} has not students enrolled`);
      }
    })
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    await dao.decrementStudentsNumber(req.user.id);
    res.status(200).end();
  }
  catch (err) {
    res.status(503).json({ error: `Database error during the decrement of students number` });
  }
});

//ADD /api/studyplan
app.post('/api/studyplan', isLoggedIn, [
  check('courses').isArray(),
  check('courses.*').isString().isLength({ min: 7, max: 7 }),
  check('courses').custom((studyPlanCodes, { req }) => {
    return dao.listCourses()
      .then(courses => {
        //read complete data from db
        const studyPlan = courses.filter(c => {
          return studyPlanCodes.some(s => { return s === c.code });
        })
        //check that there are all courses' code in the db 
        //and that each code is present only once
        if (studyPlan.length !== studyPlanCodes.length) {
          throw new Error("There is a course code not valid");
        }

        //check credits
        let totalCFU = 0;
        studyPlan.forEach((e) => {totalCFU += e.cfu});
        if (req.user.enrollment === null) throw new Error('Enrollment Error');
        const maxCFU = req.user.enrollment === 'fullTime' ? 80 : 40;
        const minCFU = req.user.enrollment === 'fullTime' ? 60 : 20;
        if (totalCFU > maxCFU || totalCFU < minCFU)
          throw new Error('Invalid number of CFU');

        //check prerequisite
        for (const course of studyPlan) {
          if (course.prerequisite !== null) {
            if (!studyPlan.find(e => e.code === course.prerequisite)) {
              throw new Error(`Missing prerequisite ${course.prerequisite} for course ${course.code}`);
            }
          }

          //check incompatibility
          if (course.incompatibility[0] !== null) {
            course.incompatibility.forEach(inc => {
              if (inc !== null && studyPlan.find(e => e.code === inc)) {
                throw new Error(`Incompatible course ${inc} for course ${course.code}`);
              }
            });
          }
        }
      })
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const studyPlan = {
    id: req.user.id,
    courses: req.body.courses,
  };

  try {
    await dao.addStudyPlan(studyPlan);
    res.status(201).end();
  }
  catch (err) {
    res.status(503).json({ error: `Database error during the insert of study plan.` });
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});