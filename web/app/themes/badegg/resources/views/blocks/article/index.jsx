// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { useEntityProp } from '@wordpress/core-data';
import parse from "html-react-parser"

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
import ArticleTOC from '@blocks/article/ArticleTOC'
import Delibird from '@views/components/Delibird/Delibird'

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

    const { podcast_audio_id } = meta;
    const [ audioFile, setAudioFile ] = useState({});

    useEffect(() => {
      if (postType === 'podcast' && podcast_audio_id) {
        fetch(`/wp-json/wp/v2/media/${podcast_audio_id}`)
          .then(response => response.json())
          .then(media => {
            setAudioFile(media);
          })
          .catch(error => console.error('Error fetching media:', error));
      }
    }, [podcast_audio_id]);

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
                          setMeta({ podcast_audio_id: media?.id || 0 });
                          setAudioFile( media || {} );
                        }}
                        allowedTypes={ ['audio/mpeg'] }
                        value={ podcast_audio_id }
                        render={({ open }) => (
                          <>
                            <Spacer />

                            <Button
                              onClick={ open }
                              variant="secondary"
                            >
                              { __("Select File", "badegg") }
                            </Button>

                            { podcast_audio_id != 0 && (
                              <Button
                                onClick={ () => {
                                  setMeta({ podcast_audio_id: 0 });
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
              <aside className={ `article-sidebar${ sidebarSwitch ? ' article-sidebar-switch' : '' }` }>
                <div className="article-sidebar-switch">
                  { !hideTOC &&
                    <ArticleTOC
                      label={ tocLabel }
                      headings={ h2s }
                      stickyTop={ 32 }
                    />
                  }

                  { postType === 'podcast' &&
                    <h3>PODCAST!</h3>
                  }

                  { !hideDelibird &&
                    <Delibird />
                  }
                </div>
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
