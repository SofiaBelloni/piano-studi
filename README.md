# Exam #12345: "Piano degli studi
## Student: s303393 BELLONI SOFIA 

## React Client Application Routes

- Route `/`: HomePage in cui viene mostrata la lista di tutti i corsi disponibili. Nel caso in cui l'utente abbia effettuato il login, viene data la possibilità di inserire un nuovo piano di studio o, se già presente, di modificarlo o eliminarlo.
- Route `path=/login`: Schermata di login.
- Route `path=/edit`: Schermata di aggiunta o modifica del piano di studio. Nel primo caso si potrà scegliere il tipo di iscrizione (fullTime o partTime), mentre nel secondo caso sarà possibile solo aggiungere o modificare i corsi scelti, rispettando i vincoli di numero di crediti del tipo di iscrizione scelto in precedenza.

## API Server

### Courses and study plan management

#### Get all Courses

* HTTP method: `GET`  URL: `/api/courses`
* Description: Get all the courses
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success) `500` (internal server error)
* Response body: Array of objects, each describing one course:
```
[{
  "code":"02GOLOV",
  "name":" Architetture dei sistemi di elaborazione",
  "cfu":12,
  "student":0,
  "maxStudent":null,
  "prerequisite":null,
  "incompatibility":["02LSEOV"]
 },
 {
  "code":"01UDFOV",
  "name":"Applicazioni Web I",
  "cfu":6,
  "student":1,
  "maxStudent":null,
  "prerequisite":null,
  "incompatibility":["01TXYOV"]
  },
  ...
```

#### Get StudyPlan

* HTTP method: `GET`  URL: `/api/studyplan`
* Description: Get all the courses of the study plan belong to the logged user
* Request body: _None_
* Request query parameter: _None_
* Response: `200 OK` (success) `500` (internal server error)
* Response body: Array of objects, each describing one course of the study plan:
```
[{
  "code":"02GOLOV",
  "name":" Architetture dei sistemi di elaborazione",
  "cfu":12,
  "student":0,
  "maxStudent":null,
  "prerequisite":null,
 },
 {
  "code":"01UDFOV",
  "name":"Applicazioni Web I",
  "cfu":6,
  "student":1,
  "maxStudent":null,
  "prerequisite":null,
  },
  ...
```

#### Delete study plan

* HTTP method: `DELETE`  URL: `/api/studyplan`
* Description: Delete the existing study plan of the logged user
* Request body: _None_
* Response: `200 OK` (success) `503` (internal server error)
* Response body: _None_

#### __Update enrollment__

* HTTP Method: `PUT` URL: `/api/enrollment`
* Description: Update the enrollment value of the logged user (partTime, fullTime or null)
* Request body: value of enrollment
```
{enrollment: "partTime"}
```
* Response: `200 OK` (success) `503` (internal server error) `422` (not found)


#### __Increment enrolled students' number__

* HTTP Method: `PUT` URL: `/api/increment/students`
* Description: Update enrolled students number
* Request body: _None_
* Response: `200 OK` (success) `503` (internal server error) `422` (not found)

#### __Decrement enrolled students' number__

* HTTP Method: `PUT` URL: `/api/decrement/students`
* Description: Update enrolled students number
* Request body: _None_
* Response: `200 OK` (success) `503` (internal server error) `422` (not found)

#### __Add study plan__

* HTTP Method: `POST` URL: `/api/studyplan`
* Description: Adds a new study plan of the logged user
* Request body: array of courses' codes
```
{ courses: studyPlan }
```
* Response: `201 OK` (success) `503` (internal server error) `422` (not found)
* Response body: _None_ 

### User management
#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: authenticate the user who is trying to login
* Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```
* Response: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)
* Response body: authenticated user

```
{
    "id": 2,
    "username": "sofiabelloni@polito.it", 
    "name": "Sofia",
    "enrollment": "partTime"
}
```

#### Check if user is logged in

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: check if current user is logged in and get his data
* Request body: _None_
* Response: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
* Response body: authenticated user

``` JSON
{
    "id": 2,
    "username": "sofiabelloni@polito.it", 
    "name": "Sofia",
    "enrollment": "partTime"
}
```

#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: logout current user
* Request body: _None_
* Response: `200 OK` (success), `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
* Response body: _None_

## Database Tables

- Table `exams`: contains `code`, `name`, `cfu`, `student`, `maxStudent`, `prerequisite` of each course.

- Table `incompatibility`: contains `code1`, `code2`, i.e. codes of incompatible courses.

- Table `studyPlan`: contains `id`, `code` where id is from users.id and code is from exams.code
- Table `users`: contains `id`, `email`, `name`, `hash`, `salt`, `enrollment` of each user.


## Main React Components

- `ExamTable` (in `ExamComponents.js`): represent the table showing all courses.
- `PlanTable` (in `StudyPlanComponents.js`): represent the table showing study plan's courses.
- `LoginForm` (in `LoginComponents.js`): represents the form of the login.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

| email | password | name |
|-------|----------|------|
| test@polito.it | password | test |
| sofiabelloni@polito.it | password | Sofia |
| stefano@gmail.com | password | Stefano |
| mariorossi@polito.com | password | Mario |
| john.doe@gmail.com | password | John |