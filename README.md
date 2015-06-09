# gobble-jshint

Check JavaScript files with gobble and jshint.

## Installation

```bash
npm install gobble-jshint
```

## Usage

```js
gobble('src/js').observe( 'jshint', {
	// string, array, or RegExp
	accept: '.js',
	
	// if `true`, errors will not cause the whole build to fail
	reportOnly: false,

	// custom reporting function reporter
	reporter: function (results) {
		// `results` is an array of { file, filePath, errors } objects
	},

	// all other options are jshint options
});
```

If no jshint options are supplied with the second argument, gobble-jshint will use the nearest `.jshintrc` file instead (this is recommended). See 
the [jshint](http://jshint.com/) website for documentation on the options you can specify.

## License

MIT. Copyright (c) 2015 Martin Kolárik.
