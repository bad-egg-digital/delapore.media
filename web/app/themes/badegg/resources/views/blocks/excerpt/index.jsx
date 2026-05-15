// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { dateI18n, getSettings } from '@wordpress/date';

import {
  useBlockProps,
  InspectorControls,
  RichText,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
  TextareaControl,
  ToggleControl,
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
    const postExcerpt = useSelect((select) => select('core/editor').getEditedPostAttribute('excerpt'), []);

    const {
      dropCap,
    } = attributes;

    return (
      <div { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody title={ __("Text", "badegg") }>
              <TextareaControl
                label={ __('Excerpt', 'badegg') }
                value={ postExcerpt }
                onChange={ (newExcerpt) => {
                  wp.data.dispatch('core/editor').editPost({ excerpt: newExcerpt });
                }}
              />

              <ToggleControl
                label={ __('Drop Cap', 'badegg') }
                checked={ dropCap }
                onChange={(value) => setAttributes({ dropCap: value }) }
                __nextHasNoMarginBottom
              />

            </PanelBody>
          </Panel>
        </InspectorControls>

        <div className="wp-block-badegg-title-excerpt">
          <RichText
            className={ (dropCap) ? 'has-drop-cap' : null }
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
    );
  },
});
