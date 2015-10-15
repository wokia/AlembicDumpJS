var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require("gulp-uglify");
var karma = require('karma');
var merge = require('merge2');
var del = require('del');
var rename = require('gulp-rename');

var tsLibProject = typescript.createProject('./tsconfig.json', {out: "alembic.js", declaration: true});
var tsSpecProject = typescript.createProject('./tsconfig.json', {out: "alembic.spec.js"});

gulp.task('compile-typescript', function() {
	var tsLibResult = gulp.src(['./source/**/*.ts'])
	.pipe(sourcemaps.init())
	.pipe(typescript(tsLibProject))

	return merge([
		tsLibResult.dts.pipe(gulp.dest('./lib')),
		tsLibResult.js.pipe(sourcemaps.write()).pipe(gulp.dest('./lib'))
	])
})

gulp.task('compile-spec-typescript', function() {
	return gulp.src(['./spec/**/*.spec.ts', './source/**/*.ts'])
	.pipe(sourcemaps.init())
	.pipe(typescript(tsSpecProject))
	.js
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./out/spec'))
})

gulp.task('build', ['compile-typescript'], function() {
	return gulp.src(['./lib/alembic.js'])
	.pipe(uglify({
		preserveComments: 'some'
	}))
	.pipe(rename('alembic.min.js'))
	.pipe(gulp.dest('./lib'))
})

gulp.task('clean', function() {
	del(['lib', 'out'])
})

gulp.task('test', ['compile-spec-typescript'], function(done) {
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
