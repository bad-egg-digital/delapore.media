import './ArticleTOC.scss'

export default function ArticleTOC({ label, headings, stickyTop }) {

  return (
    <div className="article-toc" style={{ top: stickyTop || 0 }}>
      <div className="border border-thin rounded bg-black inner inner-small">
        <h3 className="section-title">{ label || 'In this article' }</h3>
        <ul className="nolist">
          { headings.map((heading, index) => {
            let content = heading.content.replace(/<[^>]*>/g, '')
            let slug = content.replace(/\W/g, '-').toLowerCase()

            return (
              <li key={ index }>
                <a
                  data-slug={ slug }
                  href={ `#${ slug }` }
                >
                  { content }
                </a>
              </li>
            )

          })}
        </ul>
      </div>
    </div>
  )
}
