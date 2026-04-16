import parse from "html-react-parser"

export default function Fallback( props ) {
  const {
    content,
    rawContent,
    innerBlocks,
  } = props


  const Content = parse(rawContent)
  let contentProps = Content.props

  const Tag = Content.type

  const Wrapper = ( wrapperProps ) => {
    if(innerBlocks) {
      <Tag { ...contentProps }>
        { parseHtml(content) }
        { wrapperProps.children }
      </Tag>
    } else {
      <>{ wrapperProps.children }</>
    }
  }

  return <>{ parse(rawContent.trim()) }</>
}
