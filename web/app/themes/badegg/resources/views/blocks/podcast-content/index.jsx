import './style.scss'

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import parse from "html-react-parser"

import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { Panel, PanelBody } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, context: { postType, postId } }) {
    const blockProps = useBlockProps();

    const [ meta, updateMeta ] = useEntityProp(
      'postType',
      'podcast',
      'meta',
      postId
    );

    const {
      hideCategories,
      hideDate,
    } = attributes;

    const { podcast_content } = meta;

    return (
      <div { ...blockProps }>

        <InspectorControls>
          <Panel className="badegg-components-panel">
            <PanelBody>
              <p>The content that was imported from the RSS feed. Replace this block if you'd like to override it.</p>
            </PanelBody>
          </Panel>
        </InspectorControls>

        <div className="wysiwyg">
          { parse( podcast_content ) }
        </div>
      </div>
    );
  },
});
