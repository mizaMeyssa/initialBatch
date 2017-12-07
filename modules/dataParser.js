/*
 * This module parses input data files into a json structure
 */

var csv = require("fast-csv");
var jsonfile = require('jsonfile');
var fs = require('fs');

var parseDataStructure = function(input, output, record_parser) {

    return new Promise(function(resolve, reject){

        var dataStructure = [];
        fs.createReadStream(input)
        .pipe(csv(), {trim : true, headers : true})
        .on("data", function(record){
            // @Maissa: trim option in fast-csv doesn't work, so I had to trim all the fields..
            // @Maissa replacing ' by '' for SQL injection
            record = record.map(function(field){return field.trim().replace(/'/g, "''")})
            dataStructure.push(record_parser(record));
        })
        .on("end", function(){
            // @Maissa: headers option in fast-csv doesn't work as well, so I had to shift the first item..
            dataStructure.shift();
            output ? jsonfile.writeFile(output, dataStructure, function (err) {
                if (!err) { 
                   resolve(dataStructure);
                } else {
                   reject(err);
                }
            }) : resolve(dataStructure);
        });

    })
}

exports.parseDataStructure = parseDataStructure;