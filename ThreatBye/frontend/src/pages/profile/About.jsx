import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">About</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#312e81] rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
          <Shield className="w-12 h-12 text-white stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">ThreatBye</h2>
        <p className="text-sm font-bold text-[#312e81] mb-6">Version 1.0.0</p>
        
        <p className="text-sm text-slate-600 max-w-[280px] mb-10 leading-relaxed">
          Detect. Trace. Protect. Securing your digital footprint through advanced threat analysis and reporting.
        </p>

        <div className="space-y-4 text-xs font-bold text-slate-500">
          <p className="hover:text-slate-800 transition-colors">Terms of Service</p>
          <p className="hover:text-slate-800 transition-colors">Open Source Licenses</p>
        </div>
      </div>
      <BottomNav activePage="profile" />
    </div>
  );
}