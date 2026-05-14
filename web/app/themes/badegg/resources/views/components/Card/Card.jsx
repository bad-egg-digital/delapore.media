import './Card.scss'
import parse from "html-react-parser"
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function Card( props ) {
  const { postType, slug, terms, title, excerpt, uri, featuredImage } = props

  console.log(props)

  let readMore = ''

  switch(postType) {
    case 'post':    readMore = 'Continue reading'
    case 'podcast': readMore = 'View show notes'
    default:        readMore = 'Read more'
  }

  return (
    <article className={ `card card-${ postType } bg-white rounded` }>
      <header className="bg-grey-darker ">
        { featuredImage ? (
          <img
            className="card-featured"
            src={featuredImage?.node?.sourceUrl }
            srcSet={ featuredImage?.node?.srcSet }
            alt={ featuredImage?.node?.altText }
            width={ featuredImage?.node?.mediaDetails?.width }
            height={ featuredImage?.node?.mediaDetails?.height }
          />
        ) : (
          <div className="card-featured-placeholder" />
        )
        }
      </header>
      <div className="card-content inner inner-small">
        <TermList items={ terms?.nodes } />
        <h2>{ title }</h2>
        { excerpt && <div className="card-excerpt">{ parse(excerpt) }</div> }
      </div>
      <footer className="inner inner-small inner-unset-top">
        <span className="card-more">+{ readMore }</span>
      </footer>
      <Link to={ uri } className="card-more-overlay">
        <span className="visually-hidden">{ readMore }</span>
      </Link>
    </article>
  )
}
