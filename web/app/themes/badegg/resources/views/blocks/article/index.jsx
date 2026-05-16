// block.json's editorScript, loaded only in the block editor
import './style.scss'

import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

import {
  useBlockProps,
  useInnerBlocksProps,
  InnerBlocks,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	ToggleControl,
  TextControl,
} from '@wordpress/components';

import allowedBlocks from '@json/block-core-whitelist.json';
import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';
import BackgroundImage from '@views/components/BackgroundImage/BackgroundImage';
import ArticleTOC from '@blocks/article/ArticleTOC'
import Delibird from '@views/components/Delibird/Delibird'

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps();
    const [ h2s, setH2s ] = useState([]);

    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    const {
      alignment,
      sidebar,
      tocLabel,
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
    }, [innerBlocks]);

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
            <PanelBody>
              <ToggleControl
                label={ __('Show Sidebar', 'badegg') }
                checked={ sidebar }
                onChange={(value) => setAttributes({ sidebar: value }) }
                __nextHasNoMarginBottom
              />

              { sidebar &&
                <TextControl
                  label={ __('Table of Contents Heading', 'badegg') }
                  value={ tocLabel }
                  onChange={(value) => setAttributes({ tocLabel: value }) }
                />
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

            { sidebar &&
              <aside className="article-sidebar">
                <ArticleTOC
                  label={ tocLabel }
                  headings={ h2s }
                  stickyTop={ 32 }
                />
                <Delibird />
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
