import parse from "html-react-parser"
import parseHtml from "@scripts/lib/parser"
import DropCap from "@blocks/core/DropCap"

export default function Paragraph( props ) {
  const { content,rawContent, attributes } = props
  const Content = parse(rawContent)
  const contentProps = Content.props

  if(attributes?.dropCap) {
    return  <DropCap { ...props } />
  } else {
    return  <p { ...contentProps }>{ parseHtml(content) }</p>
  }
}
