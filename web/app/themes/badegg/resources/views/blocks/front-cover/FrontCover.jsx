import './style.scss'
import parse from "html-react-parser"
import { AppContext } from '@views/layouts/AppContext'
import { useContext, useState, useEffect } from 'react'

import Block from '@views/layouts/Block'
import TermList from '@views/components/TermList/TermList'
import { Link, useLocation } from 'react-router-dom'
import AudioPlay from '@views/components/AudioPlay/AudioPlay'

export default function FrontCover( props ) {
  const { post, postType, attributes } = props
  const { aboutPageID, podcastPageID } = attributes
  const { appContext, setAppContext } = useContext( AppContext )

  const firstPost = appContext?.firstPost;
  const aboutPage = appContext?.pageAbout;
  const podcastPage = appContext?.pagePodcast;
  const podcasts = appContext?.firstPodcasts;

  return (
    <Block className="wp-block-badegg-front-cover" attributes={ attributes }>
      <div className="front-cover">
        { firstPost &&
          <div className="front-cover-post section section-zero-top">
            <div className="front-cover-post-featured rounded">
              { firstPost?.featuredImage ? (
                <figure>
                  <img
                    src={ firstPost?.featuredImage?.node?.sourceUrl }
                    srcSet={ firstPost?.featuredImage?.node?.srcSet }
                    alt={ firstPost?.featuredImage?.node?.altText }
                    width={ firstPost?.featuredImage?.node?.mediaDetails?.width }
                    height={ firstPost?.featuredImage?.node?.mediaDetails?.height }
                  />
                </figure>
              ) : (
                <div className="front-cover-post-featured-placeholder bg-grey-lighter-a" />
              )}
            </div>

            { firstPost?.titlePrefix &&
              <p className="front-cover-post-prefix grey-light-a">{ appContext.firstPost.titlePrefix }</p>
            }

            <h1>{ firstPost?.title }</h1>

            { firstPost?.subtitle &&
              <p className="front-cover-post-subtitle primary-lightest">{ appContext.firstPost.subtitle }</p>
            }

            { firstPost?.excerpt &&
              <div className="front-cover-post-excerpt">
                { parse(firstPost?.excerpt) }
              </div>
            }

            <Link to={ firstPost?.uri } className="more">
              +Continue reading
            </Link>
            <hr/>

            <TermList
              items={ firstPost?.terms?.nodes }
              primaryItem={ firstPost?.categoryPrimaryTerm }
              isLoaded={ true }
            />

          </div>
        }

        <div className="front-cover-column">
          <div className="front-cover-column-inner">
            { aboutPage && aboutPage?.title && (
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
        </div>
      </div>
    </Block>
  )
}
