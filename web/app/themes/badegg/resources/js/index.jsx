// import.meta.glob([
//   '../images/**',
//   '../fonts/**',
// ]);

// import Header from '../views/sections/header/header.js';
// import LazyLoad from './lib/Lazy.js';
// import { bgSrcset } from './lib/bgSrcset.js';
// import BadEggLightbox from './lib/BadEggLightbox';
// import ArticleTOC from './components/ArticleTOC.js';

// Header();
// bgSrcset();
// LazyLoad();
// BadEggLightbox();
// ArticleTOC();

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
