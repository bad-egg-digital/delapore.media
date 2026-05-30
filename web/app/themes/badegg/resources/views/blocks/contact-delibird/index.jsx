import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';
import Delibird from '@views/components/Delibird/Delibird';

import { useBlockProps } from '@wordpress/block-editor';

registerBlockType(metadata.name, {
  edit() {
    const blockProps = useBlockProps();

    return (
      <div { ...blockProps }>
        <div className="contact-method-card contact-method-delibird card-opaque inner inner-small">
          <Delibird />
        </div>
      </div>
    );
  },
});
