var menubutton = document.querySelector(".menu-button");
var menu = document.querySelector(".menu-list");

menu.classList.remove("menu-list--nojs");

menubutton.addEventListener("click", function(evt) {
  evt.preventDefault();
  menu.classList.toggle("menu-list--open");
  menubutton.classList.toggle("menu-button--menu-open");
});


var BeforeSlide = document.querySelector(".slide-before");
var AfterSlide = document.querySelector(".slide-after");
var Checkbox = document.getElementById("before-after");
var BeforeSlideBtn = document.querySelector(".beforeslidebtn");
var AfterSlideBtn = document.querySelector(".afterslidebtn");

Checkbox.addEventListener("click", function(evt) {
  BeforeSlide.classList.toggle("slide--active");
  AfterSlide.classList.toggle("slide--active");
});

BeforeSlideBtn.addEventListener("click", function(evt) {
  AfterSlide.classList.remove("slide--active");
  BeforeSlide.classList.add("slide--active");
  Checkbox.checked=false;
});

AfterSlideBtn.addEventListener("click", function(evt) {
  BeforeSlide.classList.remove("slide--active");
  AfterSlide.classList.add("slide--active");
  Checkbox.checked=true;
});

