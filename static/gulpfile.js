/**
 * Setup
 */
process.title = process.title || 'gulp';

/**
 * Dependencies
 */
const path    = require('path');
const gulp    = require('gulp');

/**
 * Setup
 */
const tasks = require(path.resolve(__dirname, 'tasks'));
const paths = {
  src: 'src/',
  dist: 'dist/',
  manifestPath: 'dist/manifest.json',
  scriptSourceTemplate: 'src/hbs/_scripts.hbs',
  styleSourceTemplate: 'src/hbs/_styles.hbs',
  staticRoot: '/site_media/static',
  fontAwesomeFonts: '../node_modules/font-awesome/fonts/**.*',
  bsFonts: '../node_modules/bootstrap/fonts/**.*',
  fonts: {
      dist: 'dist/fonts'
  },
  styles: {
    src: 'src/less/site.less',
    dist: 'dist/css'
  },
  js: {
    src: [
      'src/js/**/*'
    ],
    dist: 'dist'
  },
  manifest: {
    src: [
      'dist/**/*.css',
      'dist/**/*.js'
    ]
  },
  test: {
    all: 'test/**/*.test.js',
    req: 'test/req/*.test.js',
    components: 'test/components/*.test.js'
  },
  xo: {
   src: [
     'tasks/**/*.js',
     '_build/**/*.js'
   ]
  }
};

/**
 * Tasks
 */
gulp.task('build:clean', function buildClean() {
  return tasks.clean(paths.dist);
});

gulp.task('build:styles', function buildStyles() {
  return tasks.css(paths.styles.src)
    .pipe(gulp.dest(paths.styles.dist));
});

gulp.task('build:js', function buildJS() {
  return tasks.browserify(paths.src + 'js/site.js')
    .pipe(gulp.dest(paths.js.dist + '/js/'));
});

gulp.task('manifest', function manifest() {
  return tasks.rev(paths.manifest.src)
    .pipe(gulp.dest(paths.dist))
    .pipe(tasks.manifest())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build:fa-icons', function() { 
    return tasks.copy(paths.fontAwesomeFonts)
        .pipe(gulp.dest(paths.fonts.dist)); 
});
gulp.task('build:bs-icons', function() {
    return tasks.copy(paths.bsFonts)
        .pipe(gulp.dest(paths.fonts.dist));
})

gulp.task('build:script-include', function () {
    return tasks.handlebars(paths.manifestPath, paths.scriptSourceTemplate, paths.staticRoot)
        .pipe(gulp.dest('../semantic/templates/'));
});

gulp.task('build:style-include', function () {
    return tasks.handlebars(paths.manifestPath, paths.styleSourceTemplate, paths.staticRoot)
        .pipe(gulp.dest('../semantic/templates/'));
});

gulp.task('test', function test() {
  return tasks.test(paths.test.all);
});

gulp.task('test:req', function testReq() {
  return tasks.test(paths.test.req);
});

gulp.task('test:components', function testComponents() {
  return tasks.test(paths.test.components);
});

gulp.task('xo', function xo() {
  return tasks.xo(paths.xo.src);
});

/**
 * Compound Tasks
 */
gulp.task('watch', function watch() {
  gulp.watch(paths.src + 'less/**/*.less', gulp.series(['build:styles', 'manifest', 'build:style-include']));
  gulp.watch(paths.src + 'js/**/*.js', gulp.series(['build:js', 'manifest', 'build:script-include']));
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
