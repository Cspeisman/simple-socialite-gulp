var gulp = require('gulp'),
    clean = require('gulp-clean'),
    fs = require('fs'),
    git = require('gulp-git'),
    config = require('yaml-config')
    settings = config.readConfig('./settings.yml'),
    args = require('yargs').argv,
    glob = require('glob'),
    _ = require('underscore'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');



gulp.task('coffee', ['clone'], function(){
  return gulp.src('./src/*.coffee')
  .pipe(coffee({bare: true}))
  .pipe(gulp.dest('./build/'))
  .on('end', addSettings)
});

function addSettings(){
  var file, js;
  file = './build/simple-socialite.js';
  function replacer(match, capture) {
    return settings[capture];
  }
  js = fs.readFileSync(file).toString().replace(/\{% settings\.([A-Z_]+) %\}/g, replacer);
  fs.writeFileSync(file, js);
}

// function verifyExtensions(){
//   tmp_arr = []
//   extensions = args.e.split(" ")  
//   files = glob.sync('./components/**/*');

//   _.each(extensions, function(ext){
//     _.each(files, function(file){
//       re = new RegExp(ext)
//       if(file.match(re)){
//         console.log(file)
//         tmp_arr.push(ext)
//       }
//     });
//   });
//   console.log(tmp_arr)
// }

gulp.task('verify', ['clone'], function(){
  files = glob.sync('./components/**/*');
  console.log('called back!')
  console.log(files)
});

gulp.task('clone', ['clean'], function(cb){
  console.log('cleaned');
  fs.mkdirSync('./components');
  _.each(settings.libraries, function(repo){
    git.clone('https://github.com/' + repo, {cwd: './components'}, function (err) {
      if(repo == _.last(settings.libraries)){
        cb();
      } 
      if (err) throw err;
    });
  });
});


gulp.task('clean', function(){
  return gulp.src(['./build', './components', './build'], {read: false})
  .pipe(clean());
});

gulp.task('default', ['clean', 'clone', 'verify'], function(){
  console.log('finished')
});

