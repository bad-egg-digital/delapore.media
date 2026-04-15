// Core blocks
import Separator      from '@blocks/core/Separator'
import Spacer         from '@blocks/core/Spacer'
import Gallery        from '@blocks/core/Gallery'
import Image          from '@blocks/core/Image'
import MediaText      from '@blocks/core/MediaText'
import Audio          from '@blocks/core/Audio'
import Video          from '@blocks/core/Video'
import Embed          from '@blocks/core/Embed'
import Footnotes      from '@blocks/core/Footnotes'
import Heading        from '@blocks/core/Heading'
import List           from '@blocks/core/List'
import Details        from '@blocks/core/Details'
import ListItem       from '@blocks/core/ListItem'
import Missing        from '@blocks/core/Missing'
import Paragraph      from '@blocks/core/Paragraph'
import Quote          from '@blocks/core/Quote'
import PullQuote      from '@blocks/core/PullQuote'
import Verse          from '@blocks/core/Verse'
import FeaturedImage  from '@blocks/core/FeaturedImage'

// Theme-specific blocks
import Example        from '@blocks/example/Example'
import Article        from '@blocks/article/Article'

export default function Switchboard( props ) {
  const { name } = props;

  switch (name) {

    // Theme blocks
    case "badegg/article":            return <Article       { ...props } />
    case "badegg/example":            return <Example       { ...props } />

    // Core blocks
    case 'core/separator':            return <Separator     { ...props } />
    case 'core/spacer':               return <Spacer        { ...props } />
    case 'core/image':                return <Image         { ...props } />
    case 'core/audio':                return <Audio         { ...props } />
    case 'core/video':                return <Video         { ...props } />
    case 'core/embed':                return <Embed         { ...props } />
    case 'core/footnotes':            return <Footnotes     { ...props } />
    case "core/heading":              return <Heading       { ...props } />
    case "core/paragraph":            return <Paragraph     { ...props } />
    case 'core/verse':                return <Verse         { ...props } />
    case 'core/post-featured-image':  return <FeaturedImage { ...props } />

    // Core blocks with innerBlocks
    case 'core/list':                 return <List          { ...props } />
    case 'core/list-item':            return <ListItem      { ...props } />
    case 'core/gallery':              return <Gallery       { ...props } />
    case 'core/media-text':           return <MediaText     { ...props } />
    case 'core/details':              return <Details       { ...props } />
    case 'core/quote':                return <Quote         { ...props } />
    case 'core/pullquote':            return <PullQuote     { ...props } />

    // Fallback
    default:                          return <Missing       { ...props } />

  }
}
