import parse from "html-react-parser"
import clsx from 'clsx'
import parseHtml from "@scripts/lib/parser"

export default function Heading({ content, rawContent, attributes }) {

  const { level, textAlign } = attributes

  const Content = parse(rawContent)
  let contentProps = Content.props

  contentProps = {
    ...contentProps,
      className: clsx(
      contentProps.className,
      textAlign && `align-${ textAlign }`,
    )
  }

  const H = `h${ level || 2 }`

  return (
    <H { ...contentProps }>{ parseHtml(content) }</H>
  )
}
