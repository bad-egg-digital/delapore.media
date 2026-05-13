import './Gallery.scss'
import parse from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function Gallery({ rawContent, innerBlocks, attributes }) {
  if(!innerBlocks) return

  const GalleryItems = () => (
    <>
      { innerBlocks.map((block, index) => <Switchboard key={index} index={index} {...block} /> )}
    </>
  )

  const options = {
    replace: (domNode) => {
      if (
        domNode.type === "tag" &&
        domNode.name === "figure" &&
        domNode.attribs?.class?.includes("wp-block-gallery")
      ) {
        return (
          <figure className={ domNode.attribs.class }>
            <GalleryItems />
          </figure>
        )
      }
    },
  }

  return parse( rawContent, options )
}
