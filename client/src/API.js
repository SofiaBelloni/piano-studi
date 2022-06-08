const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
  // call: GET /api/courses
  const response = await fetch(new URL('courses', APIURL), { credentials: 'include' });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((course) => ({ code: course.code, name: course.name, cfu: course.cfu, student: course.student, maxStudent: course.maxStudent, prerequisite: course.prerequisite}));
  } else {
    throw coursesJson;  // an object with the error coming from the server
  }
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



const API = { getAllCourses, logIn, logOut, getUserInfo };

export default API;