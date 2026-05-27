import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CSSTransition } from 'react-transition-group';
import { AppContext } from '@views/layouts/AppContext'

import { querySingle } from '@scripts/lib/graphql-queries'
import BlockList from '@views/components/BlockList/BlockList'
import Error from '@views/templates/Error'

export default function Single({ postType }) {
  const { slug } = useParams()
  const [ post, setPost ] = useState({})
  const { appContext, setAppContext } = useContext( AppContext )
  const { pageLoaded } = appContext
  const query = querySingle({ slug: slug, postType: postType});

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
        setPost(res?.data?.[postType?.name] || {})

        setAppContext(prevState => ({
          ...prevState,
          pageLoaded: true,
        }))

      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [ slug, postType ])

  return (
    <>
      <Helmet>
        <title>{ post?.title }</title>
        <meta name="description" content="Dynamic page from WordPress" />

        <meta property="og:title" content={ post?.title } />
        <meta property="og:description" content="Dynamic page content" />
      </Helmet>

      <BlockList key={ post?.databaseId } id={ post?.databaseId } postType={ postType } post={ post } />
    </>
  )
}

