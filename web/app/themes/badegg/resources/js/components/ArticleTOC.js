import generateTOC from '../lib/generateTOC';

const menuFixed = document.querySelector('.menu-fixed');

export default function ArticleTOC()
{
  const articles = document.querySelectorAll('.wp-block-badegg-article');
  let resizeTimeout;

  if(articles) {
    articles.forEach( (article) => {
      const toc = article.querySelector('.js-article-toc');
      const content = article.querySelector('.wysiwyg');

      if(!toc || !content) return;

      generateTOC(toc, content, 'In this article');
      toc.style.top = menuFixed.offsetHeight + 32 + 'px';
      tocAnchorOffset();

      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout( () => {
          toc.style.top = menuFixed.offsetHeight + 32 + 'px';
          tocAnchorOffset();
        }, 250);
      });

    });
  }
}

function tocAnchorOffset()
{
  const anchors = document.querySelectorAll('.toc-anchor');

  anchors.forEach( (anchor) => anchor.style.top = `-${menuFixed.offsetHeight}px`);
}
