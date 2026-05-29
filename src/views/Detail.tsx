import { useParams, Link } from 'react-router-dom';
import NavBarDetail from '@/components/NavBarDetail';
import CardDetail from '@/components/CardDetail';

export default function Detail() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div role="alert" className="scanner-card-frame rounded-lg bg-scanner-panel border border-scanner p-6">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-mono text-scanner-dim/60">NO CARD ID PROVIDED</span>
          <Link to="/" className="btn btn-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs">
            RETURN TO DATABASE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NavBarDetail />
      <CardDetail id={id} />
    </div>
  );
}
