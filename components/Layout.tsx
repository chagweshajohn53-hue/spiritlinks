
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Calendar, Home, LogOut, Settings } from 'lucide-react';
import { LOGO_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleTitleClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next === 5) {
        navigate('/admin-login');
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  return (
    <div className="min-h-screen flex flex-col text-enhanced">
      {/* Background Image for all pages */}
      <div className="fixed inset-0 z-[-1]">
        <img 
          src="/bak.png" 
          className="w-full h-full object-cover brightness-[0.3] opacity-50 animate-pulse-slow" 
          alt="Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000B18]/80 via-[#000B18]/60 to-[#000B18]"></div>
      </div>
      <BackgroundAnimationStyles />
      <header className="sticky top-0 z-10 bg-[#000B18]/80 backdrop-blur-md border-b border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 cursor-pointer" onClick={handleTitleClick}>
              <img 
                src={LOGO_URL} 
                alt="Logo" 
                className="w-11 h-11 rounded-xl object-contain" 
              />
              <h1 className="text-2xl font-black tracking-tight text-[#C5A059]">
                ExpoLink
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <NavLink to="/" active={location.pathname === '/'}>
                <Home size={20} /> <span className="text-sm uppercase tracking-widest font-bold">Home</span>
              </NavLink>
              <NavLink to="/links" active={location.pathname === '/links'}>
                <LayoutGrid size={20} /> <span className="text-sm uppercase tracking-widest font-bold">Links</span>
              </NavLink>
              <NavLink to="/events" active={location.pathname === '/events'}>
                <Calendar size={20} /> <span className="text-sm uppercase tracking-widest font-bold">Events</span>
              </NavLink>
              {isAdminPath && (
                 <NavLink to="/admin" active={location.pathname === '/admin'} className="text-[#C5A059]">
                  <Settings size={20} /> <span className="text-sm uppercase tracking-widest font-bold">Admin</span>
                </NavLink>
              )}
            </nav>

            <div className="md:hidden flex items-center">
                {/* Simplified mobile trigger */}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow z-0">
        {children}
      </main>

      <footer className="bg-[#000B18] text-slate-500 py-16 border-t border-[#C5A059]/10 z-0">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center text-[#C5A059] font-black mx-auto mb-6 border border-[#C5A059]/30">
                E
            </div>
          <p className="text-sm font-medium tracking-wide">© {new Date().getFullYear()} SPIRIT EMBASSY. THE DIGITAL FRONTIER.</p>
          <div className="mt-6 flex justify-center space-x-10">
            <a href="#" className="hover:text-[#C5A059] transition-colors uppercase text-[10px] font-black tracking-widest">Privacy Policy</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors uppercase text-[10px] font-black tracking-widest">Terms of Service</a>
            <a href="#" className="hover:text-[#C5A059] transition-colors uppercase text-[10px] font-black tracking-widest">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Define the animation styles here
const BackgroundAnimationStyles: React.FC = () => (
  <style>{`
    @keyframes pulse-slow {
      0%, 100% { transform: scale(1.05); }
      50% { transform: scale(1.08); }
    }
    .animate-pulse-slow {
      animation: pulse-slow 20s ease-in-out infinite;
    }
    /* Enhance text visibility against background */
    .text-enhanced {
      color: #ffffff !important;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7);
    }
    .text-gold-enhanced {
      color: #F3E5AB !important;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7);
    }
    .text-white {
      color: #ffffff !important;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
    .text-slate-400 {
      color: #e2e8f0 !important;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
    .text-slate-500 {
      color: #cbd5e1 !important;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
    .text-slate-600 {
      color: #94a3b8 !important;
      text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
    /* More prominent gold text */
    .text-[#C5A059] {
      color: #F3E5AB !important;
      text-shadow: 0 0 15px rgba(197, 160, 89, 0.7), 0 0 25px rgba(197, 160, 89, 0.5);
    }
    /* Stronger contrast for all text */
    * {
      color-adjust: exact;
    }
  `}</style>
);

const NavLink: React.FC<{ to: string, children: React.ReactNode, active?: boolean, className?: string }> = ({ to, children, active, className }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-2 transition-all duration-300 ${
      active ? 'text-[#C5A059]' : 'text-slate-400 hover:text-[#C5A059]'
    } ${className || ''}`}
  >
    {children}
  </Link>
);

export default Layout;