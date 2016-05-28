'use strict';

const $             = require('gulp-load-plugins')();
const babelPolyfill = require('babel-polyfill'); // eslint-disable-line no-unused-vars
const browserSync   = require('browser-sync').create();
const gulp          = require('gulp');

gulp.task('handlebars', () => {
    gulp.src('src/templates/*.hbs')
        .pipe($.handlebars())
        .pipe($.wrap('Handlebars.template(<%= contents %>)'))
        .pipe($.declare({
            namespace:   'App.templates',
            noRedeclare: true // Avoid duplicate declarations.
        }))
        .pipe($.concat('templates.js'))
        .pipe(gulp.dest('.tmp/js/'));
});

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('.tmp/js/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('serve', ['js', 'handlebars'], () => {
    browserSync.init({
        notify: false,
        port:   9000,
        server: {
            baseDir: ['.tmp', 'app']
        }
    });

    gulp.watch([
        'app/*.html',
        '.tmp/**/*.*'
    ]).on('change', browserSync.reload);

    gulp.watch('.tmp/js/**/*.js', ['scripts']);
});


gulp.task('default', ['serve']);
