import clsx from 'clsx'
import parse from "html-react-parser"
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'

export default function CardPost( props ) {

  const {
    postType,
    slug,
    terms,
    title,
    excerpt,
    uri,
    featuredImage,
    isLoaded,
  } = props

  const className = clsx(
    'card',
    postType && 'card-' + postType,
    'rounded',
    'bg-white',
  )

  const readMore = 'Continue reading'

  return (
    <article className={ className }>
      <header className="card-featured bg-grey-darker ">
        { featuredImage ? (
          <img
            loading="lazy"
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
        <TermList items={ terms?.nodes } limit={ 2 } isLoaded={ isLoaded } />
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
