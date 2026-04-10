// block.json's editorScript, loaded only in the block editor

import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { containerClassNames, sectionClassNames } from '../../../js/blocks/lib/classNames';

registerBlockType(metadata.name, {
  edit({ attributes }) {
    const blockProps = useBlockProps();

    blockProps.className = sectionClassNames(attributes, blockProps.className, ['bg-success', 'knockout']).join(' ');

    return (
      <div { ...blockProps }>
        <div className="container align-center wysiwyg">
          <h2>Bad Egg Block Example</h2>
        </div>
      </div>
    );
  }
});
