
export default function generateTOC(toc, content, heading = 'In this article:')
{
  if(!toc || !content) return;

  const hTwos = content.querySelectorAll('h2');

  if(hTwos.length < 1) return;

  let tocHTML = '';

  tocHTML = `
    <div class="generated-toc">
      <h3 class="section-title">${heading}</h3>`;

  tocHTML += `
        <ul class="nolist">`;

  for(let index = 0; index < hTwos.length; index++) {
    let hTwo = hTwos[index];
    let hTwoContent = hTwo.textContent;
    let hTwoSlug = hTwoContent.replace(/\W/g, '-').toLowerCase();

    hTwo.id = hTwoSlug;

    hTwo.insertAdjacentHTML('beforebegin', `
      <a class="toc-anchor" id="${ hTwoSlug }"></a>
    `);

    tocHTML += `
          <li><a href="#${ hTwoSlug }">${ hTwoContent }</a></li>`;
  }

  tocHTML += `
      </ul>
    </div>`;

  toc.insertAdjacentHTML('afterbegin', tocHTML);

  setActive(hTwos);

}

function setActive(hTwos = [])
{
  if(hTwos.length < 1) return;

  const menuFixed = document.querySelector('.menu-fixed');
  const offset = (menuFixed) ? menuFixed.offsetHeight : 0;
  const windowHeight = window.innerHeight;

  hTwos.forEach((h2) => {
    const slug = h2.id;
    const link = document.querySelector(`a[href="#${slug}"`);

    window.addEventListener('scroll', (e) => {
      const h2Top = h2.getBoundingClientRect().top;

      if(h2Top > offset && h2Top < windowHeight - offset * 0.75) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

  });
}
