import { ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ServiceImage({ src, alt, className = '', placeholderClassName = '' }) {
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    setHasLoadError(false);
  }, [src]);

  if (src && !hasLoadError) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setHasLoadError(true)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50 text-slate-400 ${className} ${placeholderClassName}`}>
      <ImageOff className="w-7 h-7 stroke-[1.5]" aria-hidden="true" />
      <span className="sr-only">Sin imagen disponible</span>
    </div>
  );
}
