/**
 * Setup
 */
process.title = process.title || 'gulp';

/**
 * Dependencies
 */
const path = require('path');
const gulp = require('gulp');

/**
 * Setup
 */
const tasks = require(path.resolve(__dirname, 'static/tasks'));
const config = require(path.resolve(__dirname, 'static/config'));

/**
 * Tasks
 */
gulp.task('build:clean', function buildClean() {
  tasks.clean(config.paths.build);
  return tasks.clean(config.paths.dist);
});

gulp.task('build:styles', function buildStyles() {
  return tasks.css(config.styles.source, {less: {paths: config.styles.npmPaths}})
    .pipe(gulp.dest(config.styles.dist));
});

gulp.task('build:js', function buildJS() {
  return tasks.browserify(config.scripts.main)
    .pipe(gulp.dest(config.scripts.dist));
});

gulp.task('manifest', function manifest() {
  return tasks.rev(config.manifest.source)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(tasks.manifest())
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('build:fa-icons', function() { 
    return tasks.copy(config.fonts.fontAwesomeSource)
        .pipe(gulp.dest(config.fonts.dist)); 
});
gulp.task('build:bs-icons', function() {
    return tasks.copy(config.fonts.bootstrapSource)
        .pipe(gulp.dest(config.fonts.dist));
})

gulp.task('build:script-include', function () {
    return tasks.handlebars(config.templates.manifestPath, config.templates.scriptsTemplate, config.staticUrlRoot)
        .pipe(gulp.dest(config.templates.destination));
});

gulp.task('build:style-include', function () {
    return tasks.handlebars(config.templates.manifestPath, config.templates.stylesTemplate, config.staticUrlRoot)
        .pipe(gulp.dest(config.templates.destination));
});

gulp.task('test', function test() {
  return tasks.test(config.test.all);
});

gulp.task('test:req', function testReq() {
  return tasks.test(config.test.req);
});

gulp.task('test:components', function testComponents() {
  return tasks.test(config.test.components);
});

gulp.task('xo', function xo() {
  return tasks.xo(config.xo.source);
});

/**
 * Compound Tasks
 */
gulp.task('watch', function watch() {
  gulp.watch(config.watch.styles, gulp.series(['build:styles', 'manifest', 'build:style-include']));
  gulp.watch(config.watch.scripts, gulp.series(['build:js', 'manifest', 'build:script-include']));
});

gulp.task('build', gulp.series([
  'xo',
  'build:clean',
  gulp.parallel([
    'build:styles',
    'build:js',
    'build:fa-icons',
    'build:bs-icons'
  ]),
  'manifest',
  'build:script-include',
  'build:style-include'
]));

gulp.task('default', gulp.series([
  'build',
  'watch'
]));
