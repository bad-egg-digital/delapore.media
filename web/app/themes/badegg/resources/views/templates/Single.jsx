import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import BlockList from '@views/components/BlockList/BlockList'
import Error from '@views/templates/Error'

export default function Single({ postType }) {
  const { slug } = useParams()
  const [ post, setPost ] = useState(null)
  const [ isLoaded, setIsLoaded ] = useState(false)

  const query = buildQuery(slug, postType);

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPost(res?.data?.[postType?.name])
        setIsLoaded(true)
      })
  }, [ slug, postType ])

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

function buildQuery(slug, postType)
{
  let queryTerms = ''
  let queryBlocks = ''
  let queryWhere = ''

  if(postType?.primaryTaxonomy) {
    queryWhere = `(where: {taxonomies: ${ postType.primaryTaxonomy.graphqlSingleName.toUpperCase() }})`
  }

  if(postType?.name !== 'page') {
    queryTerms = `terms${ queryWhere } {
      nodes {
        databaseId
        uri
        name
        slug
        taxonomyName
        count
      }
    }`
  }

  if(['page', 'post', 'podcast'].includes(postType?.name)) {
    queryBlocks = `blocks {
      index
      name
      attributes
      content
      rawContent
      innerBlocks {
        index
        name
        attributes
        content
        rawContent
      }
    }`
  }

  let query = `
    {
      ${ postType?.graphqlSingleName?.toLowerCase() }(id: "${ slug || '/' }", idType: URI) {
        id
        slug
        title
        excerpt
        date
        databaseId
        ${ queryBlocks }
        ${ queryTerms }
      }
    }
  `;

  return query;
}
