'use client';

import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'center' | 'start';
}

export default function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`space-y-3 animate-fade-up ${
        isCentered ? 'text-center max-w-3xl mx-auto' : 'text-start max-w-2xl'
      }`}
    >
      {badge && (
        <div className={isCentered ? 'flex justify-center' : ''}>
          <span className="km-eyebrow">{badge}</span>
        </div>
      )}
      <h2 className="font-heading text-h2 text-km-ink">
        {title}
        {highlight ? (
          <>
            {' '}
            <span className="km-highlight">{highlight}</span>
          </>
        ) : null}
      </h2>
      {subtitle && (
        <p
          className={`text-body-fluid text-km-ink-muted km-measure ${
            isCentered ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
