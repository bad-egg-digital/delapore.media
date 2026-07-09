import './style.scss'
import { useEffect, useState, useRef } from 'react'
import parse from "html-react-parser"
import clsx from "clsx"
import { AppContext } from '@views/layouts/AppContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import CTA from "@views/components/CTA/CTA"
import Delibird from "@views/components/Delibird/Delibird";

export default function PodcastCTA( props ) {
  const nodeRef = useRef(null)
  const { appContext, setAppContext } = useContext( AppContext )
  const podcastType = appContext?.postTypes.find( type => type.name === 'podcast') || {}
  const [ podcastArchive, setPodcastArchive ] = useState({})
  const [ latestPodcast, setLatestPodcast ] = useState({})
  const [ isLoaded, setIsLoaded ] = useState(false)

  let query = `
    {
      ${ podcastType?.pageForArchive?.databaseId ? `
        podcastArchive: page(id: "${ podcastType.pageForArchive.databaseId }", idType: DATABASE_ID) {
          titlePrefix
          title
          subtitle
          excerpt
          uri
        }
      ` : '' }
      podcasts(first: 1) {
        nodes {
          uri
        }
      }
    }
  `;

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        let first = res?.data?.podcasts?.nodes?.[0]

        setLatestPodcast(first || {})
        setPodcastArchive(res?.data?.podcastArchive || {})
        setIsLoaded(true)
      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [])

  return (
    <CSSTransition
      nodeRef={ nodeRef }
      in={ isLoaded }
      timeout={ 200 }
      classNames="transitions-page"
      // unmountOnExit={ true }
    >
      <div className="wp-block-badegg-podcast-cta transitions-page" ref={ nodeRef }>
        <CTA className="cta-block-podcast" hasColumns={ true }>
          <div className="cta-block-column cta-block-image">
            <Delibird variant="podcast" />
          </div>

          <div className="cta-block-column cta-block-content">
            { podcastArchive?.titlePrefix ?
              <p className="cta-block-content-prefix">
                { podcastArchive.titlePrefix }
              </p>
            : null }

            <h2 className="cta-block-content-heading">{ podcastArchive.title }</h2>

            { podcastArchive?.subtitle &&
              <p className="cta-block-content-subtitle">{ podcastArchive.subtitle }</p>
            }

            { podcastArchive?.excerpt &&
              <div className="cta-block-content-excerpt">
                { parse( podcastArchive.excerpt ) }
              </div>
            }

            <div className="cta-block-action wysiwyg">
              <div className="btn-wrap">
                { latestPodcast?.uri ?
                  <Link to={ latestPodcast.uri } className="btn primary">
                    Latest episode
                  </Link>
                : null }

                { podcastArchive?.uri ?
                  <Link to={ podcastArchive.uri } className="btn white outline">
                    View all episodes
                  </Link>
              : null }
              </div>

            </div>
          </div>
        </CTA>
      </div>
    </CSSTransition>
  )
}
