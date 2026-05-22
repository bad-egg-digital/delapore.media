import './style.scss'
import { useEffect, useState, useRef } from 'react'
import parse, { attributesToProps } from "html-react-parser"
import Switchboard from '@views/components/Switchboard/Switchboard'
import Block from '@views/layouts/Block'
import ArticleTOC from '@blocks/article/ArticleTOC'
import Delibird from '@views/components/Delibird/Delibird'

export default function Article( props ) {
  const refArticle = useRef(null)
  const refArticleMain = useRef(null)
  const refArticleSidebar = useRef(null)

  const { name, attributes, innerBlocks, post, postType } = props
  const headings = (innerBlocks) ? innerBlocks.filter( node => ( node.name === 'core/heading' )) : []
  const hTwos = headings.filter( node => ( !node.attributes.level ))

  console.log(attributes)
  console.log(postType)
  console.log(post)

  const menuOffset = () => {
    const menuFixed = document.querySelector('.menu-fixed');
    return (menuFixed) ? menuFixed.offsetHeight + 32 : 32;
  };

  const [ sidebarOffset, setSidebarOffset ] = useState( menuOffset )
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

        h2.style.scrollMarginTop = sidebarOffset + 'px'

        if(!link) return

        const h2Top = h2.getBoundingClientRect().top

        if(h2Top > sidebarOffset && h2Top < windowHeight - sidebarOffset * 0.75) {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }

      })
    }

    const handleResize = () => {
      setSidebarOffset( menuOffset )
      setWindowHeight( window.innerHeight )
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }

  }, [ sidebarOffset, windowHeight]);

  return (
    <Block className="wp-block-badegg-article" attributes={ attributes } innerRef={ refArticle }>
      <div className="article-layout">
        <div className="article-main badegg-block-list wysiwyg" ref={ refArticleMain }>
          { Array.isArray(innerBlocks) && innerBlocks.length > 0 &&
            innerBlocks.map((block, index) => (
              <Switchboard key={ index } index={ index } post={ post } postType={ postType } {...block} />
            )
          )}
        </div>

        { !attributes?.hideSidebar && (
          <aside className={ `article-sidebar${ attributes?.sidebarSwitch ? ' article-sidebar-switch' : '' }` } ref={ refArticleSidebar }>
            <div className="article-sidebar-inner" style={{ top: sidebarOffset + 32 }}>

              {  }

              { !attributes?.hideTOC &&
                <ArticleTOC label={ attributes?.tocLabel } headings={ hTwos } />
              }

            </div>

            { !attributes?.hideDelibird &&
              <Delibird />
            }
          </aside>
        )}

      </div>
    </Block>
  )
}
