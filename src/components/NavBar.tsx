import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [isDark, setIsDark] = useState(false);
  const [hasSavedPreference, setHasSavedPreference] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ygodb-theme');
    if (saved) {
      setHasSavedPreference(true);
      setIsDark(saved === 'dark');
      document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'dark' : 'light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Listen for system preference changes only if user hasn't saved an explicit preference
  useEffect(() => {
    if (hasSavedPreference) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [hasSavedPreference]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    setHasSavedPreference(true);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('ygodb-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="navbar bg-scanner-panel border-b border-scanner fixed top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-scanner-glow/10 border border-scanner-glow/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-scanner-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-scanner-glow pulse-dot"></div>
            </div>
            <div>
              <span className="text-lg font-bold text-scanner-text font-mono tracking-wider group-hover:text-scanner-glow transition-colors">YGODB</span>
              <span className="block text-[8px] text-scanner-dim/50 font-mono tracking-widest">CREATURE DATABASE</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[8px] font-mono text-scanner-dim/40">
            <div className="flex gap-0.5">
              <div className="w-1 h-2 bg-scanner-glow/30 rounded signal-bar"></div>
              <div className="w-1 h-2 bg-scanner-glow/30 rounded signal-bar"></div>
              <div className="w-1 h-2 bg-scanner-glow/30 rounded signal-bar"></div>
            </div>
            <span>SYS.ONLINE</span>
          </div>

          <button
            className="btn btn-ghost btn-circle btn-sm border border-scanner hover:border-scanner-glow/30 hover:bg-scanner-glow/5"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-scanner-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-scanner-label" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
