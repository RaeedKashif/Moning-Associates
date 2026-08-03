import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CATEGORY_BY_SLUG } from './lib/propertyCategories.js';

// The property and blog pages used to be standalone .html files. Anyone still
// holding one of those links gets sent to the React route that replaced it.
function redirectLegacyPath() {
  const match = window.location.pathname.match(/\/([\w-]+)\.html$/);
  if (!match) return false;

  const slug = match[1];
  const target = CATEGORY_BY_SLUG[slug] ? `/${slug}`
    : slug === 'all-blogs' ? '/blogs'
    : null;
  if (!target) return false;

  window.location.replace(`/#${target}`);
  return true;
}

if (!redirectLegacyPath()) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
