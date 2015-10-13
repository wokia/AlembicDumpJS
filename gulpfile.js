var gulp = require('gulp');
var typescript = require('gulp-typescript');
var karma = require('karma');
var del = require('del');

var typescriptConfig = require('./tsconfig.json');

gulp.task('compile-typescript', function() {
	return gulp.src(['./source/scripts/**/*.ts'])
	.pipe(typescript(typescriptConfig))
	.js
	.pipe(gulp.dest('./out/scripts'))
})

gulp.task('compile-spec-typescript', function() {
	return gulp.src(['./spec/**/*.spec.ts'])
	.pipe(typescript(typescriptConfig))
	.js
	.pipe(gulp.dest('./out/spec'))
})

gulp.task('build', ['compile-typescript'])

gulp.task('clean', function() {
	del(['out'])
})

gulp.task('test', ['compile-typescript', 'compile-spec-typescript'], function(done) {
/*
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
*/
	karma.server.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, function(exitCode) {
		done();
	})
})

gulp.task('default', ['build'])
