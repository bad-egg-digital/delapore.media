// block.json's editorScript, loaded only in the block editor
import './style.scss'
import clsx from 'clsx'
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import parse from "html-react-parser"
import IconPlay from '@images/circle-play-solid-full.svg?react'
import AttachmentImage from "@blocks/-editor/AttachmentImage"

import {
  useBlockProps,
  useInnerBlocksProps,
  InnerBlocks,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	ToggleControl,
  TextControl,
  Button,
  __experimentalHStack as HStack,
  __experimentalHeading as Heading,
  __experimentalSpacer as Spacer,
} from '@wordpress/components';

import allowedBlocks from '@json/block-core-whitelist.json';
import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';
import BackgroundImage from '@views/components/BackgroundImage/BackgroundImage';
import ArticleTOC from '@blocks/article/ArticleTOC';
import ArticleProduct from '@blocks/article/ArticleProduct';
import Delibird from '@views/components/Delibird/Delibird';
import AudioPlay from '@views/components/AudioPlay/AudioPlay';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId, context: { postId } }) {

    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const blockProps = useBlockProps();
    const [ h2s, setH2s ] = useState([]);
    const dispatch = useDispatch('core/editor');

    const {
      alignment,
      tocLabel,
      sidebarSwitch,
      hideSidebar,
      hideTOC,
      hideDelibird,
    } = attributes;

    const innerBlocks = useSelect(
      (select) => select('core/block-editor').getBlocks(clientId),
      [clientId]
    );

    useEffect(() => {
      const filtered = innerBlocks.filter(
        (block) => block.name === 'core/heading' && block.attributes.level === 2
      );

      setH2s(filtered);
    }, [ innerBlocks ]);

    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    const [ meta, setMeta ] = useEntityProp(
      'postType',
      postType,
      'meta',
      postId
    );

    const [ audioFile, setAudioFile ] = useState({});
    const [ coverFile, setCoverFile ] = useState({});

    useEffect(() => {
      if (postType === 'podcast' && meta?.podcast_audio_id) {
        fetch(`/wp-json/wp/v2/media/${meta?.podcast_audio_id}`)
          .then(response => response.json())
          .then(media => {
            setAudioFile(media);
          })
          .catch(error => console.error('Error fetching media:', error));
      }

      if (postType === 'product' && meta?.product_cover_id) {
        fetch(`/wp-json/wp/v2/media/${meta?.product_cover_id}`)
          .then(response => response.json())
          .then(media => {
            setCoverFile(media);
          })
          .catch(error => console.error('Error fetching media:', error));
      }
    }, [ meta ])

    console.log(coverFile);

    return (
      <section { ...blockProps }>
        <BlockControls>
          <AlignmentToolbar
            value={ alignment }
            onChange={(value) => setAttributes({alignment: value})}
          />
        </BlockControls>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            { !hideSidebar &&
              <PanelBody title={ __('Sidebar', 'badegg') }>
                { !hideTOC &&
                  <TextControl
                    label={ __('Table of Contents Heading', 'badegg') }
                    value={ tocLabel }
                    onChange={(value) => setAttributes({ tocLabel: value }) }
                    __next40pxDefaultSize
                  />
                }

                { postType === 'product' &&
                  <>
                    <Spacer margin="4" />

                    { 'link' in coverFile &&
                      <>
                        <Heading level="3" style={{ fontWeight: 'bold' }}>
                          { coverFile?.title?.rendered }
                        </Heading>

                        <AttachmentImage imageId={ coverFile?.id } />
                      </>
                    }

                    <MediaUploadCheck>
                      <MediaUpload
                        onSelect={ (media) => {
                          setMeta({
                            ...meta,
                            product_cover_id: media?.id || 0,
                          });
                          setCoverFile( media || {} );
                        }}
                        allowedTypes={ ['image'] }
                        value={ meta?.product_cover_id }
                        render={ ({ open }) => (
                          <>
                            <Spacer />

                            <Button
                              onClick={ open }
                              variant="secondary"
                            >
                              { __("Select File", "badegg") }
                            </Button>

                            { meta?.product_cover_id != 0 && (
                              <Button
                                onClick={ () => {
                                  setMeta({
                                    ...meta,
                                    product_cover_id: 0,
                                  });
                                  setCoverFile({});
                                }}
                                isDestructive
                                variant="secondary"
                                style={{ marginLeft: 8 }}
                              >
                                { __("Remove", "badegg") }
                              </Button>
                            )}
                          </>
                        )}
                      />
                    </MediaUploadCheck>

                    <Spacer />

                    <TextControl
                      label={ __('Price', 'badegg') }
                      value={ meta?.product_price }
                      onChange={(value) => setMeta({
                        ...meta,
                        product_price: value
                       })}
                      __next40pxDefaultSize
                      __nextHasNoMarginBottom
                    />

                    { meta?.product_price &&
                      <TextControl
                        label={ __('Discounted Price', 'badegg') }
                        value={ meta?.product_price_discount }
                        onChange={(value) => setMeta({
                          ...meta,
                          product_price_discount: value
                        })}
                        __next40pxDefaultSize
                        __nextHasNoMarginBottom
                      />
                    }

                    <TextControl
                      label={ __('Where to buy', 'badegg') }
                      value={ meta?.product_offsite_url }
                      type="url"
                      placeholder="https://..."
                      onChange={ (value) => setMeta({
                        ...meta,
                        product_offsite_url: value
                      })}
                      __next40pxDefaultSize
                      __nextHasNoMarginBottom
                    />

                  </>
                }

                { postType === 'podcast' &&
                  <>
                    <Spacer margin="4" />

                    { 'id' in audioFile &&
                      <>
                        <Heading level="3" style={{ fontWeight: 'bold' }}>
                          { audioFile?.title?.rendered }
                        </Heading>

                        { audioFile?.description?.rendered ? (
                          <>
                            { parse( audioFile?.description?.rendered ) }
                          </>
                        ) : (
                          <audio controls>
                            <source src={ audioFile?.url } type={ audioFile?.['mime_type'] } />
                          </audio>
                        )}
                      </>
                    }

                    <MediaUploadCheck>
                      <MediaUpload
                        onSelect={ (media) => {
                          setMeta({
                            ...meta,
                            podcast_audio_id: media?.id || 0,
                          });
                          setAudioFile( media || {} );
                        }}
                        allowedTypes={ ['audio/mpeg'] }
                        value={ meta?.podcast_audio_id }
                        render={({ open }) => (
                          <>
                            <Spacer />

                            <Button
                              onClick={ open }
                              variant="secondary"
                            >
                              { __("Select File", "badegg") }
                            </Button>

                            { meta?.podcast_audio_id != 0 && (
                              <Button
                                onClick={ () => {
                                  setMeta({
                                    ...meta,
                                    podcast_audio_id: 0,
                                  });
                                  setAudioFile({});
                                }}
                                isDestructive
                                variant="secondary"
                                style={{ marginLeft: 8 }}
                              >
                                { __("Remove", "badegg") }
                              </Button>
                            )}
                          </>
                        )}
                      />
                    </MediaUploadCheck>
                  </>
                }
              </PanelBody>
            }

            <PanelBody title={ __('Controls', 'badegg') }>
              <ToggleControl
                label={ __('Hide Sidebar', 'badegg') }
                checked={ hideSidebar }
                onChange={(value) => setAttributes({ hideSidebar: value }) }
                __nextHasNoMarginBottom
              />

              { !hideSidebar &&
                <>
                  <ToggleControl
                    label={ __('Switch Sides', 'badegg') }
                    checked={ sidebarSwitch }
                    onChange={(value) => setAttributes({ sidebarSwitch: value }) }
                    __nextHasNoMarginBottom
                  />
                  <ToggleControl
                    label={ __('Hide Table of Contents', 'badegg') }
                    checked={ hideTOC }
                    onChange={(value) => setAttributes({ hideTOC: value }) }
                    __nextHasNoMarginBottom
                  />
                  <ToggleControl
                    label={ __('Hide Delibird', 'badegg') }
                    checked={ hideDelibird }
                    onChange={(value) => setAttributes({ hideDelibird: value }) }
                    __nextHasNoMarginBottom
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

        <button
          className="badegg-article-select-parent"
          onClick={() => {
            wp.data.dispatch('core/block-editor').selectBlock(clientId);
          }}
        >
          <span className="visually-hidden">Select Block</span>
        </button>

        <div className={ containerClassNames(attributes, []).join(' ') }>
          <div className="article-layout">

            <div className="article-main badegg-block-list wysiwyg">
              <InnerBlocks
                allowedBlocks={ allowedBlocks }
                defaultBlock={
                  {
                    name: "core/paragraph",
                    attributes: {
                      placeholder: "start typing",
                    }
                  }
                }
              />
            </div>

            { !hideSidebar &&
              <aside className={ clsx(
                'article-sidebar',
                sidebarSwitch && 'article-sidebar-switch',
                postType && 'article-sidebar-' + postType,
              )}>
                <div className="article-sidebar-inner">
                  { !hideTOC &&
                    <ArticleTOC
                      label={ tocLabel }
                      headings={ h2s }
                      stickyTop={ 32 }
                    />
                  }

                  { postType === 'product' && 'source_url' in coverFile &&
                    <ArticleProduct
                      coverSrc={ coverFile.source_url }
                      price={ meta?.product_price }
                      discount={ meta?.product_price_discount }
                      link={ meta?.product_offsite_url }
                      editor={ true }
                    />
                  }

                  { postType === 'podcast' && audioFile &&
                    <div className={ clsx(
                      'article-sidebar-block',
                      'article-sidebar-block-podcast',
                      'inner',
                      'inner-small',
                    )}>

                      <div
                        className="audioplay"
                        aria-label="Play podcast episode audio"
                      >
                        <IconPlay />
                        <span>Play Episode</span>
                        <small>{ audioFile?.media_details?.length_formatted }</small>
                      </div>

                    </div>
                  }
                </div>

                { !hideDelibird &&
                  <Delibird variant={ postType } />
                }
              </aside>
            }

          </div>
        </div>

        <BackgroundImage { ...attributes } isAdmin={ true } />
      </section>
    );
  },
  save() {
    return  <InnerBlocks.Content />
  }
});
