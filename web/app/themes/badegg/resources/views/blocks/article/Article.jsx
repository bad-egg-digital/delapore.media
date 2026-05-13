import './style.scss'
import { useEffect, useState, useRef } from 'react'
import parse, { attributesToProps } from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'
import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames'
import ArticleTOC from '@blocks/article/ArticleTOC'
import Delibird from '@views/components/Delibird/Delibird'

export default function Article( props ) {
  const refArticle = useRef(null)
  const refArticleMain = useRef(null)
  const refArticleSidebar = useRef(null)

  const { name, attributes, innerBlocks, post, postType } = props
  const headings = innerBlocks.filter( node => ( node.name === 'core/heading' ))
  const hTwos = headings.filter( node => ( !node.attributes.level ))

  const menuOffset = () => {
    const menuFixed = document.querySelector('.menu-fixed');
    return (menuFixed) ? menuFixed.offsetHeight + 32 : 32;
  };

  const [ tocOffset, setTocOffset ] = useState( menuOffset )
  const [ windowHeight, setWindowHeight ] = useState( window.innerHeight )

  useEffect(() => {
    if (!refArticleMain.current || !refArticleSidebar.current) return;

    const renderedH2s = refArticleMain.current.querySelectorAll('h2')
    const renderedTOC = refArticleSidebar.current.querySelector('.article-toc')

    if (!renderedTOC || renderedH2s.length <= 2) return;

    const handleScroll = () => {
      renderedH2s.forEach(h2 => {
        const slug = h2.id
        const link = renderedTOC.querySelector(`[data-slug="${ slug }"]`)

        h2.style.scrollMarginTop = tocOffset + 'px'

        if(!link) return

        const h2Top = h2.getBoundingClientRect().top

        if(h2Top > tocOffset && h2Top < windowHeight - tocOffset * 0.75) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }

      })
    }

    const handleResize = () => {
      setTocOffset( menuOffset )
      setWindowHeight( window.innerHeight )
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }

  }, [ tocOffset, windowHeight]);

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
    <section { ...atts } ref={ refArticle }>
      <div className={ containerClassNames(attributes, []).join(' ') }>
        <div className="article-layout">
          <div className="article-main badegg-block-list wysiwyg" ref={ refArticleMain }>
            { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
              innerBlocks.map((block, index) => (
                <Switchboard key={ index } index={ index } post={ post } postType={ postType } {...block} />
              )
            )}
          </div>

          { attributes?.sidebar && Array.isArray(hTwos) && hTwos.length > 2 && (
            <aside className="article-sidebar" ref={ refArticleSidebar }>
              <ArticleTOC label={ attributes?.tocLabel } headings={ hTwos } stickyTop={ tocOffset } />
              <Delibird />
            </aside>
          )}

        </div>
      </div>
    </section>
  )
}
