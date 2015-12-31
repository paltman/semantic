/**
 * Dependencies
 */
const gulp   = require('gulp');
const less   = require('gulp-less');
const prefix = require('gulp-autoprefixer');

/**
 * Module body
 */
module.exports = (entry, config) => {
  config = config || {};
  config.less = config.less || {};
  config.autoprefixer = config.autoprefixer || {};

  config.less.paths = [
    '../node_modules/bootstrap/less',
    '../node_modules/font-awesome/less'
  ];

  return gulp.src(entry)
    .pipe(less(config.less))
    .pipe(prefix(config.autoprefixer));
};
