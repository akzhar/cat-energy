"use strict";

var gulp = require("gulp"), //задаем переменные
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rigger = require('gulp-rigger'),
    rimraf = require('rimraf'),
    server = require("browser-sync").create();

var path = {
    build: { //пути куда складывать готовые после сборки файлы
        html: "build/",
        style: "build/css/",
        image: "build/img/"
    },
    source: { //пути откуда брать исходники для сборки
        html: 'src/html/blocks/{index,catalog,form}.html', //синтаксис /{index,catalog,form}.html означает - берем файлы с именем index,catalog,form с расширением .html
        style: 'src/sass/style.scss', //в стилях нам тоже понадобится только main файл
        image: 'src/img/**/*.*' //синтаксис img/**/*.* означает - взять все файлы всех расширений из папки img и из подпапок
    },
    watch: { //указываем, за изменением каких файлов мы хотим наблюдать
        html: 'src/html/blocks/**/*.html',
        style: 'src/sass/blocks/**/*.{scss,sass}',
        image: 'src/img/**/*.*'
    },
    clean: 'build' //адрес папки build
};

gulp.task("style:build", function () { //задача - вызывается как скрипт из package.json
  gulp.src(path.source.style) //источник scss
    .pipe(plumber()) //отсеживание ошибок - вывод в консоль
    .pipe(sass()) //компиляция из препроцессорного кода sass --> css кода
    .pipe(autoprefixer()) //расставления автопрефиксов
    .pipe(cleanCSS()) //минификация получившегося css
    .pipe(gulp.dest(path.build.style)) //класть результат сюда
    .pipe(server.stream()) // перезагрузка сборки в браузере
});

gulp.task("image:build", function () { //задача - вызывается как скрипт из package.json
  gulp.src(path.source.image) //источник картинок
    .pipe(imagemin({ //минификация картинок jpeg, jpg, png, svg
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.build.image)) //класть результат сюда
    .pipe(server.stream()) // перезагрузка сборки в браузере
});

gulp.task("html:build", function () { //задача - вызывается как скрипт из package.json
  gulp.src(path.source.html) //источник html
    .pipe(rigger()) //сборка html из разных файлов
    .pipe(gulp.dest(path.build.html)) //класть результат сюда
    .pipe(server.stream()) // перезагрузка сборки в браузере
});

gulp.task("watch", function () { //задача - вызывается как скрипт из package.json
    gulp.watch([path.watch.style], function(event, cb) { //отслеживание изменений файлов scss
       gulp.start("style:build"); //в случае изменений - запуск сборки scss
    });
    gulp.watch([path.watch.image], function(event, cb) { //отслеживание изменений файлов image
        gulp.start("image:build"); //в случае изменений - запуск сборки image
    });
    gulp.watch([path.watch.html], function(event, cb) { //отслеживание изменений файлов html
        gulp.start("html:build"); //в случае изменений - запуск сборки html
    });
});

gulp.task('clean', function (cb) { //задача - вызывается как скрипт из package.json
    rimraf(path.clean, cb); //удаление папки build (предыдущая сборка)
});

gulp.task ("start",["style:build", "image:build", "html:build", "watch"], function() { //задача - вызывается как скрипт из package.json
    server.init({ //вызывается задача build и затем готовая сборка запускается в браузере
      server:"build", //где лежит собранный файл index.html
      notify: false,
      open: true,
      cors: true,
      ui: false
    });
});

