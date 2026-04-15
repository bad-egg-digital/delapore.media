import './style.scss'
import BlockList from '@views/components/BlockList/BlockList'

export default function Article({ name, attributes, innerBlocks }) {

  return (
    <section className="block-badegg-article">
      <div className="container">
        <h2>{ name }</h2>

        <BlockList blocks={ innerBlocks } />
      </div>
    </section>
  )
}
