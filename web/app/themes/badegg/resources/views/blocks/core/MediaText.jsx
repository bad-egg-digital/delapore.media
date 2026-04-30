import './MediaText.scss'
import parse from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function MediaText( props ) {
  const { rawContent, innerBlocks, attributes } = props;

  const TextCol = () => (
    <>
      { innerBlocks.map((block, index) => <Switchboard key={index} index={index} {...block} /> )}
    </>
  )

  const options = {
    replace: (domNode) => {
      if (
        domNode.type === "tag" &&
        domNode.name === "div" &&
        domNode.attribs?.class?.includes("wp-block-media-text__content")
      ) {
        return (
          <div className={ domNode.attribs.class }>
            <TextCol />
          </div>
        )
      }
    },
  }

  return parse( rawContent, options )
}
