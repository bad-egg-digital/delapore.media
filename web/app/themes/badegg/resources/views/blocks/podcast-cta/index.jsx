// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import clsx from "clsx";
import parse from "html-react-parser";
import { dateI18n, getSettings } from '@wordpress/date';
import { useEffect, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import Delibird from "@views/components/Delibird/Delibird";
import CTA from "@views/components/CTA/CTA"

import {
	Panel,
	PanelBody,
  ToggleControl,
  SelectControl,
} from '@wordpress/components';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ latestPodcast, setLatestPodcast ] = useState([]);
    const [ podcastArchiveID, setPodcastArchiveID ] = useState(0);
    const [ podcastArchive, setPodcastArchive ] = useState({});

    useEffect(() => {
      async function fetchPosts() {
        try {
          const [ postTypes, getPodcasts ] = await Promise.all([
            apiFetch({ path: '/badeggcup/v1/post-types' }),
            apiFetch({ path: '/wp/v2/podcasts?per_page=1' }),
          ]);

          setPodcastArchiveID(postTypes?.hasArchive?.podcast?.pageForArchive);
          setLatestPodcast(getPodcasts[0])

        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }

      fetchPosts();
    }, []);

    useEffect(() => {
      if(podcastArchiveID) {
        async function fetchPost() {
          try {
            const [ archive ] = await Promise.all([
              apiFetch({ path: `/wp/v2/pages/${ podcastArchiveID }` }),
            ]);

            setPodcastArchive(archive);

          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        }

        fetchPost();
      }
    }, [ podcastArchiveID ]);

    return (
      <div { ...blockProps }>
        <CTA className="cta-block-column cta-block-podcast" hasColumns={ true }>
          <div className="cta-block-image">
            <Delibird variant="podcast" />
          </div>

          <div className="cta-block-column cta-block-content">
            { (podcastArchive?.meta?.titlePrefix) ?
              <p className="cta-block-content-prefix">
                { podcastArchiveTerm ? `${ podcastArchiveTerm.name }: ` : '' }
                { podcastArchive?.meta?.titlePrefix }
              </p>
            : null }

            <h2 className="cta-block-content-heading">{ podcastArchive?.title?.rendered }</h2>

            { podcastArchive?.meta?.subtitle &&
              <p className="cta-block-content-subtitle">{  podcastArchive.meta.subtitle }</p>
            }

            { podcastArchive?.excerpt &&
              <div className="cta-block-content-excerpt">
                { parse(podcastArchive.excerpt.rendered) }
              </div>
            }

            <div className="cta-block-action wysiwyg">
              <div className="btn-wrap">
                <span className="btn primary">Latest Episode</span>
                <span className="btn white outline">View all episodes</span>
              </div>
            </div>
          </div>
        </CTA>
      </div>
    );
  },
});
