// block.json's editorScript, loaded only in the block editor
import './style.scss'
import clsx from 'clsx'
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';

import {
  useBlockProps,
  useInnerBlocksProps,
  InnerBlocks,
  InspectorControls,
} from '@wordpress/block-editor';

import {
	Panel,
	PanelBody,
	ToggleControl,
  __experimentalHStack as HStack,
  __experimentalHeading as Heading,
  __experimentalSpacer as Spacer,
} from '@wordpress/components';

import allowedBlocks from '@json/block-core-whitelist.json';
import { containerClassNames, sectionClassNames } from '@scripts/lib/classNames';
import BlockSettings from '@blocks/-editor/BlockSettings';
import BackgroundImage from '@views/components/BackgroundImage/BackgroundImage';

registerBlockType(metadata.name, {
  edit({ attributes, setAttributes, clientId, context: { postId } }) {

    const postType = wp.data.select( 'core/editor' ).getCurrentPostType();
    const blockProps = useBlockProps();

    blockProps.className = sectionClassNames(attributes, blockProps.className).join(' ');

    return (
      <section { ...blockProps }>
        <InspectorControls>
          <Panel className="badegg-components-panel">
            <BlockSettings
              attributes={ attributes }
              setAttributes={ setAttributes }
            />
          </Panel>
        </InspectorControls>

        <div className={ containerClassNames(attributes, []).join(' ') }>
          <div className="contact-methods-inner">
            <InnerBlocks
              allowedBlocks={[
                'badegg/contact-socials',
                'badegg/contact-method',
                'badegg/contact-platform',
                'badegg/contact-delibird',
              ]}
            />
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
