
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'UbertAngel' && password === 'SpiritEmbassy12345678') {
        localStorage.setItem('expolink_auth', 'true');
        navigate('/admin');
      } else {
        setError('Authorization failed. Access denied.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#000B18]">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#C5A059]/10 rounded-[2.5rem] mb-8 shadow-[0_0_50px_rgba(197,160,89,0.1)] border border-[#C5A059]/30">
            <ShieldCheck size={48} className="text-[#C5A059]" />
          </div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase tracking-widest">Admin Nexus</h2>
          <p className="text-slate-500 font-medium tracking-wide">Authorized administrative interface only.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#001226] p-10 rounded-[3rem] border border-[#C5A059]/20 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-8 p-5 bg-red-950/30 border border-red-500/50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}
          
          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-3 ml-2">Identity</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-[#000B18] border border-[#C5A059]/10 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none focus:bg-[#000B18] transition-all font-medium placeholder:text-slate-800"
                  placeholder="Enter User ID"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] mb-3 ml-2">Keycode</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-[#000B18] border border-[#C5A059]/10 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none focus:bg-[#000B18] transition-all font-medium placeholder:text-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-5 bg-[#C5A059] text-[#000B18] rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_15px_40px_rgba(197,160,89,0.3)] active:scale-[0.98] transition-all"
          >
            {isLoading ? 'Decrypting...' : 'Initiate Access'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>
        
        <p className="text-center mt-12 text-slate-700 text-[9px] font-black uppercase tracking-[0.4em] italic">
          Encrypted Session Active // IP Logged
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;