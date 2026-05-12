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

  // level is undefined if heading is set to 2
  if( !('level' in attributes ) ) {
    let strippedContent = content.replace(/<[^>]*>/g, '')
    let slug = strippedContent.replace(/\W/g, '-').toLowerCase()

    contentProps = {
      ...contentProps,
      id: slug,
    }
  }

  const H = `h${ level || 2 }`

  return (
    <H { ...contentProps }>{ parseHtml(content) }</H>
  )
}
