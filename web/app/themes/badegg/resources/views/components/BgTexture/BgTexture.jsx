import './BgTexture.scss'
import clsx from 'clsx'
import Texture from '@images/bg-texture.jpg';

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
      <img loading="lazy" src={ Texture } alt="" role="presentation" />
    </div>
  )
}
