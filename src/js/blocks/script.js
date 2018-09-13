//= variable.js

for (var btnOpen2 of btnOpen2_list) {
  btnOpen2.addEventListener("click", function(evt) {
  // evt.preventDefault();
  notify.classList.toggle("modal-show");
});
}

btnClose2.addEventListener("click", function(evt) {
  evt.preventDefault();
  notify.classList.remove("modal-show");
});

btnClose3.addEventListener("click", function(evt) {
  evt.preventDefault();
  notify.classList.remove("modal-show");
});

window.addEventListener("keydown", function(evt) {
  if (evt.keyCode === 27) {
    if (notify.classList.contains("modal-show")) {
      evt.preventDefault();
      notify.classList.remove("modal-show");
    }
  }
});

var btnOpen1 = document.querySelector(".modal-open");
var form = document.querySelector(".write-us");
var datefield1 = form.querySelector("[name=name]");
var datefield2 = form.querySelector("[name=mail]");
var datefield3 = form.querySelector("[name=letter]");
var btnClose1 = form.querySelector(".modal-close");
var btnSubmit = form.querySelector(".red-btn");

btnOpen1.addEventListener("click", function(evt) {
  evt.preventDefault();
  form.classList.toggle("modal-show");
  datefield1.focus();
});

btnSubmit.onclick = function(evt) {
  form.classList.remove("modal-error");
  datefield1.classList.remove("invalid");
  datefield2.classList.remove("invalid");
  datefield3.classList.remove("invalid");
  form.offsetWidth = form.offsetWidth;
  if (!datefield1.value || !datefield2.value || !datefield3.value) {
    evt.preventDefault();
    form.classList.add("modal-error");
    if (!datefield1.value) {
      datefield1.classList.add("invalid");
    }
    if (!datefield2.value) {
     datefield2.classList.add("invalid");
   }
   if (!datefield3.value) {
     datefield3.classList.add("invalid");
   }
 }
};

window.addEventListener("keydown", function(evt) {
  if (evt.keyCode === 27) {
    if (form.classList.contains("modal-show")) {
      evt.preventDefault();
      form.classList.remove("modal-show");
      form.classList.remove("modal-error");
      datefield1.classList.remove("invalid");
      datefield2.classList.remove("invalid");
      datefield3.classList.remove("invalid");
    }
  }
});

btnClose1.addEventListener("click", function(evt) {
  evt.preventDefault();
  form.classList.remove("modal-show");
  form.classList.remove("modal-error");
  datefield1.classList.remove("invalid");
  datefield2.classList.remove("invalid");
  datefield3.classList.remove("invalid");
});
