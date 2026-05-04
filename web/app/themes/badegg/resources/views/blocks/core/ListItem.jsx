import parse from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function ListItem({ index, content, innerBlocks }) {

  return (
    <li className={ `wp-block-list-item-${ index }` }>
      { parse(content) }

      { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
        innerBlocks.map((block, index) => (
          <Switchboard key={ index } index={ index } {...block} />
        )
      )}
    </li>
  )
}
