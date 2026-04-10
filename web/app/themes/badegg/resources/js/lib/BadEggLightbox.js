export default function BadEggLightbox()
{
  const lightboxes = document.querySelectorAll(".badegg-lightbox");

  if(!lightboxes) return;

  lightboxes.forEach(lightbox => {
    const fullSize = lightbox.getAttribute('href');
    const thumbnail = lightbox.querySelector("img");

    lightbox.addEventListener("click", (e) => {
      e.preventDefault();
      // console.log(e);

      modal(fullSize, thumbnail);
    });

  });
}

function modal(src = '', img = '')
{
  if(!src || !img) {
    alert('Error: No image defined');
    return;
  }

  const title = img.getAttribute("title") || '';
  const alt = img.getAttribute("alt") || '';

  const body = document.querySelector("body");

  let template = `
    <img id="badegg-lightbox-image" src="${src}" tabindex="0" title="${title}" alt="${alt}" />
    <button id="badegg-lightbox-close" aria-label="close" aria-expanded="true" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <line x2="32" y2="32"/>
        <line x1="32" y2="32"/>
      </svg>
    </button>
    <div id="badegg-lightbox-overlay"></div>
  `;

  let modal = document.createElement("div");

  modal.setAttribute("id", "badegg-lightbox-modal");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = template;

  body.appendChild(modal);

  setTimeout(() => modal.classList.add("open"), 100);

  document.getElementById("badegg-lightbox-image").focus();

  modalDeleteListener();
}

function modalDeleteListener()
{
  const modal = document.getElementById("badegg-lightbox-modal");

  if(!modal) return;

  const modalClose = document.getElementById("badegg-lightbox-close");
  const modalOverlay = document.getElementById("badegg-lightbox-overlay");

  modalClose.addEventListener("click", (e) => {
    modal.remove();
  });

  modalOverlay.addEventListener("click", (e) => {
    modal.remove();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === 'Escape') {
      modal.remove();
    }
  });
}
