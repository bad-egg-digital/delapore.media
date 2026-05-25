// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
  RichText,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
  ToggleControl,
  TextControl,
  TextareaControl,
} from '@wordpress/components';

import {
  useSelect,
  useDispatch,
} from '@wordpress/data';

import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';
import Delibird from '@views/components/Delibird/Delibird';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const { editPost } = useDispatch('core/editor');
    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'), []);
    const postExcerpt = useSelect((select) => select('core/editor').getEditedPostAttribute('excerpt'), []);

    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    const {
      alignment,
      hideDelibird,
      enableSubtitle,
      subtitle,
    } = attributes;

    return (
      <div { ...blockProps }>
        <BlockControls>
          <AlignmentToolbar
            value={ alignment }
            onChange={(value) => setAttributes({alignment: value})}
          />
        </BlockControls>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Text", "badegg") }>
              <TextareaControl
                label={ __('Title', 'badegg') }
                value={ postTitle }
                onChange={ (newTitle) => {
                  wp.data.dispatch('core/editor').editPost({ title: newTitle });
                }}
                __nextHasNoMarginBottom
              />

              { enableSubtitle &&
                <TextareaControl
                  label={ __('Subtitle', 'badegg') }
                  value={ subtitle }
                  onChange={(value) => setAttributes({ subtitle: value }) }
                  __nextHasNoMarginBottom
                />
              }

              <TextareaControl
                label={ __('Excerpt', 'badegg') }
                value={ postExcerpt }
                onChange={ (newExcerpt) => {
                  wp.data.dispatch('core/editor').editPost({ excerpt: newExcerpt });
                }}
                __nextHasNoMarginBottom
              />

            </PanelBody>
            <PanelBody title={ __("Controls", "badegg") }>
              <ToggleControl
                label={ __('Enable Subtitle', 'badegg') }
                checked={ enableSubtitle }
                onChange={(value) => setAttributes({ enableSubtitle: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Delibird', 'badegg') }
                checked={ hideDelibird }
                onChange={(value) => setAttributes({ hideDelibird: value }) }
                __nextHasNoMarginBottom
              />
            </PanelBody>

            <BlockSettings
              attributes={ attributes }
              setAttributes={ setAttributes }
            />
          </Panel>
        </InspectorControls>

        <div className={ containerClassNames(attributes, []).join(' ') }>
          <div className={ `wp-block-badegg-title-layout ${ (!hideDelibird) ? 'has-delibird' : null }` }>
            <div className="wp-block-badegg-title-text">
              <RichText
                tagName="h1"
                value={ postTitle }
                placeholder={ __('Enter the title', 'badegg') }
                onChange={ (newTitle) => {
                  // Update the editor state with the new title
                  wp.data.dispatch('core/editor').editPost({ title: newTitle });
                }}
              />

              { enableSubtitle &&
                <RichText
                  tagName="p"
                  className="wp-block-badegg-title-subtitle"
                  value={ subtitle }
                  placeholder={ __('Enter the subtitle', 'badegg') }
                  onChange={ (newSubtitle) =>  setAttributes({ subtitle: newSubtitle }) }
                />
              }

              <div className="wp-block-badegg-title-excerpt">
                <RichText
                  tagName="p"
                  value={ postExcerpt }
                  placeholder={ __('Enter the excerpt/intro', 'badegg') }
                  onChange={ (newExcerpt) => {
                    // Update the editor state with the new title
                    wp.data.dispatch('core/editor').editPost({ excerpt: newExcerpt });
                  }}
                />
              </div>
            </div>

            { !hideDelibird &&
              <div className="wp-block-badegg-title-image">
                <Delibird />
              </div>
            }

          </div>
        </div>

      </div>
    );
  },
});
