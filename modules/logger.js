/*
 * This module logs tasks start, failure and completion logs
 */

var taskStartLog = function (task) {
    console.log("INFO: "+new Date().toLocaleString("ja-jp")+": Task: "+task+" started");
}

var taskDoneLog = function (task , output) {
    console.log("INFO: "+new Date().toLocaleString("ja-jp")+": Task: "+task+" Done");
    output? console.log("INFO: Check output under : "+output): null;
}

var taskErrorLog = function (task , output) {
    console.log("ERROR: "+new Date().toLocaleString("ja-jp")+": Task: "+task+" Failed or did not proceed fully");
    output? console.log("ERROR: Check output under : "+output): null;
}


exports.taskStartLog = taskStartLog;
exports.taskDoneLog = taskDoneLog;
exports.taskErrorLog = taskErrorLog;