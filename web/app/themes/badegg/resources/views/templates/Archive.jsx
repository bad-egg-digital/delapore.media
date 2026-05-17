import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AppContext } from '@views/layouts/AppContext'

import BlockList from '@views/components/BlockList/BlockList'
import PostGrid from '@views/components/PostGrid/PostGrid'
import Error from '@views/templates/Error'

export default function Archive({ postType = 'post' }) {
  const { appContext, setAppContext } = useContext( AppContext )
  const { term } = useParams()
  const archivePage = appContext?.pagesForArchives?.[postType]

  if(archivePage) {

    return (
      <>
        <Helmet>
          <title>{ archivePage.title }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ archivePage.title } />
          <meta property="og:description" content="Dynamic page content" />
        </Helmet>

        <BlockList id={ archivePage.databaseId } postType={ postType } post={ archivePage } />

        <div className="badegg-block-list">
          <PostGrid key={ postType } postType={ postType } activeTerm={ term }  />
        </div>
      </>
    )
  } else {
    return <Error title="Archive not found" description="There was a page here but that is no longer the case." />
  }
}

