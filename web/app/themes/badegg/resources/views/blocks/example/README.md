# Bad Egg's Native Wordpress Block Example

This block serves as a placeholder that can be copied and extended to build native Wordpress blocks.  

## Features
- Automatic registration and asset building through the theme's `app/blocks.php` file and `vite.config.js`
- Automatic enqueueing of block scripts and styles if the correct files are included in the block's directory 
- Supports Laravel Blade templates if the `render.blade.php` file is present, with access to the `$attributes`, `$block`, and `$content` variables.
- Default block attributes are defined in `resources/json/block-attributes.json` so that they are not needed in duplicate in `block.json`
- A reusable customisation UI is defined in `resources/js/blocks/components/BlockSettings.jsx` so that multiple blocks can rely on the same controls 

## Directory Structure
```
app
│   ...
│
│   blocks.php  ->  this is where the auto registration functions live
│
resources
│   ...
│
└── js
│   └── editor.js
│
└── views
    │   ...
    │
    └── blocks
        │   ...
        │
        └── example
            │  README.md         ->   this file
            │  block.json        ->   (required) the block's metadata
            │  index.jsx         ->   (required) EditorScript
            │  script.js         ->   (optional) Editor & Front end
            │  view.js           ->   (optional) Front end
            │  editor.scss       ->   (optional) Editor
            │  style.scss        ->   (optional) Editor & Front end
            │  render.blade.php  ->   (optional) falls back to index.jsx save
```
