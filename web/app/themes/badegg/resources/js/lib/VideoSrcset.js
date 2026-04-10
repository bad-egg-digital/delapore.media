export default function VideoSrcset( element )
{
  const sizes = JSON.parse(element.dataset.sizes);

  Object.keys(sizes).forEach((key) => {
    const size = key;
    const source = element.querySelector('.bgvid-' + size);

    if(source) {
      const sourceWidth = source.dataset.width;
      const poster = source.dataset.poster;

      if(window.innerWidth >= sourceWidth) {
        console.log('screen width is greater than or equal to the source width');
        console.log('screen width: ' + window.innerWidth);
        console.log('source width: ' + sourceWidth);

        element.src = source.src;
        element.poster = poster;
        element.load;
      }
    }
  });
}
