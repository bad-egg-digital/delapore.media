import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import BlockList from '@views/components/BlockList/BlockList'
import PostGrid from '@views/components/PostGrid/PostGrid'
import Error from '@views/templates/Error'

export default function Archive({ postType = 'post' }) {
  const { term } = useParams()
  const [ archivePage, setArchivePage] = useState({})
  const [ contentType, setContentType ] = useState({})
  const [ posts, setPosts ] = useState([])
  const [ terms, setTerms ] = useState([])
  const [ isLoaded, setIsLoaded ] = useState(false)

  let queryTaxonomy = ''

  switch( postType ) {
    case 'post':    queryTaxonomy = 'Category'
    default:
  }

  useEffect(() => {
    let queryTerms = ''
    let queryPostTerms = ''
    let queryWhere = ''

    if(queryTaxonomy) {
      queryTerms = `
        terms {
          nodes {
            ... on ${ queryTaxonomy } {
              name
              slug
              uri
            }
          }
        }
      `

      queryPostTerms = `terms {
        nodes {
          ... on ${ queryTaxonomy } {
            name
            slug
            uri
          }
        }
      }`
    }

    if(term && queryTaxonomy === 'Category') {
      queryWhere = `(where: {categoryName: "${ term }"})`
    }

    let query = `
      {
        badEgg {
          archiveObjects {
            ${ postType } {
              slug
              title
              content
              excerpt
              databaseId
              blocks {
                attributes
                content
                name
                rawContent
              }
            }
          }
        }
        ${ postType }s${ queryWhere } {
          edges {
            node {
              id
              slug
              title
              excerpt
              uri
              featuredImage {
                node {
                  altText
                  sourceUrl
                  srcSet
                  title
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              ${ queryPostTerms }
            }
          }
        }
        contentType(id: "${ postType }", idType: NAME) {
          label
          uri
        }
        ${ queryTerms }
      }
    `

    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setContentType(res?.data?.contentType || {})
        setTerms(res?.data?.terms?.nodes || [])
        setPosts(res?.data?.[ postType + 's']?.edges || [])
        setArchivePage(res?.data?.badEgg?.archiveObjects?.[postType] || {})
        setIsLoaded(true);
      })
  }, [ postType, queryTaxonomy, term ])

  if(isLoaded && archivePage) {

    return (
      <>
        <Helmet>
          <title>{ archivePage.title }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ archivePage.title } />
          <meta property="og:description" content="Dynamic page content" />
        </Helmet>

        { archivePage && (
          <>
            <BlockList id={ archivePage.databaseId } postType={ postType } post={ archivePage } />

            <div className="badegg-block-list">
              <PostGrid
                postType={ postType }
                activeTerm={ term }
                posts={ posts }
                terms={ terms }
                contentType={ contentType }
              />
            </div>
          </>
        )}

      </>
    )
  } else if (isLoaded) {
    return <Error />
  }
}
