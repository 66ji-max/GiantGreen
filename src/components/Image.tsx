import { useState } from 'react';
import { cn } from '../lib/utils';

interface ImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackColor?: string;
}

export default function Image({ src, alt, className, fallbackColor = 'bg-soft-sand', ...props }: ImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className={cn(`w-full h-full flex flex-col items-center justify-center text-charcoal/40 text-sm p-4 text-center ${fallbackColor}`, className)}>
        {alt || 'Image'}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && <div className={cn(`absolute inset-0 animate-pulse ${fallbackColor}`)} />}
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0')}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}
