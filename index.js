var path = require('path');
var JSHINT = require('jshint').JSHINT;
var sander = require('sander');
var findup = require('findup-sync');

var jshintRC = findup('.jshintrc');
var defaults = {};

if (jshintRC) {
	try {
		defaults = JSON.parse(sander.readFileSync(jshintRC).toString());
	} catch (err) {
		throw new Error('Could not parse .jshintrc.');
	}
}

module.exports = function jshint (inputDir, options) {
	var log = this.log;
	var accept = options.accept || '.js';
	var reportOnly = !!options.reportOnly;
	var reporter = options.reporter || defaultReporter;
	var reports = [];

	delete options.accept;
	delete options.reporter;
	delete options.reportOnly;

	if (!Object.keys(options).length) {
		options = defaults;
	}

	return sander.lsr(inputDir).then(function (files) {
		return files.filter(function (file) {
			if (!Array.isArray(accept)) {
				accept = [ accept ];
			}

			return accept.some(function (accept) {
				return typeof accept === 'string'
					? ~file.indexOf(accept, file.length - accept.length)
					: accept.test(file);
			});
		}).reduce(function (current, file) {
			return current.then(function () {
				var filePath = path.join(inputDir, file);

				return sander.readFile(filePath)
					.then(String)
					.then(function (code) {
						log('Linting %s.', file);
						JSHINT(code, options, options.globals);

						if (JSHINT.errors.length) {
							reports.push({
								file: file,
								errors: JSHINT.errors,
								filePath: filePath,
							});
						}
					});
			});
		}, sander.Promise.resolve());
	}).then(function () {
		if (reports.length) {
			reporter(reports);

			if (!reportOnly) {
				throw new Error( 'Linting failed.' );
			}
		}
	});
};

function defaultReporter(reports) {
	reports.forEach(function (report) {
		report.errors.forEach(function (error) {
			if (error) {
				console.log('%s: line %d, col %d, %s.', report.filePath, error.line, error.character, error.reason);
			}
		});
	});
}
