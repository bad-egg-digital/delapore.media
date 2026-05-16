import './ArticleTOC.scss'

export default function ArticleTOC({ label, headings, stickyTop }) {

  return (
    <div className="article-toc" style={{ top: stickyTop || 0 }}>
      <div className="border border-thin rounded bg-black inner inner-small">
        <h3 className="section-title">{ label || 'In this article' }</h3>
        <ul className="nolist">
          { headings && headings.length > 0 &&
            <>
              { headings.map((heading, index) => {
                let content = ''

                if( 'content' in heading ) {
                  content = heading.content
                } else if ( 'originalContent' in heading ) {
                  content = heading.attributes.content.text
                }

                if(!content) return

                let cleanContent = content.replace(/<[^>]*>/g, '')
                let slug = cleanContent.replace(/\W/g, '-').toLowerCase()

                return (
                  <li key={ index }>
                    <a
                      data-slug={ slug }
                      href={ `#${ slug }` }
                    >
                      { cleanContent }
                    </a>
                  </li>
                )

              })}
            </>
          }
        </ul>
      </div>
    </div>
  )
}
