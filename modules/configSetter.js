/*
 * This module affectuates operations of configuration that we shall effectuate as part of the initial batch
 * E.g. copy an external application configuration file under a specific path
 */

var mv = require('mv');

var config_path = '/product/IPONOFFRE/filestore/scanpet/scenario/';

var setConfig = function(input_path, output_path, filename) {
	return new Promise (function(resolve, reject) {
		mv(input_path+filename, config_path+filename, function(err) {
			reject(err);
		});
		resolve();
	});
}

exports.setConfig = setConfig;