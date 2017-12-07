/*
 * This module generates sql queries based on the data structure and injects them into the database
 */

var pg = require('pg');
var fs = require('fs');

var generateDataStructureSql = function(dataStructure, sql_generator) {
    var sqlScript = sql_generator(dataStructure);
    return sqlScript;
}

var executeSQL = function(sqlScript) {
  return new Promise(function(resolve, reject){
      // create a pool
      var pool = new pg.Pool();
	    pool.connect(function (err, client, done) {
        if (err) {
          console.error('error fetching client from pool', err);
          reject(err);
        }
        client.query(sqlScript, function (err, result) {
          done()
          if (err) {
            return console.error('error happened during query', err);
            reject(err);
          }
          resolve(result.rows);
        });
        done();
      });
      pool.end();
  });
}

var archiveSQL = function(sqlScript, outputPath) {
  fs.writeFile(outputPath, sqlScript, function(err) {
        if(err) {
            return console.log(err);
        }
  }); 
}

exports.generateDataStructureSql = generateDataStructureSql;
exports.executeSQL = executeSQL;
exports.archiveSQL = archiveSQL;