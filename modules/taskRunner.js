var dataParser = require('./dataParser.js');
var sqlGenerator = require('./sqlGenerator.js');
var logger = require('./logger.js');

/*
 * This task performs what follows:
 * 1. parse input json data
 * 2. generate sql scripts
 * 3. connect to the database and execute them
 */
var parseAndUpsert = function(task, input_filename, parser_callback, json_output_filename, sql_callback, sql_output_filename) {
	dataParser.parseDataStructure(input_filename, json_output_filename, parser_callback).then( function(response){
		var sqlScript = sqlGenerator.generateDataStructureSql(response, sql_callback);
		logger.taskStartLog(task);
		sqlGenerator.archiveSQL(sqlScript, sql_output_filename);
		sqlGenerator.executeSQL(sqlScript).then(function(result){
			logger.taskDoneLog(task);
		}, function(error){
			logger.taskErrorLog(task);
		});
	}, function(error){
		console.error(error);
	});
}

exports.parseAndUpsert = parseAndUpsert;