import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SelectProvider() {
  const navigate = useNavigate();

  const providers = [
    { name: 'Google (Gmail)', icon: 'G', color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Microsoft (Outlook)', icon: 'M', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Yahoo Mail', icon: 'Y!', color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'iCloud Mail', icon: '☁️', color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'Custom IMAP', icon: '⚙️', color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Select Email Provider</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1">
        <p className="text-sm text-slate-500 mb-6 px-1">Choose your email provider to connect your account.</p>
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {providers.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${p.bg} rounded-full flex items-center justify-center`}>
                  <span className={`font-black text-sm ${p.color}`}>{p.icon}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{p.name}</span>
              </div>
              <button 
                onClick={() => navigate('/access-email/connect')}
                className="text-xs font-bold text-[#312e81] px-3 py-1.5 rounded-lg hover:bg-[#e0e7ff] transition-colors"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}