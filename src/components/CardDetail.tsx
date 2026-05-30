import { useCardDetail } from '@/hooks/useCardDetail';

interface CardDetailProps {
  id: string;
}

export default function CardDetail({ id }: CardDetailProps) {
  const { data: card, isLoading, error } = useCardDetail(id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23f1f5f9"/%3E%3Cstop offset="100%25" stop-color="%23e2e8f0"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="200" height="280" rx="8"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%230891b2" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  if (isLoading) {
    return (
      <div className="scanner-loading-status min-h-[400px]">
        <div className="scanner-loader">
          <div className="scanner-loader-ring"></div>
          <div className="scanner-loader-ring"></div>
          <div className="scanner-loader-ring"></div>
          <div className="scanner-loader-core"></div>
        </div>
        <span className="scanner-loading-label">RETRIEVING DATA</span>
      </div>
    );
  }

  if (!isLoading && card) {
    return (
      <div className="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <figure className="shrink-0 mx-auto md:mx-0">
            <img
              src={card.image || ''}
              alt={card.name}
              className="rounded-lg w-full landscape:w-full landscape:max-w-sm md:max-w-xs lg:max-w-md border border-scanner"
              onError={handleImageError}
            />
          </figure>
          <div className="flex-1 space-y-4">
            <div className="scanner-card-frame rounded-lg bg-scanner-card border border-scanner overflow-hidden">
              <h3 className="text-sm font-bold text-cyan-400 text-center py-2 px-3 border-b border-scanner font-mono">
                INFORMATION
              </h3>
              <table className="table table-sm w-full">
                {(!['spell', 'trap'].includes(card.frameType)) ? (
                  <>
                    <tr className="border-b border-scanner/50">
                      <td className="font-medium w-1/3 text-scanner-label font-mono text-xs">ATTRIBUTE</td>
                      <td className="text-scanner-text font-mono text-sm">{card.attribute}</td>
                    </tr>
                    <tr className="border-b border-scanner/50">
                      <td className="font-medium text-scanner-label font-mono text-xs">TYPES</td>
                      <td className="text-scanner-text font-mono text-sm">{card.type}</td>
                    </tr>
                    {card.level && (
                      <tr className="border-b border-scanner/50">
                        <td className="font-medium text-scanner-label font-mono text-xs">LEVEL</td>
                        <td className="text-scanner-text font-mono text-sm">{card.level}</td>
                      </tr>
                    )}
                    <tr className="border-b border-scanner/50">
                      <td className="font-medium text-scanner-label font-mono text-xs">ATK</td>
                      <td className="text-cyan-400 font-mono text-sm font-bold">{card.attack}</td>
                    </tr>
                    {card.defense && (
                      <tr>
                        <td className="font-medium text-scanner-label font-mono text-xs">DEF</td>
                        <td className="text-cyan-400 font-mono text-sm font-bold">{card.defense}</td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td className="font-medium w-1/3 text-scanner-label font-mono text-xs">PROPERTY</td>
                    <td className="text-scanner-text font-mono text-sm">{card.race}</td>
                  </tr>
                )}
              </table>
            </div>
            <div className="scanner-card-frame rounded-lg bg-scanner-card border border-scanner overflow-hidden">
              <h3 className="text-sm font-bold text-cyan-400 text-center py-2 px-3 border-b border-scanner font-mono">
                CARD INFO
              </h3>
              <div
                className="p-4 text-sm text-scanner-text whitespace-pre-line text-justify font-mono leading-relaxed"
                dangerouslySetInnerHTML={{ __html: card.description }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !card && !error) {
    return (
      <div role="alert" className="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
            <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
            <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
            <div className="w-1 h-4 bg-scanner-glow/30 rounded signal-bar"></div>
          </div>
          <span className="text-sm font-mono text-scanner-label">NO DATA FOUND</span>
          <span className="text-xs font-mono text-scanner-muted">Card not found in database</span>
          <a href="/" className="btn btn-sm bg-scanner-glow/10 border border-scanner-glow/30 text-scanner-glow hover:bg-scanner-glow/20 font-mono text-xs">
            RETURN TO DATABASE
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="scanner-card-frame rounded-lg bg-scanner-panel border border-red-500/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 pulse-dot"></div>
          <span className="text-sm font-mono text-red-500">SYSTEM ERROR</span>
        </div>
         <p className="text-xs font-mono text-scanner-label mt-2">{error.message}</p>
        <button
          className="btn btn-sm mt-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 font-mono text-xs"
          onClick={() => window.location.reload()}
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return null;
}
