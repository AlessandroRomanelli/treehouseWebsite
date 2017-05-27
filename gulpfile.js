'use strict'

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
      csso = require('gulp-csso'),
      maps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
 connect = require('gulp-connect'),
       del = require('del'),
     execa = require('execa'),
   options = {
       src: './src',
       dest: './dist',
       build: './src/build'
    };

gulp.task('concatScripts', () => {
  return gulp.src([options.src+'/js/**/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.build+'/js'));
});

gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src(options.build+'/js/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(options.build+'/js'))
})

gulp.task('scripts', ['minifyScripts'], () => {
  return gulp.src(options.build+'/js/all.min.js')
    .pipe(gulp.dest(options.dest+'/scripts'));
});

gulp.task('compileStyles', () => {
  return gulp.src([options.src+'/sass/global.scss'])
    .pipe(maps.init())
    .pipe(sass())
    .pipe(rename('all.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(options.build+'/css'))
});

gulp.task('minifyStyles', ['compileStyles'], () => {
  return gulp.src(options.build+'/css/all.css')
    .pipe(csso({sourceMap: true}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(options.build+'/css'))
});

gulp.task('styles', ['minifyStyles'], () => {
  return gulp.src(options.build+'/css/all.min.css')
    .pipe(gulp.dest(options.dest+'/styles'))
    .pipe(connect.reload());
});


gulp.task('images', () => {
  return gulp.src(options.src+'/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', () => {
  del(['dist', 'src/build']);
});

gulp.task('build', ['clean', 'scripts', 'styles', 'images'], () => {
  return gulp.src(options.src+'/index.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('watchSass', ['build'], () => {
  gulp.watch(options.src+'/sass/**/*.scss', ['styles']);
});

gulp.task('runServer', ['watchSass'], () => {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

gulp.task('default', ['runServer']);
