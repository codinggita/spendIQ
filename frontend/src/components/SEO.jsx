import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  name = 'SpendIQ', 
  type = 'website',
  image = 'https://spendiq.vercel.app/og-image.png' // Default OG image path
}) => {
  const siteTitle = title ? `${title} | ${name}` : name;
  const siteDescription = description || 'SpendIQ - Smart Expense Tracking & Financial Insights. Manage your money efficiently with automated SMS parsing and beautiful analytics.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={siteDescription} />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
