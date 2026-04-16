import parse from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'
import { useMemo } from "react"

export default function List({ rawContent, innerBlocks }) {
  const Content = useMemo(() => (rawContent ? parse(rawContent) : null), [rawContent])
  const contentProps = (Content) ? Content.props : {}
  const TagName = (Content) ? Content.type : 'ul'

  if(Array.isArray(innerBlocks) && innerBlocks.length > 0) {
    return (
      <TagName { ...contentProps }>
        { innerBlocks
          .map((block, index) => <Switchboard key={index} index={index} {...block} />
        )}
      </TagName>
    )
  }
}
