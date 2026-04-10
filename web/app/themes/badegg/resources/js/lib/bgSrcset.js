export async function bgSrcset()
{
  let resizeTimeout;

  bgSrcsetInit();

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout( () => {
      bgSrcsetInit();
    }, 250);
  });
}

function bgSrcsetInit()
{
  const elements = document.querySelectorAll('.bg-srcset');

  elements.forEach(el => {
    if(!el.classList.contains('lazy')) {
      loadOptimalSrc(el);
    }
  });
}

export async function loadOptimalSrc(el)
{
  const id = el.dataset.id;

  if(!id) return;

  const name = el.dataset.name;
  const cropSizes = el.dataset.sizes;
  const elementWidth = el.offsetWidth;

  const thisImage = el.style.backgroundImage.slice(4, -1).replace(/"/g, "");
  const biggestWidth = Number(el.dataset.width);

  const multipliers = {
    xs: 0.20833333,
    sm: 0.33333333,
    md: 0.52083333,
    lg: 0.75,
    xl: 1,
  };

  let sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  let sizeCount = sizes.length;

  if(cropSizes < sizeCount) {
    sizes = sizes.slice(sizeCount - cropSizes);
  }

  const srcsets = await get_srcset(id, name, cropSizes).then( srcset => {
    return srcset;
  });

  let newSizeKey = sizes[0];
  let x = 0;

  sizes.forEach( size => {
    const prevKey = (x > 0) ? sizes[x - 1] : null;
    const thisWidth = Math.round(multipliers[size] * biggestWidth);
    const prevWidth = (prevKey) ? Math.round(multipliers[prevKey] * biggestWidth) : 0;

    if(prevWidth <= elementWidth && elementWidth <= thisWidth) {
      newSizeKey = size;
    }

    x++;
  });

  const newSrcset = srcsets[newSizeKey];

  // only swap image url if they do not already match
  if(newSrcset.url !== thisImage) {
    el.style.backgroundImage = `url('${newSrcset.url}')`;
  }

}

export async function get_srcset(id = 0, name = 'hero', sizes = null)
{
  const restURL = window.App.restURL;

  if(!id || !restURL) return;

  let path = `${restURL}badegg/v1/image/${id}/srcset/${name}`;

  if(sizes) path += `?sizes=${sizes}`;

  const response = await fetch(path);

  if(!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

