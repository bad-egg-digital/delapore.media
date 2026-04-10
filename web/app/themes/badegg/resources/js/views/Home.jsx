import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/wp-json/wp/v2/posts')
      .then(res => res.json())
      .then(setPosts)
  }, [])

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(post => (
        <div key={post.id} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      ))}
    </div>
  )
}
