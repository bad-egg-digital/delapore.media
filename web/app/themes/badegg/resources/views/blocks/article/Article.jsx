import './style.scss'
import Switchboard from '@views/components/Switchboard/Switchboard'

export default function Article({ name, attributes, innerBlocks }) {

  return (
    <section className="block-badegg-article">
      <div className="container">
        <h2>{ name }</h2>

      { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
        innerBlocks.map((block, index) => (
          <Switchboard key={ index } index={ index } {...block} />
        )
      )}
      </div>
    </section>
  )
}
