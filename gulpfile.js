"use strict";

var gulp = require("gulp"), //задаем переменные
sass = require("gulp-sass"),
plumber = require("gulp-plumber"),
postcss = require("gulp-postcss"),
jsmin = require("gulp-jsmin"),
autoprefixer = require("gulp-autoprefixer"),
cleanCSS = require("gulp-clean-css"),
imagemin = require("gulp-imagemin"),
imageminSvgo = require('imagemin-svgo'),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
imageminPngquant = require("imagemin-pngquant"),
cwebp = require('gulp-cwebp'),
rimraf = require("rimraf"),
gulpStylelint = require('gulp-stylelint'),
server = require("browser-sync").create(),
devip = require('dev-ip'),
svgstore = require('gulp-svgstore'),
posthtml = require('gulp-posthtml'),
include = require('posthtml-include'),
htmlmin = require('gulp-htmlmin'),
run = require('run-sequence'),
rename = require("gulp-rename");

devip(); // [ "192.168.1.76", "192.168.1.80" ] or false if nothing found (ie, offline user)

gulp.task('lint', function lintCssTask() { // задача - вызывается как скрипт из package.json
  return gulp
  .src("src/blocks/*.{scss,sass}") // источник
  .pipe(gulpStylelint({
    reporters: [
    {formatter: 'string', console: true}
    ]
  }));
});

gulp.task('clean', function (cb) { // задача - вызывается как скрипт из package.json
  rimraf("docs", cb); // удаление папки build (предыдущая сборка)
});

gulp.task("copy", function () { // задача - вызывается как скрипт из package.json
  gulp.src([  // источник
    "src/fonts/**/*.{woff,woff2}"
    ],
    {
      base: "src"
    })
  .pipe(gulp.dest("docs/")); // класть результат сюда
});

gulp.task("sprite1", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/img/sprite1/inline-*.svg") // источник
  .pipe(imagemin([
    imageminSvgo({ // сжатие svg
      plugins: [
      {removeDimensions: true},
      {removeAttrs: true},
      {removeElementsByAttr: true},
      {removeStyleElement: true},
      {removeViewBox: false}
      ]
    })
    ]))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename({
    basename: "sprite1",
    suffix: ".min"
  }))
  .pipe(gulp.dest("docs/img/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task("sprite2", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/img/sprite2/inline-*.svg") // источник
  .pipe(imagemin([
    imageminSvgo({ // сжатие svg
      plugins: [
      {removeDimensions: true},
      {removeAttrs: true},
      {removeElementsByAttr: true},
      {removeStyleElement: true},
      {removeViewBox: false}
      ]
    })
    ]))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename({
    basename: "sprite2",
    suffix: ".min"
  }))
  .pipe(gulp.dest("docs/img/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task("style", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/blocks/*.{scss,sass}") // источник
  .pipe(plumber()) // отслеживание ошибок - вывод в консоль, не дает прервать процесс
  .pipe(sass().on('error', sass.logError)) // компиляция из препроцессорного кода sass --> css кода
  .pipe(autoprefixer()) // расставление автопрефиксов
  .pipe(gulp.dest("docs/css/")) // класть результат сюда
  .pipe(cleanCSS()) // минификация
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest("docs/css/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task('js', function () { //задача - вызывается как скрипт из package.json
  gulp.src("src/js/**/*.js") // источник
  .pipe(posthtml([ // сборка из разных файлов
    include()
    ]))
  .pipe(gulp.dest("docs/js/")) // класть результат сюда
  .pipe(jsmin()) // минификация
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest("docs/js/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task("image", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/img/*.{jpg,png,svg}") // источник
  .pipe(imagemin([
    imageminPngquant({ // сжатие png
      quality: '80'
    }),
    imageminJpegRecompress({ // сжатие jpeg
      progressive: true,
      method: 'ms-ssim'
    }),
    imageminSvgo({ // сжатие svg
      plugins: [
      {removeDimensions: true},
      {removeAttrs: true},
      {removeElementsByAttr: true},
      {removeStyleElement: true},
      {removeViewBox: false}
      ]
    })
    ]))
  .pipe(gulp.dest("docs/img/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task("cwebp", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/img/*.*") // источник
  .pipe(cwebp())
  .pipe(gulp.dest("docs/img/")); // класть результат сюда
});

gulp.task("html", function () { // задача - вызывается как скрипт из package.json
  gulp.src("src/blocks/*.html") // источник
  .pipe(posthtml([ // сборка из разных файлов
    include()
    ]))
  .pipe(htmlmin({ collapseWhitespace: true })) // минификация
  .pipe(gulp.dest("docs/")) // класть результат сюда
  .pipe(server.stream()) // обновление браузера
});

gulp.task("watch", function () { // задача - вызывается как скрипт из package.json
  gulp.watch(["src/blocks/**/*.{scss,sass}"], function(event, cb) { // отслеживание изменений файлов scss
    gulp.start("style") // в случае изменений - запуск задачи
  });
  gulp.watch(["src/img/*.{jpg,png,svg}"], function(event, cb) { // отслеживание изменений файлов image
    gulp.start("image") // в случае изменений - запуск задачи
  });
  gulp.watch(["src/js/**/*.js"], function(event, cb) { // отслеживание изменений файлов js
    gulp.start("js") // в случае изменений - запуск задачи
  });
  gulp.watch(["src/blocks/**/*.html"], function(event, cb) { // отслеживание изменений файлов html
    gulp.start("html") // в случае изменений - запуск задачи
  });
  gulp.watch(["src/img/sprite/inline-*.svg"], function(event, cb) { // отслеживание изменений файлов html
    gulp.start("sprite"), // в случае изменений - запуск задачи
    gulp.start("html") // в случае изменений - запуск задачи
  });
});

gulp.task ("serve", function() { //задача - вызывается как скрипт из package.json
  server.init({ // перед запуском start запускается рад задач, затем запускается локальный сервер
    server: "docs", // адрес к папке где лежит сборка
    notify: false,
    open: true,
    cors: true,
    host: "192.168.0.91", // дефолтный ip занят virtualbox, задача devip определила запасной ip
    ui: false
  });
});

gulp.task ("build", function(done) {
  run (
    "clean",
    "copy",
    "image",
    "cwebp",
    "sprite1",
    "sprite2",
    "style",
    "js",
    done
    )
});

gulp.task ("start", function(done) {
  run (
    "html",
    "serve",
    "watch",
    done
    )
});

