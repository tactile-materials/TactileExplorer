const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

// Minify JavaScript
function scripts() {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}

// Minify CSS
function styles() {
    return gulp.src('src/css/*.css')
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
}

// Copy images
function images() {
    return gulp.src('public/images/*')
        .pipe(gulp.dest('public/images'));
}

// Export tasks
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

// Build task (no watch) - this is what Vercel will use
exports.build = gulp.parallel(scripts, styles, images);

// Default task for local development (includes watch)
if (process.env.NODE_ENV !== 'production') {
    exports.default = gulp.series(
        gulp.parallel(scripts, styles, images),
        function watch() {
            gulp.watch('src/js/*.js', scripts);
            gulp.watch('src/css/*.css', styles);
            gulp.watch('public/images/*', images);
        }
    );
} else {
    exports.default = exports.build;
}