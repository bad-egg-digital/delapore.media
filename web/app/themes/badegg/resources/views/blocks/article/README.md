# Bad Egg's Article Builder

Designed as a full width component, Article Builder bundles core wordpress blocks commonly used in articles into a classic editor like experience. 

## Features
- Uses the `<InnerBlocks/>` component with a whitelist defined in `resources/json/core-block-whitelist.json`
- Provides spacing and background configuration options 
- Default block attributes are defined in `resources/json/block-attributes.json` so that they are not needed in duplicate in `block.json`
- A reusable customisation UI is defined in `resources/js/blocks/components/BlockSettings.jsx` so that multiple blocks can rely on the same controls 

## Theme-level changes
- All core wordpress blocks are disabled at the top level to prevent them from being used alongside full-width blocks designed to craft page layouts
- Blocks that can use core whitelisted inner blocks are defined in `resources/json/block-parents.json`

## Attributes
- Top Padding
- Bottom Padding
- Container width
- Background
  - Colour
  - Tint
  - Image
  - Image opacity
  - Text contrast toggle
  - Fixed position toggle
