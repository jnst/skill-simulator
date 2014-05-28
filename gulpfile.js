var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

/**
 * JS
 */
gulp.task('js:category', function() {
  return gulp.src('js/category_data_*js')
    .pipe(concat('category.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:skill', function() {
  return gulp.src('js/skill_data_*js')
    .pipe(concat('skill.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:slot', function() {
  return gulp.src('js/slot_data_*js')
    .pipe(concat('slot.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:tooltip', function() {
  return gulp.src('js/data_skill-tooltip*js')
    .pipe(concat('tooltip.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('js:training', function() {
  return gulp.src('js/training.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('js', ['js:category', 'js:skill', 'js:slot', 'js:tooltip', 'js:training']);

/**
 * Others
 */
gulp.task('css', function() {
  return gulp.src('css/*')
    .pipe(gulp.dest('build/css'));
});

gulp.task('img', function() {
  return gulp.src('img/*')
    .pipe(gulp.dest('build/img'));
});

gulp.task('html', function() {
  return gulp.src('html/*')
    .pipe(gulp.dest('build'));
});

/**
 * Clean
 */
gulp.task('clean', function() {
  return gulp.src('build')
    .pipe(clean());
});

/**
 * Watch
 */
gulp.task('js:watch', function() {
  gulp.watch('js/category_data_*js', ['js:category']);
  gulp.watch('js/skill_data_*js', ['js:skill']);
  gulp.watch('js/slot_data_*js', ['js:slot']);
  gulp.watch('js/data_skill-tooltip*js', ['js:tooltip']);
});

gulp.task('default', ['html', 'css', 'img','js', 'js:watch']);
