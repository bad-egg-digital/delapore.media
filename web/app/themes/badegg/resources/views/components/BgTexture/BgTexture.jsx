import './BgTexture.scss'
import clsx from 'clsx'
import TextureXL from '@images/bg-texture-1920.jpg';
import TextureLG from '@images/bg-texture-1440.jpg';
import TextureMD from '@images/bg-texture-960.jpg';
import TextureSM from '@images/bg-texture-640.jpg';

export default function BgTexture( attributes ) {

  attributes = {
    ...attributes,
    className: clsx(
      'bg-texture',
      attributes.className,
    )
  }

  return (
    <div { ...attributes }>
      <div className="bg-texture-gradient" />
      <img
        loading="lazy"
        src={ TextureSM }
        srcSet={`
          ${ TextureXL } 1920w,
          ${ TextureLG } 1440w,
          ${ TextureMD } 960w,
          ${ TextureSM } 640w
        `}
        alt=""
        role="presentation"
      />
    </div>
  )
}
