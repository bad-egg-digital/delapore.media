import { Helmet } from 'react-helmet-async'

export default function Metadata( props ) {
  const {
    blogname,
    title,
    description,
    canonicalUri,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth,
    ogImageHeight,
  } = props;

  return (
    <Helmet>
      <title>{ title }</title>
      <meta name="description" content={ description } />
      <link rel="canonical" href={ canonicalUri } />
      <meta name="robots" content="max-image-preview:large" />

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ ogTitle } />
      <meta property="og:description" content={ ogDescription } />
      <meta property="og:url" content={ canonicalUri } />
      <meta property="og:site_name" content={ blogname } />

      { ogImage ?
        <>
          <meta property="og:image" content={ ogImage } />
          <meta property="og:image:width" content={ ogImageWidth || 1200 } />
          <meta property="og:image:height" content={ ogImageHeight || 630 } />
        </>
      : null }

    </Helmet>
  );
}
