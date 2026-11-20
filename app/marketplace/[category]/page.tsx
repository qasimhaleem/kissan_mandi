import React from 'react';
import MarketplacePage from '../page';

export default async function CategoryMarketplacePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  
  // Format category slug to Title Case (e.g. "vegetables" -> "Vegetables")
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  return <MarketplacePage initialCategory={formattedCategory} />;
}
