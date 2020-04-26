/** Modules **/

const fs           = require('fs')
const sync         = require('browser-sync').create()
const gulp         = require('gulp')
const pug          = require('gulp-pug')
const sass         = require('gulp-sass')
const data         = require('gulp-data')
const concat       = require('gulp-concat')
const rename       = require('gulp-rename')
const replace      = require('gulp-replace')
const cleanCSS     = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')
const urlBuilder   = require('gulp-url-builder')
const autoprefixer = require('gulp-autoprefixer')
const htmlbeautify = require('gulp-html-beautify')



/** Variables **/

const destination = 'docs'



/** Pug **/

gulp.task('pug:html', () => {
  return gulp.src([
    'src/pug/views/**/*.pug'
  ]).pipe( pug() )
    .pipe( htmlbeautify({ indent_size: 2 }) )
    .pipe( urlBuilder() )
    .pipe( gulp.dest(destination) )
    .pipe( sync.reload({ stream: true }) )
})

// pug master
gulp.task('pug', gulp.parallel('pug:html'))

// pug watcher
gulp.task('watch:pug', () => {
  gulp.watch(
    'src/pug/**/*.pug',
    gulp.series('pug')
  )
})



/** Sass **/

// sass master
gulp.task('sass', () => {
  return gulp.src([
    'src/scss/**/*.+(sass|scss|css)',
    '!**/_*.*'
  ]).pipe( sourcemaps.init() )
    .pipe( sass() )
    .pipe( autoprefixer() )
    .pipe( cleanCSS() )
    .pipe( sourcemaps.write('./') )
    .pipe( gulp.dest(`${destination}/css`) )
    .pipe( sync.reload({ stream: true }) )
})

// sass watcher
gulp.task('watch:sass', () => {
  gulp.watch(
    'src/scss/*.+(sass|scss)',
    gulp.series('sass')
  )
})



/** Javascript **/

gulp.task('js:bundle', () => {
  return gulp.src('src/js/**/*.js')
    .pipe( gulp.dest(`${destination}/js`) )
})

// js master
gulp.task('js',
  gulp.parallel(
    'js:bundle'
  )
)

// js watcher
gulp.task('watch:js', () => {
  gulp.watch(
    'src/js/**/*.js',
    gulp.series('js')
  )
})



/** Browser Sync **/

gulp.task('sync', () => {
  sync.init({
    server: {
      baseDir: `./${destination}`
    }
  })
})



/** Watch **/

gulp.task('watch',
  gulp.parallel(
    'watch:js',
    'watch:sass',
    'watch:pug'
  )
)



/** Master **/

gulp.task('master',
  gulp.parallel(
    'js',
    'sass',
    'pug'
  )
)



/** Default **/

gulp.task('default',
  gulp.series(
    'master',
    gulp.parallel(
      'watch',
      'sync'
    )
  )
)
