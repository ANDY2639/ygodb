export default function NavBarDetail() {
  return (
    <div role="tablist" className="tabs tabs-boxed bg-scanner-card border border-scanner p-1">
      <a role="tab" className="tab tab-active text-cyan-600 dark:text-cyan-400 font-mono text-xs">Detail</a>
      <a role="tab" className="tab text-scanner-dim font-mono text-xs">Sets</a>
      <a role="tab" className="tab text-scanner-dim font-mono text-xs">Prices</a>
    </div>
  );
}
