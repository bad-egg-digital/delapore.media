import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function PostGrid({ postType, posts, terms, activeTerm, contentType }) {
  return (
    <section className="section section-postgrid">
      <div className="container container-large">
        <TermList items={ terms } active={ activeTerm } contentType={ contentType } />

        {posts.map(post => (
          <article key={post.node.id}>
            <h2>{ post.node.title || '&nbsp;' }</h2>
            <Link to={ `${ post.node.uri }` }>Read more</Link>
          </article>
        ))}

      </div>
    </section>
  )
}
