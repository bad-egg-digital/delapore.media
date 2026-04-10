import { loadOptimalSrc } from './bgSrcset.js';

export default function LazyLoadInit()
{
  document.addEventListener('DOMContentLoaded', LazyLoad());
}

function LazyLoad() {

  const lazyElements = [].slice.call(
    document.querySelectorAll('.lazy')
  );

  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        loadLazyElement(el);
        observer.unobserve(el);
      });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));
  } else {
    // Optional fallback: load everything immediately
    lazyElements.forEach(el => {
      if (el.tagName === 'IMG' && el.dataset.src) {
        el.src = el.dataset.src;
      } else if (el.classList.contains('bg-image' && el.dataset.id)) {
        loadOptimalSrc(el);

        el.classList.remove('lazy');
        el.classList.add('lazy-loaded');
      } else if (el.dataset.bg) {
        el.style.backgroundImage = `url('${el.dataset.bg}')`;

        el.classList.remove('lazy');
        el.classList.add('lazy-loaded');
      }
    });
  }
}

function loadLazyElement(el) {
  if (el.tagName === 'IMG') {
    if (el.dataset.src) el.src = el.dataset.src;
    if (el.dataset.srcset) el.srcset = el.dataset.srcset;

    el.classList.remove('lazy');
    el.classList.remove('lazy-loaded');

  } else if (el.dataset.svg) {
    fetch(el.dataset.svg)
      .then( (response) => response.text())
      .then( (data) => {
        el.innerHTML = data;
        el.classList.remove('lazy');
        el.classList.add('lazy-loaded');
      });

  } else if (el.classList.contains('bg-image') && el.dataset.id) {
    loadOptimalSrc(el);

    el.classList.remove('lazy');
    el.classList.add('lazy-loaded');

  } else if (el.dataset.bg) {
    el.style.backgroundImage = `url('${el.dataset.bg}')`;

    el.classList.remove('lazy');
    el.classList.add('lazy-loaded');
  }
}
