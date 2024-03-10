// modules
const fs           = require('fs')
const bsync        = require('browser-sync').create()
const webpack      = require('webpack-stream')
const autoprefixer = require('autoprefixer')

// gulp
const { src, dest, series, parallel, watch } = require('gulp')

// gulp plugins
const pug          = require('gulp-pug')
const sass         = require('gulp-sass')(require('sass'))
const data         = require('gulp-data')
const rename       = require('gulp-rename')
const replace      = require('gulp-replace')
const postcss      = require('gulp-postcss')
const cleanCSS     = require('gulp-clean-css')
const sourcemaps   = require('gulp-sourcemaps')
const urlBuilder   = require('gulp-url-builder')
const htmlbeautify = require('gulp-html-beautify')

// variables & config
const destination = 'docs'
const webpackOptions = { mode: 'production' }
const locals = {}

// pug
function pugCompile() {
  return src([
    'src/pug/views/**/*.pug'
  ]).pipe( pug({ locals }) )
    .pipe( htmlbeautify({ indent_size: 2 }) )
    .pipe( urlBuilder() )
    .pipe( dest(destination) )
    .pipe( bsync.reload({ stream: true }) )
}
function pugWatch(cb) {
  watch(['src/pug/**/*.pug'], pugCompile)
  cb()
}

// sass
function sassCompile() {
  return src([
    'src/scss/**/*.+(sass|scss|css)',
    '!src/scss/**/_*.*'
  ]).pipe( sass({ includePaths: ['node_modules'] }) )
    .pipe( postcss([ autoprefixer() ]) )
    .pipe( cleanCSS() )
    .pipe( dest(`${destination}/css`) )
    .pipe( bsync.reload({ stream: true }) )
}
function sassWatch(cb) {
  watch(['src/scss/**/*.*'], sassCompile)
  cb()
}

// javascript
function jsBundle() {
  return src('src/js/app.js')
    .pipe( webpack(webpackOptions) )
    .pipe( rename({ basename: 'app' }) )
    .pipe( dest(`${destination}/js`) )
    .pipe( bsync.reload({ stream: true }) )
}
function jsWatch(cb) {
  watch('src/js/**/*.js', jsBundle)
  cb()
}

// browsersync
function sync() {
  bsync.init({
    server: {
      baseDir: `./${destination}`
    }
  })
}

// exports
exports.pug     = pugCompile
exports.sass    = sassCompile
exports.js      = jsBundle
exports.build   = series(exports.pug, exports.sass, exports.js)
exports.watch   = series(pugWatch, sassWatch, jsWatch)
exports.default = series(exports.build, exports.watch, sync)
