import './PostGrid.scss'
import { useEffect, useState } from 'react'
import TermList from '@views/components/TermList/TermList'
import Posts from '@views/components/PostGrid/Posts'

export default function PostGrid( props ) {
  const [ posts, setPosts ] = useState([])
  const [ isLoaded, setIsLoaded ] = useState(false)

  const {
    postType,
    taxonomy,
    activeTerm,
  } = props

  const query = buildQuery( props )
  const terms = taxonomy?.connectedTerms?.nodes

  useEffect(() => {
    setPosts([])
  }, [ location.pathname ])

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPosts(res?.data?.[postType?.graphqlPluralName.toLowerCase()]?.nodes)
        setIsLoaded(true)
      })
  }, [ postType, location.pathname ])

  return (
    <section className="section section-postgrid">
      <div className="container container-large">

        <TermList
          key={ taxonomy?.name }
          className="termlist-archive"
          items={ terms }
          postType={ postType }
          isLoaded={ isLoaded }
          state={{ preserveScroll: true }}
        />

        <Posts
          key={ postType?.name + activeTerm }
          posts={ posts }
          postType={ postType }
          isLoaded={ isLoaded }
          showLoading={ true }
        />

      </div>
    </section>
  )
}

function buildQuery({ postType, taxonomy, activeTerm })
{
  let queryWhere = ''
  let termsWhere = ''
  let podcastFields = ''
  let productFields = ''

  if(activeTerm && taxonomy?.graphqlSingleName) {
    queryWhere = `(where: { ${ taxonomy.graphqlSingleName }Name: "${ activeTerm }" })`
  }

  if(taxonomy && taxonomy?.graphqlSingleName) {
    termsWhere = `(where: { taxonomies: ${ taxonomy.graphqlSingleName.toUpperCase() } })`
  }

  if(postType?.name === 'podcast') {
    podcastFields = `
      episodeAudio
      episodeContent
    `
  }

  if(postType?.name === 'product') {
    productFields = `
      productPrice
      productOffsiteURL
      productCoverID
      productOffsiteURL
    `
  }

  let query = `
    {
      ${ postType.graphqlPluralName.toLowerCase() }${ queryWhere } {
        nodes {
          id
          slug
          title
          excerpt
          date
          uri
          ${ podcastFields }
          ${ productFields }
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
          terms${ termsWhere } {
            nodes {
              name
              slug
              uri
            }
          }
        }
      }
    }
  `

  return query
}
