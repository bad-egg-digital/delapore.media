// Core Wordpress blocks
import Separator from '@blocks/core/Separator';
import Spacer from '@blocks/core/Spacer';
import Gallery from '@blocks/core/Gallery';
import Image from '@blocks/core/Image';
import MediaText from '@blocks/core/MediaText';
import Audio from '@blocks/core/Audio';
import Video from '@blocks/core/Video';
import Embed from '@blocks/core/Embed';
import Footnotes from '@blocks/core/Footnotes';
import Heading from '@blocks/core/Heading';
import List from '@blocks/core/List';
import Details from '@blocks/core/Details';
import ListItem from '@blocks/core/ListItem';
import Missing from '@blocks/core/Missing'
import Paragraph from '@blocks/core/Paragraph';
import Quote from '@blocks/core/Quote';
import PullQuote from '@blocks/core/PullQuote';
import Verse from '@blocks/core/Verse';
import FeaturedImage from '@blocks/core/FeaturedImage';

// Theme-specific blocks
import Example from '@blocks/example/Example';
import Article from '@blocks/article/Article';

export default function Switchboard( props ) {
  const { index, name, content, attributes, innerBlocks } = props;

  switch (name) {

    // Theme-specific blocks
    case "badegg/article":
      return <Article key={index} name={ name } { ...attributes } innerBlocks={ innerBlocks } />

    case "badegg/example":
      return <Example key={index} name={ name }  { ...attributes } innerBlocks={ innerBlocks } />


    // Core Wordpress blocks
    case 'core/separator':
      return <Separator key={index} name={ name } { ...attributes } />

    case 'core/spacer':
      return <Spacer key={index} name={ name } { ...attributes } />

    case 'core/image':
      return <Image key={index} name={ name } { ...attributes } />

    case 'core/audio':
      return <Audio key={index} name={ name } { ...attributes } />

    case 'core/video':
      return <Video key={index} name={ name } { ...attributes } />

    case 'core/embed':
      return <Embed key={index} name={ name } { ...attributes } />

    case 'core/footnotes':
      return <Footnotes key={index} name={ name } { ...attributes } />

    case "core/heading":
      return <Heading key={index} name={ name } {...attributes} />;

    case "core/paragraph":
      return <Paragraph key={index} content={ content } {...attributes} />;

    case 'core/verse':
      return <Verse key={index} name={ name } { ...attributes } />

    case 'core/post-featured-image':
      return <FeaturedImage key={index} name={ name } { ...attributes } />

    // Core Wordpress Blocks supporting innerBlocks
    case 'core/list':
      return <List key={index} name={ name } { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/list-item':
      return <ListItem key={index} name={ name } { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/gallery':
      return <Gallery key={index} name={ name }  { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/media-text':
      return <MediaText key={index} name={ name }  { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/details':
      return <Details key={index} name={ name }  { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/quote':
      return <Quote key={index} name={ name }  { ...attributes } innerBlocks={ innerBlocks } />

    case 'core/pullquote':
      return <PullQuote key={index} name={ name } { ...attributes } innerBlocks={ innerBlocks } />

    default:
      return <Missing key={index} name={ name } { ...attributes } />
  }
}
