import parse from "html-react-parser"
import parseHtml from "@scripts/lib/parser"

export default function Paragraph({ content,rawContent, attributes }) {

  const Content = parse(rawContent)
  const contentProps = Content.props

	return (
    <p { ...contentProps }>{ parseHtml(content) }</p>
	)
}
