import './style.scss'
import BlockSwitchboard from '@views/components/Switchboard'

export default function Article({ name, attributes, innerBlocks }) {

  return (
    <section>
      <div className="container">
        <h2>{ name }</h2>

        <div className="core-blocks">
          { innerBlocks
            ? innerBlocks.map((block, index) => <BlockSwitchboard  key={ index } name={ name } { ...block } />)
            : null
          }
        </div>
      </div>
    </section>
  )
}
