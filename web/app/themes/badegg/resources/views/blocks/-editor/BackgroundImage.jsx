import { select } from '@wordpress/data';

/**
 * BackgroundImage
 *
 * This component is used to display a background image for a block based on its attributes.
 *
 * @param {object} props
 * @param {string} props.background_url The desired full size url.
 * @param {string} props.background_url_lazy Tiny lazy url.
 * @param {boolean} props.background_lazy Whether or not to lazy load the background image.
 * @param {object} props.background_position x and y coordinates as decimals from 0 to 1.
 * @param {boolean} props.background_fixed Toggle for background-attachment: fixed.
 * @param {number} props.background_opacity The opacity value applied to the image.
 * @returns {*} React JSX
 */
export default function BackgroundImage({
  background_image,
  background_image_width,
  background_image_height,
  background_url,
  background_url_lazy,
  background_lazy,
  background_position = 'center',
  background_fixed = false,
  background_filter = false,
  background_opacity = 70,
  background_contrast = false,
  disableLazyBG = false,
}) {

  if (background_image) {
    let styles = {
      backgroundImage: `url(${background_url})`,
      backgroundPosition: `${ background_position.x * 100}% ${ background_position.y * 100}%`,
      backgroundSize: 'cover',
      backgroundAttachment: background_fixed ? 'fixed' : 'scroll',
      opacity: Number(background_opacity) * 0.01,
    }

    let attributes = {
      className: 'badegg-block-background bg-image bg-srcset',
      style: styles,
      'data-id': background_image,
      'data-name': 'hero',
      'data-width': background_image_width,
      'data-height': background_image_height,
    };

    if(background_filter) {
      let bgFilter = ' bg-filter-';

      if(background_contrast) {
        bgFilter += 'screen';
      } else {
        bgFilter += 'multiply';
      }

      attributes.className += bgFilter;
    }

    if(background_lazy && !disableLazyBG) {
      attributes.style.backgroundImage = `url(${background_url_lazy})`;
      attributes.className += ' lazy';
    }

    return (
      <div { ...attributes } />
    )
  } else {
    return;
  }

}
