// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';

import {
	Panel,
	PanelBody,
	ToggleControl,
  TextControl,
  TextareaControl,
  DateTimePicker,
  CheckboxControl,
} from '@wordpress/components';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const { formats } = getSettings();
    const { editPost } = useDispatch('core/editor');

    const postDate = useSelect((select) => select('core/editor').getEditedPostAttribute('date'), []);
    const postTitle = useSelect((select) => select('core/editor').getEditedPostAttribute('title'), []);

    const {
      titlePrefix,
      attribution,
      hideTitlePrefix,
      hideDate,
      hideAttribution,
    } = attributes;

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody>
              { !hideTitlePrefix &&
                <TextControl
                  label={ __('Title Prefix', 'badegg') }
                  value={ titlePrefix }
                  onChange={(value) => setAttributes({ titlePrefix: value }) }
                  __nextHasNoMarginBottom
                />
              }

              <TextareaControl
                label={ __('Title', 'badegg') }
                value={ postTitle }
                onChange={ (newTitle) => {
                  wp.data.dispatch('core/editor').editPost({ title: newTitle });
                }}
              />

              { !hideAttribution &&
                <TextControl
                  label={ __('Attribution', 'badegg') }
                  value={ attribution }
                  onChange={(value) => setAttributes({ attribution: value }) }
                  __nextHasNoMarginBottom
                />
              }

            </PanelBody>
            <PanelBody title={ __('Controls', 'badegg') }>
              <ToggleControl
                label={ __('Hide Prefix', 'badegg') }
                checked={ hideTitlePrefix }
                onChange={(value) => setAttributes({ hideTitlePrefix: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Date', 'badegg') }
                checked={ hideDate }
                onChange={(value) => setAttributes({ hideDate: value }) }
                __nextHasNoMarginBottom
              />
              <ToggleControl
                label={ __('Hide Attribution', 'badegg') }
                checked={ hideAttribution }
                onChange={(value) => setAttributes({ hideAttribution: value }) }
                __nextHasNoMarginBottom
              />
            </PanelBody>
            <PanelBody title={ __('Publish Date', 'badegg') } initialOpen={ false }>
              { !hideDate &&
                <DateTimePicker
                  currentDate={ postDate }
                  onChange={ (date) => {
                    editPost({ date: date });
                  }}
                />
              }
            </PanelBody>
          </Panel>
        </InspectorControls>

        { (!hideTitlePrefix || !hideDate) &&
          <div className={ `entry-meta ${ (!hideTitlePrefix && titlePrefix) ? 'has-prefix' : '' }` }>
            { !hideTitlePrefix &&
              <RichText
                tagName="p"
                className="podcast-title-prefix"
                value={ titlePrefix }
                placeholder="Episode Number"
                onChange={(value) => setAttributes({ titlePrefix: value }) }
              />
            }

            { !hideDate &&
              <time dateTime={ postDate }>
                { dateI18n( formats.date, postDate ) }
              </time>
            }
          </div>
        }

        <RichText
          tagName="h1"
          value={ postTitle }
          placeholder="Enter the post title..."
          onChange={ (newTitle) => {
            // Update the editor state with the new title
            wp.data.dispatch('core/editor').editPost({ title: newTitle });
          }}
        />

        { !hideAttribution &&
          <RichText
            tagName="p"
            className="podcast-title-subtitle"
            value={ attribution }
            placeholder="Enter the author name..."
            onChange={(value) => setAttributes({ attribution: value }) }
          />
        }

      </div>
    );
  },
});
