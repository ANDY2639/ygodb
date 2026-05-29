import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CardDisplay } from '@/hooks/useCards';

export default function Card({ card }: { card: CardDisplay }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23f1f5f9"/%3E%3Cstop offset="100%25" stop-color="%23e2e8f0"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="200" height="280" rx="4"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%230891b2" font-size="10" font-family="monospace"%3ENO SIGNAL%3C/text%3E%3C/svg%3E';
    setImageLoaded(true);
  };

  return (
    <Link
      to={`/detail/${card.id}`}
      className="scanner-gallery-item group block relative"
    >
      <div className="scanner-target-frame">
        <div className="scanner-target-corner scanner-target-corner-tl"></div>
        <div className="scanner-target-corner scanner-target-corner-tr"></div>
        <div className="scanner-target-corner scanner-target-corner-bl"></div>
        <div className="scanner-target-corner scanner-target-corner-br"></div>
        <div className="scanner-target-scanline"></div>
        <div className="scanner-target-bottom-bar"></div>
        <div className="scanner-target-pulse"></div>
      </div>

      <figure className="relative overflow-hidden">
        <img
          src={card.image || ''}
          alt={card.name}
          className={`w-full h-auto block transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110 group-focus:brightness-110 group-focus:contrast-110 ${!imageLoaded ? 'opacity-0' : ''}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-scanner-panel scanner-image-placeholder">
            <div className="scanner-loader-mini">
              <div className="scanner-loader-mini-ring"></div>
              <div className="scanner-loader-mini-ring"></div>
              <div className="scanner-loader-mini-core"></div>
            </div>
          </div>
        )}
      </figure>
    </Link>
  );
}
