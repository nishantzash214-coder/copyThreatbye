import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, AlertTriangle, ChevronRight } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(false);

  const handleAction = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const supportItems = [
    { icon: MessageSquare, label: 'FAQs & Articles' },
    { icon: Mail, label: 'Contact Support' },
    { icon: AlertTriangle, label: 'Report an Issue' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20 relative">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Help & Support</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">How can we help you?</h2>

        <div className="space-y-3">
          {supportItems.map((item, i) => (
            <button 
              key={i}
              onClick={handleAction}
              className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-[#e0e7ff] rounded-xl flex items-center justify-center mr-4">
                <item.icon className="w-5 h-5 text-[#312e81]" />
              </div>
              <span className="flex-1 text-left text-sm font-bold text-slate-800">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold animate-in fade-in slide-in-from-bottom-4">
          Feature coming soon!
        </div>
      )}

      <BottomNav activePage="profile" />
    </div>
  );
}