import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import { wordpressPlugin, wordpressThemeJson } from '@roots/vite-plugin';
import fg from 'fast-glob';
import path from 'path';

function blockAsset(file)
{
  const files = fg.sync(`resources/views/blocks/**/${file}`, { deep: 2 });
  let list = {};

  files.forEach(file => {
    const parts = file.split(path.sep);
    const fileName = parts[parts.length - 1];
    const extension = fileName.split('.').pop();
    const blockName = parts[parts.length - 2];

    list[`blocks/${blockName}/${fileName.replace('.' + extension, '')}`] = `resources/views/blocks/${blockName}/${fileName}`;
  });

  return list;
}

const editorStyle = blockAsset('editor.scss');
const script = blockAsset('script.js');
const viewScript = blockAsset('view.js');
const style = blockAsset('style.scss');

export default defineConfig({
  base: '/app/themes/badegg/public/build/',
  plugins: [
    laravel({
      input: {
        'css/app': 'resources/css/app.scss',
        'js/app': 'resources/js/app.js',
        'css/editor': 'resources/css/editor.scss',
        'js/editor': 'resources/js/editor.js',
        ...editorStyle,
        ...viewScript,
        ...script,
        ...style,
      },
      refresh: true,
      url: process.env.APP_URL,
    }),

    wordpressPlugin(),

    // Generate the theme.json file in the public/build/assets directory
    // based on the Tailwind config and the theme.json file from base theme folder
    wordpressThemeJson({
      disableTailwindColors: true,
      disableTailwindFonts: true,
      disableTailwindFontSizes: true,
    }),
  ],
  resolve: {
    alias: {
      '@scripts': '/resources/js',
      '@styles': '/resources/css',
      '@fonts': '/resources/fonts',
      '@images': '/resources/images',
    },
  },
})
