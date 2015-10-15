var gulp = require('gulp');
var typescript = require('gulp-typescript');
var webpack = require('webpack-stream');
var karma = require('karma');
var named = require('vinyl-named');
var del = require('del');

var typescriptConfig = require('./tsconfig.json');

gulp.task('compile-lib-typescript', function() {
	return gulp.src(['./lib/**/*.ts'])
	.pipe(typescript(typescriptConfig))
	.js
	.pipe(gulp.dest('./out/lib'))
})

gulp.task('compile-app-typescript', function() {
	return gulp.src(['./source/scripts/**/*.ts'])
	.pipe(typescript(typescriptConfig))
	.js
	.pipe(gulp.dest('./out/scripts'))
})

gulp.task('compile-spec-typescript', function() {
	return gulp.src(['./spec/**/*.spec.ts'])
	.pipe(typescript(typescriptConfig))
	.js
	.pipe(gulp.dest('./out/spec-unpack'))
})

gulp.task('compile-typescript', ['compile-lib-typescript', 'compile-app-typescript', 'compile-spec-typescript'])

gulp.task('build-spec-scripts', ['compile-typescript'], function() {
	return gulp.src(['./out/spec-unpack/**/*.spec.js'])
	.pipe(named())
	.pipe(webpack({
		externals: [
			'alembic',
		],
		resolve: {
			alias: {
				lib: __dirname + '/out/lib',
			},
		},
	}))
	.pipe(gulp.dest('./out/spec'))
})

gulp.task('build', ['compile-app-typescript'])

gulp.task('clean', function() {
	del(['out'])
})

gulp.task('test', ['build-spec-scripts'], function(done) {
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
