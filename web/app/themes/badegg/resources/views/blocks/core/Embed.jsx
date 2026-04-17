import './Embed.scss'
import clsx from 'clsx'
import Youtube from './EmbedYoutube'
import Vimeo from './EmbedVimeo'
import Unsupported from './Unsupported'

export default function Embed({ index, name, attributes }) {
  const className = attributes?.className
  const provider = attributes?.providerNameSlug
  const url = attributes?.url
  const type = attributes?.type

  let attrs = {
    className: clsx(
      'wp-block-embed',
      `wp-block-embed-${ index }`,
      provider && `wp-block-embed-${ provider } is-provider-${ provider }`,
      className && className,
      'wp-embed-aspect-16-9',
      'wp-has-aspect-ratio',
      type && `is-type-${ type }`,
    ),
  }

  const EmbedSelector = ( props ) => {
    switch (provider) {
      case 'youtube' :  return <Youtube     { ...props } />
      // case 'vimeo'   :  return <Vimeo       { ...props } />
      default        :  return <Unsupported { ...props } />
    }
  }

  return (
    <figure { ...attrs }>
      <EmbedSelector index={ index } name={ name } url={ url } />
    </figure>
  )
}
