import parse from "html-react-parser"
import parseHtml from "@scripts/lib/parser"

export default function Fallback( props ) {
  const {
    content,
    rawContent,
    innerBlocks,
  } = props

  const Content = (rawContent) ? parse(rawContent.trim()) : null

  if(Content) {
    return <>{ parseHtml(rawContent) }</>
  }
}
