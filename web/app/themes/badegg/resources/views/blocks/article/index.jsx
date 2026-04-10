// block.json's editorScript, loaded only in the block editor

import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

import allowedBlocks from '../../../json/block-core-whitelist.json';
import { containerClassNames, sectionClassNames } from '../../../js/blocks/lib/classNames';
import BackgroundImage from '../../../js/blocks/components/BackgroundImage';
import BlockSettings from '../../../js/blocks/components/BlockSettings';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();

    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    const {
      alignment,
      sidebar,
    } = attributes;

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
            <PanelBody title={ __("Hello", "badegg") }>
              <ToggleControl
                label={ __('Show Sidebar', 'badegg') }
                checked={ sidebar }
                onChange={(value) => setAttributes({ sidebar: value }) }
                __nextHasNoMarginBottom
              />
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

            <div className="article-main wysiwyg">
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

            { sidebar ? (
              <div className="article-sidebar">
                <div className="article-toc js-article-toc"></div>
              </div>
            ) : null }

          </div>
        </div>


        <BackgroundImage { ...attributes } />
      </section>
    );
  },
  save({ attributes }) {
    const blockProps = useBlockProps.save();
    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    return (
      <div { ...blockProps }>
        <div className={ containerClassNames(attributes).join(' ') } >
          <div className="article-layout">
            <div className="article-main wysiwyg">
              <InnerBlocks.Content />
            </div>
            { attributes.sidebar ? (
              <div className="article-sidebar">
                <div className="article-toc js-article-toc"></div>
              </div>
            ) : null }
          </div>
        </div>

        <BackgroundImage { ...attributes } />
      </div>
    )
  }
});
