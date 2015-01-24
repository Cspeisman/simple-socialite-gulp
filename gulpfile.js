var gulp = require('gulp'),
    clean = require('gulp-clean'),
    fs = require('fs'),
    git = require('gulp-git'),
    config = require('yaml-config')
    settings = config.readConfig('./settings.yml');

gulp.task('clone', ['clean'], function(){
  fs.mkdirSync('./components');
  settings.libraries.forEach(function(repo){
    git.clone('https://github.com/' + repo, {cwd: './components'}, function (err) {
      if (err) throw err;
    })
  })
});

gulp.task('clean', function(){
  return gulp.src(['./build', './components'], {read: false})
  .pipe(clean());
});

gulp.task('default', ['clean', 'clone']);
