import parse from "html-react-parser"
import ListItem from '@blocks/core/ListItem'

export default function List({ rawContent, innerBlocks }) {
  const Content = (rawContent) ? parse(rawContent) : null
  const contentProps = (Content) ? Content.props : {}
  const TagName = (Content) ? Content.type : 'ul'

  if(innerBlocks) {
    return (
      <TagName { ...contentProps }>
        { innerBlocks
          .map((block, index) => <ListItem index={ index} { ...block } />
        )}
      </TagName>
    )
  }
}
