import gulp from 'gulp';
import yargs from 'yargs';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import del from 'del';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import replace from 'gulp-replace';
import info from './package.json';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import log from 'gulplog';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;
const URL_PROD = "/wp-content/themes/catalunyamedieval/assets/js/catalunya-map/catalunya-map-path.json";
const URL_DEFAULT = "/assets/js/catalunya-map-path.json";

const paths = {
  scripts:{
      src: [ 'src/js/bootstrap.min.js','src/js/catalunya-map-path.json', 'src/js/jquery-3.2.1.min.js', 'src/js/raphael.min.js', 'src/js/scale.raphael.min.js'],
      dest: 'assets/js'
  },
  mapScripts:{
      src: [ 'src/js/catalunya-map.js', 'src/js/catalunya-map-options-v2.js','src/js/catalunya-map-init.js'],
      dest: 'assets/js'
  },
  package: {
    src: ['**/*','!.gitignore', '!node_modules{,/**}','!src{,/**}',
    '!package{,/**}', '!.babelrc', '!gulpfile.babel.js', '!package.json',
    '!package-lock.json', '!.DS_Store'],
    dest: 'package'
  },
  styles:{
    src: [ 'src/css/catalunya-map-v3.css'],
    dest: 'assets/css'
  },
  otherStyles:{
    src: [ 'src/css/bootstrap-theme.min.css', 'src/css/bootstrap.min.css', 'src/css/main.css'],
    dest: 'assets/css'
  }
}

const BROWSERSYNC = {
  url : 'https://map.catalunyamedieval.dev',
  certkey : '/Applications/MAMP/htdocs/keys/map/map.catalunyamedieval.dev.key',
  cert: '/Applications/MAMP/htdocs/keys/map/map.catalunyamedieval.dev.crt'
}

export const mapScripts = () => {
  return gulp.src(paths.mapScripts.src)
             .pipe(concat('catalunya-map.js'))
             .pipe(gulpif(PRODUCTION, replace("##REPLACE_URL_JSON", URL_PROD)))
             .pipe(gulpif(!PRODUCTION, replace("##REPLACE_URL_JSON", URL_DEFAULT)))
             .pipe(rename('catalunya-map.min.js'))
             .pipe(uglify())
             .pipe(gulp.dest(paths.mapScripts.dest));
}

export const scripts = () => {
  return gulp.src(paths.scripts.src)
             .pipe(gulp.dest(paths.scripts.dest));
}

export const css = () => {
  return gulp.src(paths.styles.src)
             .pipe(rename('catalunya-map.min.css'))
             .pipe(cleanCSS())
             .pipe(gulp.dest(paths.styles.dest));
}

export const otherCSS = () => {
  return gulp.src(paths.otherStyles.src)
             .pipe(gulp.dest(paths.otherStyles.dest));
}

export const clean = () => {
  return del(['assets/js','assets/css']);
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
  gulp.watch('src/css/**/*.css', gulp.series(css, reload));
  gulp.watch("**/*.php", reload);
  gulp.watch("**/*.html", reload);
}

export const compress = () => {
  return gulp.src(paths.package.src)
             .pipe(zip(`${info.name}.zip`))
             .pipe(gulp.dest(paths.package.dest));
}

export const build  = gulp.series(clean, gulp.parallel(mapScripts, scripts, css, otherCSS));
export const dev    = gulp.series(clean, gulp.parallel(mapScripts, scripts, css, otherCSS), startServer, watch);
export const bundle = gulp.series(build, compress);

export default dev;
