import parse from "html-react-parser"
import List from '@blocks/core/List'

export default function ListItem({ index, content, innerBlocks }) {

  return (
    <li className={ `wp-block-list-item-${ index }` }>
      { parse(content) }

      { innerBlocks && innerBlocks
        .map((block, index) => (
          <List key={ index } index={ index } { ...block } />
        )
      )}
    </li>
  )
}
