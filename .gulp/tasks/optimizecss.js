const gulp      = require('gulp');
const minifycss = require('gulp-minify-css');
const size      = require('gulp-size');


module.exports = (source, options, dist) => {
    return gulp.src(source)
        .pipe(minifycss(options))
        .pipe(gulp.dest(dist))
        .pipe(size());
};
