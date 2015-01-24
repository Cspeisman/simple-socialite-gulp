var gulp = require('gulp'),
    clean = require('gulp-clean'),
    download = require('gulp-download');

gulp.task('clean', function(){
  return gulp.src(['./build', './components'], {read: false})
  .pipe(clean());
});

gulp.task('default', function(){
  console.log("hello world");
});
