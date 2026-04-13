import { useEffect, useState } from 'react'

export default function Archive({ postType = 'post' }) {
  const [ posts, setPosts ] = useState([])
  const [ archivePage, setArchivePage] = useState({})
  const [ archiveLoaded, setArchiveLoaded ] = useState(false)

  useEffect(() => {
    fetch( badEggAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `
        {
          badEgg {
            archiveObjects {
              ${postType} {
                slug
                title
                content
              }
            }
          }
          posts {
            edges {
              node {
                id
                slug
                title
                excerpt
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
        setArchiveLoaded(true);
      })
  }, [])

  return (
    <div>
      <h1>{ archivePage.title }</h1>
      {posts.map(post => (
        <article key={post.node.id}>
          <h2>{ post.node.title }</h2>
        </article>
      ))}
    </div>
  )
}
