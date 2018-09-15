var BeforeSlide = document.querySelector(".slide-before");
var AfterSlide = document.querySelector(".slide-after");
var Checkbox = document.getElementById("before-after");

Checkbox.addEventListener("click", function(evt) {
  BeforeSlide.classList.toggle("slide--active");
  AfterSlide.classList.toggle("slide--active");
});
