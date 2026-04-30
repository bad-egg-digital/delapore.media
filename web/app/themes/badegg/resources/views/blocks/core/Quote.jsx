import './Quote.scss'
import parse, { attributesToProps } from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function Quote( props ) {
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
        domNode.name === "blockquote" &&
        domNode.attribs?.class?.includes("wp-block-quote")
      ) {
        const componentProps = attributesToProps(domNode.attribs)

        return (
          <blockquote { ...componentProps }>
            <Inner />
          </blockquote>
        )
      }
    },
  }

  return parse( rawContent, options )
}
