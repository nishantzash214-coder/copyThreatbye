import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function ThreatCategories() {
  const navigate = useNavigate();

  const categories = [
    { label: 'Phishing', val: '98', perc: 39, color: 'bg-red-600' },
    { label: 'Malware', val: '62', perc: 25, color: 'bg-orange-500' },
    { label: 'Spam', val: '45', perc: 18, color: 'bg-emerald-500' },
    { label: 'Social Engineering', val: '25', perc: 10, color: 'bg-indigo-500' },
    { label: 'Ransomware Links', val: '12', perc: 5, color: 'bg-purple-600' },
    { label: 'Others', val: '6', perc: 2, color: 'bg-slate-400' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Threat Categories</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-[#312e81]" />
            <span className="text-sm font-bold text-slate-900">All Categories (248 Analyzed)</span>
          </div>
          
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="text-slate-900">{cat.val} <span className="text-slate-400 ml-1">({cat.perc}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav activePage="dashboard" />
    </div>
  );
}