

const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");
const links = document.querySelectorAll(".nav__link");

toggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});

links.forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    link.classList.add("active");
    menu.classList.remove("show");
  });
});
