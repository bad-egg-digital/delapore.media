import domReady from '@wordpress/dom-ready';
import blockParents from '../json/block-parents.json';
import blockWhitelist from '../json/block-core-whitelist.json';
import.meta.glob('../views/blocks/**/{index.jsx,index.js}', { eager: true })

domReady(() => {
  const restrictEditorParentBlocks = (settings, name) => {
    if (blockWhitelist.includes(name)) {
      settings.parent = blockParents;
    }

    return settings
  }

  const coreInnerBlocks = (settings, name) => {
    if (['core/media-text', 'core/details', 'core/quote'].includes(name)) {

      settings.allowedBlocks = [
        'core/paragraph',
        'core/heading',
        'core/list',
      ];
    }

    return settings;
  }

  wp.hooks.addFilter( 'blocks.registerBlockType', 'badegg/restrict-parent-blocks', restrictEditorParentBlocks );
  wp.hooks.addFilter( 'blocks.registerBlockType', 'badegg/core-inner-blocks', coreInnerBlocks );

});
