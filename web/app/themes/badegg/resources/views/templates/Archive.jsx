import { AppContext } from '@views/layouts/AppContext'
import { useEffect, useState, useContext, appContext } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import { querySingle } from '@scripts/lib/graphql-queries'
import BlockList from '@views/components/BlockList/BlockList'
import PostGrid from '@views/components/PostGrid/PostGrid'
import Error from '@views/templates/Error'

export default function Archive( props ) {
  const {
    postType = 'post',
    pageID,
    taxonomy,
  } = props

  const { term } = useParams()
  const { appContext, setAppContext } = useContext( AppContext )
  const { pageLoaded, postTypes } = appContext
  const pageType = postTypes.find( type => type.name === 'page') || {}
  const [ archivePage, setArchivePage ] = useState({})

  const query = querySingle({
    id: pageID,
    postType: pageType
  })

  useEffect(() => {
    setAppContext(prevState => ({
      ...prevState,
      pageLoaded: false,
    }))

    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setArchivePage(res?.data?.page || {})

        setAppContext(prevState => ({
          ...prevState,
          pageLoaded: true,
        }))
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

      <BlockList key={ pageID } id={ pageID } postType={ pageType } post={ archivePage } />

      { pageLoaded &&
        <>

          <div className="badegg-block-list">
            <PostGrid key={ postType?.name + taxonomy?.name } postType={ postType } taxonomy={ taxonomy } activeTerm={ term }  />
          </div>
        </>
      }
    </>
  )
}
