var gulp = require('gulp'),
      minifycss = require('gulp-minify-css'),
      jshint = require('gulp-jshint'),
      stylish = require('jshint-stylish'),
      uglify = require('gulp-uglify'),
      usemin = require('gulp-usemin'),
      imagemin = require('gulp-imagemin'),
      rename = require('gulp-rename'),
      concat = require('gulp-concat'),
      notify = require('gulp-notify'),
      cache = require('gulp-cache'),
      changed = require('gulp-changed'),
      rev = require('gulp-rev'),
      browserSync = require('browser-sync'),
      del = require('del'),
      ngdocs = require('gulp-ngdocs'),
      connect = require('gulp-connect');
var ngannotate = require('gulp-ng-annotate');

gulp.task('jshint', function () {
      return gulp.src('app/scripts/**/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function () {
      return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function () {
      gulp.start('usemin', 'imagemin', 'copyfonts', 'copytraductions');
});

gulp.task('usemin', ['jshint'], function () {
      return gulp.src('./app/**/*.html')
            .pipe(usemin({
                  css: [minifycss(), rev()],
                  js: [ngannotate(), uglify(), rev()]
            }))
            .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function () {
      return del(['dist/img']), gulp.src('app/img/**/*')
            .pipe(cache(imagemin({
                  optimizationLevel: 3,
                  progressive: true,
                  interlaced: true
            })))
            .pipe(gulp.dest('dist/img'))
            .pipe(notify({
                  message: 'Images task complete'
            }));
});

gulp.task('copyfonts', ['clean'], function () {
      gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
            .pipe(gulp.dest('./dist/fonts'));
      gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
            .pipe(gulp.dest('./dist/fonts'));
      gulp.src('app/fonts/**/*.{ttf,woff,eof,svg}*')
            .pipe(gulp.dest('./dist/fonts'));
});


gulp.task('copytraductions', function () {
      return gulp.src('app/traductions/*.json')
            .pipe(gulp.dest('dist/traductions'));
});


// Watch
gulp.task('watch', ['browser-sync'], function () {
      // Watch .js files
      // DO NOT USE: gulp.watch('{app/scripts/**/*.js,app/css/**/*.css,app/**/*.html}', ['usemin']);
      gulp.watch('{app/scripts/**/*.js,app/views/*.html,app/index.html,app/css/**/*.css}', ['usemin']);
      // Watch image files
      gulp.watch('app/img/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
      var files = [
            'app/views/*.html',
            'app/index.html',
            'app/css/**/*.css',
            'app/img/**/*.jpg',
            'app/scripts/**/*.js',
            'dist/**/*'
      ];
      // DO NOT USE 'app/**/*.html' above.

      browserSync.init(files, {
            server: {
                  baseDir: "dist",
                  index: "index.html"
            }
      });
      // Watch any files in dist/, reload on change
      gulp.watch(['dist/**']).on('change', browserSync.reload);
});