import './Details.scss'
import parse from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function Details({ index, name, content, rawContent, innerBlocks, attributes }) {
  const Content = parse(rawContent)
  let contentProps = Content.props

  return (
    <details { ...contentProps  }>
      { content && parse(content) }
      { innerBlocks.map((block, index) => <Switchboard key={index} index={index} {...block} /> )}
    </details>
  )
}
