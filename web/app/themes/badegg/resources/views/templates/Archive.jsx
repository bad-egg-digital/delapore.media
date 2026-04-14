import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import Error from '@views/templates/Error'

export default function Archive({ postType = 'post' }) {
  const [ archivePage, setArchivePage] = useState({})
  const [ posts, setPosts ] = useState([])
  const [ isLoaded, setIsLoaded ] = useState(false)

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          badEgg {
            archiveObjects {
              ${ postType } {
                slug
                title
                content
              }
            }
          }
          ${ postType }s {
            edges {
              node {
                id
                slug
                title
                excerpt
                uri
              }
            }
          }
        }
      ` }),
    })
      .then(res => res.json())
      .then(res => {
        setPosts(res.data.posts.edges);
        setArchivePage(res.data.badEgg.archiveObjects[postType])
        setIsLoaded(true);
      })
  }, [])

  if(isLoaded && archivePage) {
    return (
      <>
        <Helmet>
          <title>{ archivePage.title }</title>
          <meta name="description" content="Dynamic page from WordPress" />

          <meta property="og:title" content={ archivePage.title } />
          <meta property="og:description" content="Dynamic page content" />
        </Helmet>

        <div>
          <h1>{ archivePage.title }</h1>

          {posts.map(post => (
            <article key={post.node.id}>
              <h2>{ post.node.title }</h2>
              <Link to={ `${ post.node.uri }` }>Read more</Link>
            </article>
          ))}
        </div>

      </>
    )
  } else if (isLoaded) {
    return <Error />
  }
}
