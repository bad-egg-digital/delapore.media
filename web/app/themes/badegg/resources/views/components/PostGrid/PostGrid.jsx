import './PostGrid.scss'
import TermList from '@views/components/TermList/TermList'
import Card from '@views/components/Card/Card'

export default function PostGrid({ postType, posts, terms, activeTerm, contentType }) {
  return (
    <section className="section section-postgrid">
      <div className="container container-large">
        <TermList className="termlist-archive" items={ terms } active={ activeTerm } contentType={ contentType }/>

        { posts.length > 0 && (
          <div className={ `postgrid postgrid-${ postType } section section-small section-zero-bottom` }>
            { posts.map( ( post, index ) => <Card key={ index} postType={ postType } { ...post.node } />)}
          </div>
        )}

      </div>
    </section>
  )
}
