import { AppContext } from '@views/layouts/AppContext'
import { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CSSTransition } from 'react-transition-group';

import { querySingle } from '@scripts/lib/graphql-queries'
import BlockList from '@views/components/BlockList/BlockList'
import PostGrid from '@views/components/PostGrid/PostGrid'
import Error from '@views/templates/Error'

export default function Archive( props ) {
  const nodeRef = useRef(null);

  const {
    postType = 'post',
    pageID,
    taxonomy,
  } = props

  const { term } = useParams()
  const { appContext = {} } = useContext( AppContext )
  const pageType = appContext?.postTypes.find( type => type.name === 'page') || {}
  const [ archivePage, setArchivePage ] = useState({})
  const [ isLoaded, setIsLoaded ] = useState(false)

  const query = querySingle({
    id: pageID,
    postType: pageType
  })

  useEffect(() => {
    setIsLoaded(false)

    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setArchivePage(res?.data?.page || {})
        setIsLoaded(true)
      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [ pageID, postType ])

  return (
    <>
      <Helmet>
        <title>{ archivePage?.title }</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={ archivePage?.title } />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <CSSTransition
        nodeRef={ nodeRef }
        in={ isLoaded }
        timeout={ 300 }
        classNames="transitions-page"
        // unmountOnExit={ true }
      >
        <div className="transitions-page" ref={ nodeRef }>
          <BlockList key={ pageID } id={ pageID } postType={ pageType } post={ archivePage } />

          <div className="badegg-block-list">
            <PostGrid key={ postType?.name + taxonomy?.name } postType={ postType } taxonomy={ taxonomy } activeTerm={ term }  />
          </div>
        </div>
      </CSSTransition>
    </>
  )
}
