var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var bsync = require('browser-sync');
var sass = require('gulp-sass');


gulp.task('sass', function () {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix())
    .pipe(gulp.dest('./dist/css'));
});
 

gulp.task('default', ['sass'], function() {
	bsync({
		server: '.'		
	});

	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('dist/css/*.css', bsync.reload);
	gulp.watch('*.html', bsync.reload);
})