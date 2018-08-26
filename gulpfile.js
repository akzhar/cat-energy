"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");
var server = require("browser-sync").create();
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var rigger = require('gulp-rigger');

gulp.task("build", function () { //задача - вызывается как скрипт из package.json
  gulp.src("sass/style.scss") //источник scss
    .pipe(plumber()) //отсеживание ошибок - вывод в консоль
    .pipe(sass()) //компиляция из препроцессорного кода sass --> css кода
    .pipe(autoprefixer()) //расставления автопрефиксов
    .pipe(cleanCSS()) //минификация получившегося css
    .pipe(gulp.dest("build/css")) //класть результат сюда

  gulp.src("img/*") //источник картинок
    .pipe(plumber()) //отсеживание ошибок - вывод в консоль
    .pipe(imagemin()) //минификация картинок jpeg, jpg
    .pipe(gulp.dest("build/img")) //класть результат сюда

  gulp.src("html/{index,catalog,form}.html") //источник html
    .pipe(plumber()) //отсеживание ошибок - вывод в консоль
    .pipe(rigger()) //сборка html из разных файлов
    .pipe(gulp.dest("build/")); //класть результат сюда

    .pipe(server.stream()); // перезагрузка сборки в браузере
});

gulp.task ("start", ["build"], function() { //задача - вызывается как скрипт из package.json
    server.init({ //вызывается задача build и затем готовая сборка запускается в браузере
      server:"build", //где лежит собранный файл index.html
      notify: false,
      open: true,
      cors: true,
      ui: false
    });

gulp.watch("sass/*.{scss,sass}",["build"]); //отслеживание изменений стилевых файлов - пересборка
gulp.watch("*.html").on("change",server.reload); //при изменении html автоматическая перезагрузка окна браузера
});
