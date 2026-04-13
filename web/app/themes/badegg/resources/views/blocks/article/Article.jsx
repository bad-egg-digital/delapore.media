import './style.scss'
import BlockSwitchboard from '@blocks/Switchboard'

export default function Article({ name, attributes, innerBlocks }) {

  return (
    <>
      <h2>{ name }</h2>

      { innerBlocks
        ? innerBlocks.map((block, index) => <BlockSwitchboard  key={ index } name={ name } { ...block } />)
        : null
      }

    </>
  )
}
