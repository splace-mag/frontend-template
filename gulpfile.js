var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var bsync = require('browser-sync');

gulp.task('css', function() {
	return gulp.src('src/css/*.css')
		.pipe(prefix())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['css'], function() {
	bsync({
		server: '.'		
	});

	gulp.watch('src/css/*.css', ['css']);
	gulp.watch('dist/css/*.css', bsync.reload);
	gulp.watch('*.html', bsync.reload);
})