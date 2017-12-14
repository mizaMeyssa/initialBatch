# The initial batch workflow runner

The initial batch workflow runner is node.js based javascript toolset that allows parsing csv formatted data files and write their content into database. It doesn’t append data. It is designed to work on a fresh database.
## Authors

* **Maissa Jabri**  - [mizaMeyssa](https://github.com/mizaMeyssa)

## Prerequisites

* NodeJS

## Code structure

The code is structured as follows:
<br />
---initialBatch: main toolset repository
<br />
------node_modules: node libraries that are necessary dependencies to run the toolset code. Unless you run the command npm install under initial batch directory, this folder will be empty. 
<br />
------input: data files input
<br />
---------<batch_input>.csv: the set of files that appear in Initial batch data list (format : csv)
<br />
------output: the result of csv files parsing into JSON objects and the SQL generated queries that were eventually run on the database
<br />
------modules
<br />
---------configSetter.js: used to make configurations on the server (ex copy a config file under a specific path, etc) 
<br />
---------dataParser.js: parses csv row files into JSON objects 
<br />
---------logger.js: logs a batch task start, failure and completion
<br />
---------sqlGenerator.js: parses JSON objects and generates relevant SQL queries 
<br />
---------taskRunner.js: performs a whole batch task (parse input, generate sql, archive generated outputs, execute the query on the database)
<br />
------package.json: list of node dependencies.

## Installation

* Run what follows to download and install all node dependecies 
```
npm install
```

## Usage

To use the initial batch you need to do what follows:
* Define your batch workflow dependecies graph. In fact, you need to split your input data into multiple levels based in their cascading dependencies (e.g. init-1 for tables that don't depend on any other tables, init-2 for tables that depend on those in tnit-1, etc.).
* For each bundle, create a js file as follows
``` javascript
var INPUT_PATH = process.env.INPUT_PATH;
var OUTPUT_PATH = process.env.OUTPUT_PATH;
var TOOLSET_PATH = process.env.TOOLSET_PATH;

var taskRunner = require(TOOLSET_PATH+'/taskRunner.js');

taskRunner.parseAndUpsert('My_Task_Name', 
					INPUT_PATH+'/my_input_filename.csv', 
					input_parser_callback, 
					OUTPUT_PATH+'/my_output_filename.json', 
					input_sql_callback, 
					OUTPUT_PATH+"my_output_filename.sql");
```
input_parser_callback and input_sql_callback are callback funtions that allow to respectively parsse csv files based on the record structure and generate the right sql querries based on your BD schema.
``` javascript
var user_parser_callback = function(record) {
	var profile_user = {'ProfileCode':record[0], 'ProfileLabel':record[1], 'UserLogin':record[2], 'UserPassword':record[3]};
	return profile_user;
}

var user_sql_callback = function(dataStructure) {
	var sqlScript = '';
	dataStructure.map(function(item){
		var table = "app_user";
		sqlScript	+= "INSERT INTO "
				+  table 
				+  " (login, password) "
				+  " SELECT \'"+ item.UserLogin + "\',\'" + item.UserPassword + "\'"
				+  " WHERE NOT EXISTS ( SELECT 1 FROM " + table + " where login = \'" + item.UserLogin + "\' and password = \'" + item.UserPassword + "\')"
				+  ";\n";
	});
	return sqlScript;
}
```
* Now that you have all your data bundles js files ready, you need to gather them in a single file that runs them sequentially. in ./initial-batch.sh you can do so by adding what follows
```
#!/bin/sh

#Set environment variables 
# Default values
export INPUT_PATH='./input/'
export OUTPUT_PATH='./output/'
export TOOLSET_PATH='./modules/'
# Change according to your project
export PGUSER='postgres'
export PGHOST='localhost'
export PGPASSWORD='root'
export PGDATABASE='robots'
export PGPORT='5432'

echo "*** Initial Batch Workflow Runner ***"
echo ""
echo ""
echo "Starting Group 1..."
node init-1.js
echo "Starting Group 2..."
node init-2.js
```
* You're all set! Run trigger the initial batch workflow.
```
sh initial-batch.sh
```


