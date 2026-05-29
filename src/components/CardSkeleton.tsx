export default function CardSkeleton({ count = 25 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, n) => (
        <div key={n} className="scanner-skeleton rounded-md overflow-hidden aspect-[200/280] relative">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="scanner-loader-mini">
              <div className="scanner-loader-mini-ring"></div>
              <div className="scanner-loader-mini-ring"></div>
              <div className="scanner-loader-mini-core"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
