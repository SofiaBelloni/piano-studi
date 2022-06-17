const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
  // call: GET /api/courses
  const response = await fetch(new URL('courses', APIURL));
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((course) => ({ code: course.code, name: course.name, cfu: course.cfu, student: course.student, maxStudent: course.maxStudent, prerequisite: course.prerequisite, incompatibility: course.incompatibility}));
  } else {
    throw coursesJson;  // an object with the error coming from the server
  }
}

async function getStudyPlan() {
  // call: GET /api/studyplan
  const response = await fetch(new URL('studyplan', APIURL), {credentials: 'include'});
  const studyplanJson = await response.json();
  if (response.ok) {
    console.log(studyplanJson);
    return studyplanJson.map((course) => ({ code: course.code, name: course.name, cfu: course.cfu, student: course.student, maxStudent: course.maxStudent, prerequisite: course.prerequisite}));
  } else {
    throw studyplanJson;  // an object with the error coming from the server
  }
}
function deleteStudyPlan() {
  // DELETE /api/studyplan
  return new Promise((resolve, reject) => {
    fetch(new URL('studyplan', APIURL), {
      method: 'DELETE',
      credentials: 'include'
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function setEnrollmentNull() {
  // call: PUT api/enrollment
  return new Promise((resolve, reject) => {
    fetch(new URL('enrollment', APIURL), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({enrollment: 'NULL'}),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateEnrollment(enrollment) {
  // call: PUT api/enrollment
  return new Promise((resolve, reject) => {
    fetch(new URL('enrollment', APIURL), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({enrollment: enrollment}),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((obj) => { reject(obj); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function addStudyPlan(studyPlan) {
  //call: POST api/studyPlan
  return new Promise((resolve, reject) => {
    fetch(new URL('studyplan', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courses: studyPlan }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Cannot parse server response." }) });
      }
    }).catch(() => { reject({ error: "Cannot communicate with server." }) });
  });
}

async function logIn(credentials) {
  let response = await fetch(new URL('sessions', APIURL), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { getAllCourses, getStudyPlan, deleteStudyPlan, setEnrollmentNull, updateEnrollment, addStudyPlan, logIn, logOut, getUserInfo };

export default API;