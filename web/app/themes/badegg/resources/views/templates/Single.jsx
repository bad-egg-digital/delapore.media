import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import BlockList from '@views/components/BlockList/BlockList'
import Error from '@views/templates/Error'

export default function Single({ postType = 'page' }) {
  const { slug } = useParams()
  const [ post, setPost ] = useState(null)
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    let queryTerms = ''

    if( postType !== 'page')
      queryTerms = `terms {
        nodes {
          databaseId
          uri
          name
          slug
          taxonomyName
        }
      }`

    let query = `
      {
        ${ postType }(id: "${ slug || '/' }", idType: URI) {
          id
          slug
          title
          date
          databaseId
          ${ queryTerms }
        }
      }
    `;

    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPost(res.data[postType])
        setIsLoaded(true)
      })
  }, [slug])

  if( isLoaded && post ) {
    return (
      <>
        <Helmet>
          <title>{ post.title }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ post.title } />
          <meta property="og:description" content="Dynamic page content" />
        </Helmet>

        <BlockList id={ post.databaseId } postType={ postType } post={ post } />

      </>

    )
  } else if (isLoaded) {
    return <Error />
  }
}
