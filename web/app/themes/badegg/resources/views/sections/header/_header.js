export default function Header() {
  const header = document.querySelector(".menu-fixed");

  toggleScrolledClass(header);

  document.addEventListener("scroll", () => {
    toggleScrolledClass(header);
  });
}

function toggleScrolledClass(el)
{
  if(!el) return;

  const body = document.querySelector("body");
  const scrolled = document.scrollingElement.scrollTop;
  const position = body.offsetTop;

  if (scrolled > position + (el.offsetHeight / 2)) {
    el.classList.add("scrolled");
  } else {
    el.classList.remove("scrolled");
  }
}
