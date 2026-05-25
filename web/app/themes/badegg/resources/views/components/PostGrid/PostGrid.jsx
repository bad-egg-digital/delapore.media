import './PostGrid.scss'
import { useEffect, useState } from 'react'
import TermList from '@views/components/TermList/TermList'
import Posts from '@views/components/PostGrid/Posts'
import { queryArchive } from '@scripts/lib/graphql-queries'

export default function PostGrid( props ) {
  const [ posts, setPosts ] = useState([])
  const [ isLoaded, setIsLoaded ] = useState(false)

  const {
    postType,
    taxonomy,
    activeTerm,
  } = props

  const query = queryArchive( props )
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
