// block.json's editorScript, loaded only in the block editor
import './style.scss'
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import { useEffect, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import parse from "html-react-parser"
import IconPlay from '@images/circle-play-solid-full.svg?react'
import AttachmentImage from "@blocks/-editor/AttachmentImage"
import clsx from 'clsx';

import {
	Panel,
	PanelBody,
  SelectControl,
} from '@wordpress/components';

import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const { formats } = getSettings();
    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');
    const [ loading, setLoading ] = useState( true );
    const [ latestPost, setLatestPost ] = useState({});
    const [ latestPostCats, setLatestPostCats ] = useState([]);
    const [ latestPodcasts, setLatestPodcasts ] = useState([]);
    const [ pageSelections, setPageSelections ] = useState([]);
    const [ pages, setPages ] = useState({ podcast: {}, about: {} });

    const {
      aboutPageID,
      podcastPageID,
    } = attributes;

    async function fetchPage(id, slug) {
      try {
        const [ page ] = await Promise.all([
          apiFetch({ path: `/wp/v2/pages/${ id }` }),
        ]);

        setPages( prev => ({
          ...prev,
          [slug]: page
        }));

      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    useEffect(() => {
      async function fetchPosts() {
        try {
          const [ pages, posts, podcasts ] = await Promise.all([
            apiFetch({ path: '/wp/v2/pages?orderby=title&order=asc&parent=0' }),
            apiFetch({ path: '/wp/v2/posts?orderby=date&order=desc&per_page=1' }),
            apiFetch({ path: '/wp/v2/podcasts?orderby=date&order=desc&per_page=3' })
          ]);

          if(pages.length > 0) {
            let pageList = [
              { value: 0, label: __('Select a page', 'badegg') },
            ];

            Object.entries(pages).map( ([index, page]) =>
              pageList.push({ value: Number(page.id), label: page?.title?.rendered }));

            setPageSelections(pageList);
          }

          if(posts.length > 0) {
            setLatestPost(posts[0]);

            if(posts[0]?.categories && posts?.[0]?.categories.length > 0 ) {
              let [ categories ] = await Promise.all([
                apiFetch({ path: `/wp/v2/categories?include=${posts[0].categories.join(',')}` }),
              ]);

              if(posts[0]?.meta?._primary_term_category) {
                categories.unshift(
                  categories.splice(
                    categories.findIndex(
                      item => item.id === posts[0]?.meta._primary_term_category),
                  1)[0]
                )
              }

              setLatestPost( prev => ({
                ...prev,
                categories: categories,
              }) );
            }
          }

          if(podcasts.length > 0) {
            setLatestPodcasts(podcasts);
          }

        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchPosts();
    }, []);

    useEffect(() => {
      if(aboutPageID) fetchPage(aboutPageID, 'about');
      if(podcastPageID)  fetchPage(podcastPageID, 'podcast');
    }, [ aboutPageID, podcastPageID ]);

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Controls", "badegg") }>
              { pageSelections.length > 0 &&
                <>
                  <SelectControl
                    label={ __("About Page", "badegg") }
                    value={ Number(aboutPageID) }
                    options={ pageSelections }
                    onChange={ (value) => setAttributes({ aboutPageID: Number(value) }) }
                    __next40pxDefaultSize={ true }
                    __nextHasNoMarginBottom={ true }
                  />
                  <SelectControl
                    label={ __("Podcast Page", "badegg") }
                    value={ Number(podcastPageID) }
                    options={ pageSelections }
                    onChange={ (value) => setAttributes({ podcastPageID: Number(value) }) }
                    __next40pxDefaultSize={ true }
                    __nextHasNoMarginBottom={ true }
                  />
                </>
              }
            </PanelBody>

            <BlockSettings
              attributes={ attributes }
              setAttributes={ setAttributes }
            />
          </Panel>
        </InspectorControls>

        <div className={ containerClassNames(attributes, []).join(' ') }>
          <div className="front-cover">

            { latestPost && (
              <div className="front-cover-post section section-zero-top">
                <div className="front-cover-post-featured">
                  { latestPost?.featured_media ? (
                    <AttachmentImage imageId={ latestPost?.featured_media } className="rounded" />
                  ) : (
                    <div className="front-cover-post-featured-placeholder bg-grey-lighter-a" />
                  )}
                </div>

                { latestPost?.meta?.titlePrefix &&
                  <p className="front-cover-post-prefix grey-light-a">{ latestPost.meta.titlePrefix }</p>
                }

                <h1>{ latestPost?.title?.rendered }</h1>

                { latestPost?.meta?.subtitle &&
                  <p className="front-cover-post-subtitle primary-lightest">{ latestPost.meta.subtitle }</p>
                }

                { latestPost?.excerpt?.rendered &&
                  <div className="front-cover-post-excerpt">
                    { parse(latestPost?.excerpt?.rendered) }
                  </div>
                }

                <a className="more" href="#">+Continue reading</a>

                <hr/>

                { latestPost?.categories && latestPost?.categories.length > 0 && (
                  <div className="termlist">
                    <ul className="nolist">
                      { Object.entries(latestPost.categories).map( ([index, category]) => {

                        if(category?.id) {
                          let termClassNames = clsx(
                            category?.slug && 'termlist-term-' + category.slug,
                            category?.id === latestPost?.meta?._primary_term_category && 'termlist-term-primary',
                          );

                          return (
                            <li className={ termClassNames }><a href="#">{ category?.name }</a></li>
                          );
                        }
                      })}
                    </ul>
                  </div>
                )}

              </div>
            ) }

            <div className="front-cover-column">
              <div className="front-cover-column-inner">
                { pages?.about && (
                  <div className="front-cover-column-block">
                    <h3>{ pages?.about?.title?.rendered }</h3>
                    { parse(pages?.about?.excerpt?.rendered || '') }

                    <a className="more" href="#">+Learn more</a>
                  </div>
                )}

                { pages?.podcast && latestPodcasts.length > 0 && (
                  <div className="front-cover-column-block">
                    <h3>{ pages?.podcast?.title?.rendered }</h3>
                    { parse(pages?.podcast?.excerpt?.rendered || '') }

                    <div className="podcast-playlist card-opaque inner inner-zero-y inner-small">
                      <ul className="nolist">
                        { Object.entries(latestPodcasts).map( ([index, podcast]) => (
                          <li>
                            <a href="#">
                              <time className="masthead-date" dateTime={ podcast?.date }>
                                { dateI18n( formats.date, podcast?.date ) }
                              </time>
                              <h4 className="section-title">{ parse(podcast?.title?.rendered) }</h4>
                            </a>
                            <div className="block audioplay">
                              <IconPlay />
                              <span className="visually-hidden">Play episode</span>
                            </div>
                          </li>
                          ))}
                      </ul>
                    </div>

                    <a className="more" href="#">+See all episodes</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
