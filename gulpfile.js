// "use strict";

const gulp = require('gulp');
// import gulp from 'gulp';
const concat = require('gulp-concat');

const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const browserSync = require('browser-sync').create(); 
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const svg = require('gulp-svg-sprite');
/*//Порядок подключения css файлов
const cssFiles = [
	'./src/css/main.css',
	'./src/css/media.css',
] */

//Порядок подключения SCSS файлов
const styleFiles = [
	'./src/css/main.scss',
	'./src/css/media.scss',
]

//Порядок подключения js файлов
const jsFiles = [
	'./src/js/lib.js',
	'./src/js/main.js',
]

//Таск на стили
function styles() {
	return gulp.src(styleFiles)
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(concat('style.css'))
	//Добавить префиксы
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
	//Минификация CSS
	.pipe(cleanCSS({
		level: 2
	}))
	.pipe(sourcemaps.write('./'))
	//Выходная папка для стилей
	.pipe(gulp.dest('./build/css'))
	.pipe(browserSync.stream());
};




// task for Js
function scripts() {
	return gulp.src(jsFiles)

	.pipe(concat('script.js'))
	//Минификация Js
	// .pipe(uglify()) classic
	.pipe(uglify(/* options */))
  	.pipe(gulp.dest('./build/js'))
  	.pipe(browserSync.stream());
};

// gulp.task('img-minification', () => {
// 	return gulp.src('./src/img/**')
// 	.pipe(imagemin({
// 		progressive: true
// 	}))
// 	.pipe(gulp.dest('./build/img/'))	
// });


//svg sprite

//  function sprite () {
//     return gulp.src('./src/img/*.svg') // svg files for sprite
//         .pipe(svgSprite({
//                 mode: {
//                     stack: {
//                         sprite: "../sprite.svg"  //sprite file name
//                     }
//                 },
//             }
//         ))
//         .pipe(gulp.dest('./build/img'));
// };


gulp.task('svg', function () {
    return gulp.src('./src/img/*.svg') // svg files for sprite
        .pipe(svg({
                mode: {
                    stack: {
                        sprite: '../sprite.svg'  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest('./build/img'));
});


function img() {
	return gulp.src('./src/img/**')
	.pipe(imagemin({
		progressive: true
	}))
	.pipe(gulp.dest('./build/img/'))
}
//Task to watch 
function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //watch SCSS
gulp.watch('./src/css/**/*.scss', styles);  
	//watch JS
gulp.watch('./src/js/**/*.js', scripts);    
	//wathc HTML
gulp.watch('./*.html').on('change', browserSync.reload);
//watch IMG
gulp.watch('./src/img/**', gulp.series('img'));
};

//Task for clean
function clean () {
	return del(['build/*'])
};

gulp.task('sprite', svg);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('img', imagemin);
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, img)));
gulp.task('dev', gulp.series('build', 'watch'));
