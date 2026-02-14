
import React from 'react';
import { SystemSettings } from '../types';

interface YearBannerProps {
  settings: SystemSettings;
}

const YearBanner: React.FC<YearBannerProps> = ({ settings }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#001226] to-[#000B18] text-white rounded-[3.5rem] p-12 md:p-20 mb-20 shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-[#C5A059]/30">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#C5A059] rounded-full opacity-[0.03] blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#C5A059] rounded-full opacity-[0.03] blur-[100px]"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="inline-block px-8 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-black text-[10px] uppercase tracking-[0.4em] rounded-full mb-10 shadow-xl">
          The Prophetic Proclamation
        </span>
        <h2 className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-none text-white shadow-2xl">
          {settings.year}
        </h2>
        <div className="h-1 w-48 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent rounded-full mb-12 shadow-[0_0_20px_#C5A059]"></div>
        <p className="text-3xl md:text-5xl font-light italic text-[#F3E5AB] max-w-4xl leading-relaxed tracking-tight">
          "{settings.theme}"
        </p>
      </div>
    </div>
  );
};

export default YearBanner;