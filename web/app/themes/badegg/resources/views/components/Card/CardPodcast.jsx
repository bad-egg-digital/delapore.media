import clsx from 'clsx'
import parse from "html-react-parser"
import { useContext } from 'react'
import { AppContext } from '@views/layouts/AppContext'
import { Link } from 'react-router-dom'
import TermList from '@views/components/TermList/TermList'
import AudioPlay from '@views/components/AudioPlay/AudioPlay'

export default function CardPodcast( props ) {

  const {
    postType,
    slug,
    terms,
    title,
    excerpt,
    date,
    uri,
    featuredImage,
    isLoaded,
    episodeAudio,
  } = props

  const className = clsx(
    'card',
    postType && 'card-' + postType,
    'rounded',
    'bg-white',
  )

  const readMore = 'View show notes'

  return (
    <article className={ className }>
      <header className="card-featured bg-grey-darker">
        <AudioPlay
          { ...episodeAudio }
          postLink={ uri }
          postTitle={ title }
          postDate={ date }
          hideLabel={ true }
        />

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
        )}
      </header>
      <div className="card-content inner inner-small">
        <p>
          <time dateTime={ date }>
            {
              new Date(date).toLocaleDateString(
                'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )
            }
          </time>
          <span className="card-podcast-duration">{ episodeAudio?.length_formatted }</span>
        </p>

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
