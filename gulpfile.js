var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    del = require('del'),
    browserify = require('browserify'),
    aliasify = require('aliasify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    config;
// TODO: Use gulp-plugins?

config = {
    'js': {
        'main': ['./src/js/app.js'],
        'src': ['./src/**/*.js'],
        'dest': 'build/js',
    },
    'html': {
        'src': ['./src/**/*.html'],
        'dest': 'build'
    },
    'css': {
        'src': ['./src/css/**/*.css'],
        'dest': 'build/css'
    },
    'img': {
        'src': ['src/img/**/*'],
        'dest': 'build/img'
    }
};

gulp.task('js', ['clean'], function () {
    return browserify(config.js.main, {debug: true})
        .transform({global: true}, aliasify)
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true, debug: true}))
            .pipe(streamify(uglify()))
        .pipe(sourcemaps.write('../source'))
        .pipe(gulp.dest(config.js.dest));
});

// TODO: What was the name of the gulp-plugin to create generic tasks?
gulp.task('html', ['clean'], function () {
    return gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.dest))
});

gulp.task('css', ['clean'], function () {
    return gulp.src(config.css.src)
        .pipe(gulp.dest(config.css.dest))
});

gulp.task('img', ['clean'], function () {
    return gulp.src(config.img.src)
        .pipe(gulp.dest(config.img.dest))
});

gulp.task('clean', function (next) {
    del(['build'], next);
});

gulp.task('build', ['html', 'js', 'css', 'img']);

gulp.task('server', function (next) {
    connect.server({
        root: 'build',
        livereload: true
    });

    return next;
});

// TODO: Incremental builds
// OR only run clean on certain parts? Maybe only run clean on build?
gulp.task('watch', function () {
    gulp.watch(config.html.src, ['build']);
    gulp.watch(config.js.src, ['build']);
    gulp.watch(config.css.src, ['build']);
    gulp.watch(config.img.src, ['build']);
});

gulp.task('prod', ['build', 'server']);

gulp.task('default', ['build', 'watch', 'server']);
