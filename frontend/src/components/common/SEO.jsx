import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = 'KSI Digital Pattern';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'KSI Digital Pattern - منصة لتعلم ومشاركة الباترونات الرقمية والخياطة.';
  const defaultImage = '/logo.png'; // Make sure this exists

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Facebook / Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};

export default SEO;
