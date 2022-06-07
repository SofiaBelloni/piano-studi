const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
  // call: GET /api/courses
  const response = await fetch(new URL('courses', APIURL), { credentials: 'include' });
  const coursesJson = await response.json();
  console.log(coursesJson);
  if (response.ok) {
    return coursesJson.map((course) => ({ code: course.code, name: course.name, cfu: course.cfu, student: course.student, maxStudent: course.maxStudent, prerequisite: course.prerequisite}));
  } else {
    throw coursesJson;  // an object with the error coming from the server
  }
}
const API = { getAllCourses };

export default API;