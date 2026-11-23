'use client';

import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`space-y-3 ${
        isCentered ? 'text-center max-w-2xl mx-auto' : 'text-start max-w-2xl'
      }`}
    >
      {badge && <span className="km-badge">{badge}</span>}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-km-ink tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-km-ink-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
