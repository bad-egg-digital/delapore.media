import './style.scss'
import parse from "html-react-parser";
import { AppContext } from '@views/layouts/AppContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CTA from "@views/components/CTA/CTA";
import Delibird from "@views/components/Delibird/Delibird";

export default function PodcastCTA( props ) {
  const { appContext, setAppContext } = useContext( AppContext );

  const podcastArchive = appContext?.pagePodcast || {};
  const latestPodcast = appContext?.firstPodcasts[0] || {};

  return (
    <div className="wp-block-badegg-podcast-cta">
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
  )
}
