import './style.scss'
import parse from "html-react-parser"
import { AppContext } from '@views/layouts/AppContext'
import { useContext, useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group';

import Block from '@views/layouts/Block'
import TermList from '@views/components/TermList/TermList'
import { Link, useLocation } from 'react-router-dom'
import { queryFrontCover } from "@scripts/lib/graphql-queries"
import AudioPlay from '@views/components/AudioPlay/AudioPlay'

export default function FrontCover( props ) {
  const { post, postType, attributes } = props
  const { aboutPageID, podcastPageID } = attributes
  const { appContext, setAppContext } = useContext( AppContext )
  const nodeRef = useRef(null);
  const [ aboutPage, setAboutPage ] = useState({});
  const [ podcastPage, setPodcastPage ] = useState({});
  const [ podcasts, setPodcasts ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const query = queryFrontCover({ about: aboutPageID, podcast: podcastPageID })

  useEffect(() => {
    fetch( badEggCupAPI.graphql, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    })
      .then(res => res.json())
      .then(res => {
        setPodcastPage(res?.data?.podcast || {})
        setAboutPage(res?.data?.about || {})
        setPodcasts(res?.data?.podcasts?.nodes || [])
        setIsLoaded(true)
      })
      .catch( error => {
        console.error('Error fetching page:', error)
        console.log(query)
      })
  }, [])

  // console.log(aboutPage)
  // console.log(appContext)

  return (
    <Block className="wp-block-badegg-front-cover" attributes={ attributes }>
      <div className="front-cover">
        { appContext?.firstPost &&
          <div className="front-cover-post section section-zero-top">
            <div className="front-cover-post-featured rounded">
              { appContext?.firstPost?.featuredImage ? (
                <figure>
                  <img
                    src={ appContext?.firstPost?.featuredImage?.node?.sourceUrl }
                    srcSet={ appContext?.firstPost?.featuredImage?.node?.srcSet }
                    alt={ appContext?.firstPost?.featuredImage?.node?.altText }
                    width={ appContext?.firstPost?.featuredImage?.node?.mediaDetails?.width }
                    height={ appContext?.firstPost?.featuredImage?.node?.mediaDetails?.height }
                  />
                </figure>
              ) : (
                <div className="front-cover-post-featured-placeholder bg-grey-lighter-a" />
              )}
            </div>

            { appContext?.firstPost?.titlePrefix &&
              <p className="front-cover-post-prefix grey-light-a">{ appContext.firstPost.titlePrefix }</p>
            }

            <h1>{ appContext?.firstPost?.title }</h1>

            { appContext?.firstPost?.subtitle &&
              <p className="front-cover-post-subtitle primary-lightest">{ appContext.firstPost.subtitle }</p>
            }

            { appContext?.firstPost?.excerpt &&
              <div className="front-cover-post-excerpt">
                { parse(appContext?.firstPost?.excerpt) }
              </div>
            }

            <Link to={ appContext?.firstPost?.uri } className="more">
              +Continue reading
            </Link>
            <hr/>

            <TermList
              items={ appContext?.firstPost?.terms?.nodes }
              primaryItem={ appContext?.firstPost?.categoryPrimaryTerm }
              isLoaded={ true }
            />

          </div>
        }

        <div className="front-cover-column">

          <CSSTransition
            nodeRef={ nodeRef }
            in={ isLoaded }
            timeout={ 200 }
            classNames="transitions-page"
          >
            <div className="front-cover-column-inner transitions-page" ref={ nodeRef }>
              { aboutPage && (
                <div className="front-cover-column-block">
                  <h2 className="section-title">{ aboutPage?.title }</h2>
                  { parse(aboutPage?.excerpt || '') }
                  <Link to={ aboutPage?.uri } className="more">
                    +Learn more
                  </Link>
                </div>
              )}

              { podcastPage && podcasts.length > 0 && (
                <div className="front-cover-column-block">
                  <h2 className="section-title">{ podcastPage?.title }</h2>
                  { parse(podcastPage?.excerpt || '') }

                  <div className="podcast-playlist card-opaque inner inner-small inner-zero-y">
                    <ul className="nolist">
                      { Object.entries(podcasts).map( ([index, podcast]) => (
                        <li key={ index }>
                          <Link to={ podcast.uri }>
                            <time className="masthead-date" dateTime={ podcast.date }>
                              {
                                new Date(podcast.date).toLocaleDateString(
                                  'en-US',
                                  { year: 'numeric', month: 'short', day: 'numeric' }
                                )
                              }
                            </time>
                            <h4 className="section-title">{ podcast.title }</h4>
                          </Link>

                          <AudioPlay
                            { ...podcast.episodeAudio }
                            postLink={ podcast.uri }
                            postTitle={ podcast.title }
                            postDate={ podcast.date }
                            hideLabel={ true }
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={ podcastPage?.uri } className="more">
                    +See all episodes
                  </Link>
                </div>
              )}

            </div>
          </CSSTransition>
        </div>
      </div>
    </Block>
  )
}
