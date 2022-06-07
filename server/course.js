'use strict'

function Course(code, name, cfu, student, maxStudent, prerequisite, incompatibility=[]){
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.student = student;
    this.maxStudent = maxStudent;
    this.prerequisite = prerequisite;
    this.incompatibility = incompatibility;
}

exports.Course = Course;