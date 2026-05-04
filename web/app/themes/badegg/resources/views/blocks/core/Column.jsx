import parse, { attributesToProps } from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function Column( props ) {
  const { rawContent, innerBlocks, attributes } = props;

  const Inner = () => (
    <>
      { innerBlocks.map((block, index) => <Switchboard key={index} index={index} {...block} /> )}
    </>
  )

  const options = {
    replace: (domNode) => {
      if (
        domNode.type === "tag" &&
        domNode.name === "div" &&
        domNode.attribs?.class?.includes("wp-block-column")
      ) {
        const componentProps = attributesToProps(domNode.attribs)

        return (
          <div { ...componentProps }>
            <Inner />
          </div>
        )
      }
    },
  }

  return parse( rawContent, options )
}
