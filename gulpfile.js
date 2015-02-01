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
    copysync = require('copysync'),
    rename = require('gulp-rename');


gulp.task('coffee', ['verify'], function(){
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

gulp.task('pack', ['coffee'], function(){
  js = fs.readFileSync("./components/socialite/socialite.js").toString() + "\n";
  paths = glob.sync("./.tmp/*.js");
  _.each(paths, function(file){
    js += fs.readFileSync(file).toString() + "\n"
  });
  js += fs.readFileSync("./build/simple-socialite.js").toString() + "\n"
  return fs.writeFileSync("./build/simple-socialite-pack.js", js);
});

gulp.task('verify', ['clone'], function(){
  extensions_path = [];
  extensions = args.e.split(" ");
  fs.mkdirSync('./.tmp');
  files = glob.sync('./components/**/*');

  _.each(extensions, function(extension){
    extensions_path = _.filter(files, function(path){
      return path.match(new RegExp('socialite.' + extension + '.js'));    
    });

    if(extensions_path.length){
      copysync(extensions_path[0], './.tmp');
    }
  });

});

gulp.task('clone', ['clean'], function(cb){
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
  return gulp.src(['./build', './components', './build', './.tmp'], {read: false})
  .pipe(clean());
});

gulp.task('default', ['clean', 'clone', 'verify', 'coffee', 'pack'], function(){
  console.log('finished')
});

