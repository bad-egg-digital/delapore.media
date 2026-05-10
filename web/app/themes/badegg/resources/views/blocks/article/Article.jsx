import './style.scss'
import Switchboard from '@views/components/Switchboard/Switchboard'
import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';

export default function Article( props ) {
  const { name, attributes, innerBlocks, post, postType } = props

  // console.log(props)

  let atts = {
    className: sectionClassNames(
      attributes,
      attributes?.className,
      [
        'wp-block-badegg-article',
      ],
    ).join(' ')
  }

  return (
    <section { ...atts } >
      <div className={ containerClassNames(attributes, []).join(' ') }>
        <div className="article-layout">
          <div className="article-main badegg-block-list wysiwyg">
            { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
              innerBlocks.map((block, index) => (
                <Switchboard key={ index } index={ index } post={ post } postType={ postType } {...block} />
              )
            )}
          </div>

          { attributes?.sidebar && (
            <aside className="article-sidebar">
              <h3>Sidebar</h3>
            </aside>
          )}

        </div>
      </div>
    </section>
  )
}
