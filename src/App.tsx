import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar';

export default function App() {
  return (
    <div className="min-h-screen bg-scanner-deep">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-scanner-glow/5 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-scanner-glow/20 to-transparent"></div>
      </div>
      <NavBar />
      <main className="container mx-auto px-4 pt-20 pb-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
