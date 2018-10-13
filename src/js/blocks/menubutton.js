var menubutton = document.querySelector(".menu-button");
var menu = document.querySelector(".menu-list");

menu.classList.remove("menu-list--nojs");

menubutton.addEventListener("click", function(evt) {
  evt.preventDefault();
  menu.classList.toggle("menu-list--open");
  menubutton.classList.toggle("menu-button--menu-open");
});
