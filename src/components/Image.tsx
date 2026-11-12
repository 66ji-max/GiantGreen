import { useState } from 'react';
import { cn } from '../lib/utils';
import { Sparkles } from 'lucide-react';

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
}

export default function Image({
  src,
  alt,
  className,
  fallbackColor = 'bg-soft-sand/30',
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If there's an error or no src, render an aesthetically refined luxury placeholder
  if (error || !src) {
    return (
      <div
        className={cn(
          'relative w-full h-full min-h-[160px] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden border border-soft-sand/40',
          fallbackColor,
          className
        )}
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2A1C14_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Subtle luxury corner accents */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-champagne/40" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-champagne/40" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-champagne/40" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-champagne/40" />

        <div className="relative z-10 flex flex-col items-center max-w-xs">
          <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center mb-3 text-warm-bronze">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-warm-bronze mb-1">
            JYANTY Luxury Amenity
          </span>
          <p className="font-serif text-charcoal/80 text-base italic leading-snug line-clamp-2">
            {alt || 'Refined Hotel Amenity System'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse flex items-center justify-center bg-soft-sand/20',
            fallbackColor
          )}
        />
      )}
      <img
        src={src}
        alt={alt || 'GiantGreen EcoTech'}
        loading="lazy"
        className={cn(
          'w-full h-full object-cover transition-opacity duration-700 ease-in-out',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
