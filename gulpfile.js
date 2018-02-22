var gulp = require('gulp'),
gutil = require('gulp-util'),
babel = require('gulp-babel'),
runSequence = require('run-sequence'),
cors_proxy = require('cors-anywhere'),
browserSync = require('browser-sync').create();

gulp.task('default', function(done) { runSequence('proxy','babel','launch_server'); });
gulp.task('watch', function() {
  gulp.start('babel');
  gulp.watch('src/**/*.js', ['babel-watch']);
  gulp.start('proxy');
  gulp.start('launch_server');
});

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./'));
});

gulp.task('babel-watch', ['babel'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('proxy', function() {
  cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
  }).listen(9000, '127.0.0.1', function() {
    console.log('Running CORS Anywhere on ' + '127.0.0.1' + ':' + 9000);
  });
});

gulp.task('launch_server', function(callback) {
    browserSync.init({
    server: {
      baseDir: './',
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    },
    startPath: '/index.html',
    ghostMode: false
  });
  gulp.watch('./*').on('change', browserSync.reload);
});
