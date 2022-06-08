'use strict'
const sqlite = require('sqlite3');
const { Course } = require('./course');

const db = new sqlite.Database('studyPlan.db', (err) => {
    if (err) throw err;
});

//get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM exams ORDER BY name";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const course = rows.map(row => new Course(row.code, row.name, row.cfu, row.student, row.maxStudent, row.prerequisite));
                resolve(course);
            }
        });
    })
}