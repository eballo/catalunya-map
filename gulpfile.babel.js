import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json';
import concat from 'gulp-concat';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;

const paths = {
  scripts:{
      src: [ 'src/js/bootstrap.js','src/js/catalunya-map-path.json', 'src/js/jquery-3.2.1.js', 'src/js/raphael.min.js', 'src/js/scale.raphael.js'],
      dest: 'assets/js'
  },
  mapScripts:{
      src: [ 'src/js/catalunya-map.js', 'src/js/catalunya-map-options-v2.js', 'src/js/catalunya-map-init.js'],
      dest: 'assets/js'
  },
  package: {
    src: ['**/*','!.gitignore', '!node_modules{,/**}','!src{,/**}',
    '!package{,/**}', '!.babelrc', '!gulpfile.babel.js', '!package.json',
    '!package-lock.json', '!.DS_Store'],
    dest: 'package'
  }
}

const BROWSERSYNC = {
  url : 'https://map.catalunyamedieval.dev',
  certkey : '/Applications/MAMP/htdocs/keys/map/map.catalunyamedieval.dev.key',
  cert: '/Applications/MAMP/htdocs/keys/map/map.catalunyamedieval.dev.crt'
}

export const mapScripts = () => {
  return gulp.src(paths.mapScripts.src)
             .pipe(concat('catalunya-map.min.js'))
             .pipe(gulpif(PRODUCTION, uglify()))
             .pipe(gulp.dest(paths.scripts.dest));
}

export const scripts = () => {
  return gulp.src(paths.scripts.src)
             .pipe(gulpif(PRODUCTION, uglify()))
             .pipe(gulp.dest(paths.scripts.dest));
}

export const clean = () => {
  return del(['assets/js']);
}

export const startServer = (done) => {
  server.init({
    proxy: BROWSERSYNC.url,
    https: {
      key: BROWSERSYNC.certkey,
      cert: BROWSERSYNC.cert
    }
  });
  done();
}

export const reload = (done) => {
  server.reload();
  done();
}

export const watch = () => {
  gulp.watch('src/js/**/*.js', gulp.series(scripts, reload));
  gulp.watch("**/*.php", reload);
  gulp.watch("**/*.html", reload);
}

export const compress = () => {
  return gulp.src(paths.package.src)
             .pipe(zip(`${info.name}.zip`))
             .pipe(gulp.dest(paths.package.dest));
}

export const build  = gulp.series(clean, gulp.parallel(mapScripts,scripts));
export const dev    = gulp.series(clean, gulp.parallel(mapScripts,scripts), startServer, watch);
export const bundle = gulp.series(build, compress);

export default dev;
