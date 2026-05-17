import './PostGrid.scss'
import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router'
import TermList from '@views/components/TermList/TermList'
import Posts from '@views/components/PostGrid/Posts'

export default function PostGrid({ postType, activeTerm }) {
  let location = useLocation()
  const [ contentType, setContentType ] = useState({})
  const [ posts, setPosts ] = useState([])
  const [ terms, setTerms ] = useState([])
  const [ isLoaded, setIsLoaded ] = useState(false)

  let queryTaxonomy = ''

  switch( postType ) {
    case 'post':    queryTaxonomy = 'Category'
    default:
  }

  const query = buildQuery( postType, queryTaxonomy, activeTerm )

  useEffect(() => {
    setPosts([])
  }, [ location.pathname ])

  useEffect(() => {
    setPosts([])

    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setContentType(res?.data?.contentType)
        setTerms(res?.data?.terms?.nodes)
        setPosts(res?.data?.[ postType + 's']?.edges)
        setIsLoaded(true)
      })
  }, [ postType, activeTerm, query, isLoaded ])

  return (
    <section className="section section-postgrid">
      <div className="container container-large">

        <TermList
          className="termlist-archive"
          items={ terms }
          active={ activeTerm }
          contentType={ contentType }
          isLoaded={ isLoaded }
        />

        <Posts
          key={ postType + activeTerm }
          posts={ posts }
          postType={ postType }
          isLoaded={ isLoaded }
          showLoading={ true }
        />
      </div>
    </section>
  )
}

function buildQuery(postType, queryTaxonomy, term)
{
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

  return query
}
