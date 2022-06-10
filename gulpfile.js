const { src, dest, series, watch, parallel } = require("gulp");

const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const clean = require('gulp-clean');
const connect = require('gulp-connect');
const { server } = require("gulp-connect");
const { reload } = require("gulp-connect");

//scss
const styles = async () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./docs/css'))
    .pipe(reload());
};
//pug
const template = async () => {
  return src('./src/templates/**.pug')
    .pipe(
      pug({
        pretty: true
      })
    ).pipe(dest('./docs'))
    .pipe(reload());
};
//assets
const assets = async () => {
  return src('./src/assets/**/**.**')
    .pipe(dest('./docs/assets'))
    .pipe(reload());
};

//livereload
const livereload = async () => {
  watch("./src/scss/**/*.scss", styles);
  watch("./src/templates/**/*.pug", template);
  watch('./src/assets/**/**.**', assets);
};
//liveserver
const liveserver = async () => {
  return server({
    port: 8000,
    root: 'docs',
    livereload: true
  });
};

//clear
const clear = async () => {
  return src('docs')
    .pipe(clean());
};

const build = parallel(styles, template, assets);

exports.clear = clear;
exports.build = series(build);
exports.default = series(build, liveserver, livereload);