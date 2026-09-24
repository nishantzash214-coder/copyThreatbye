import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, ShieldAlert, FileText, Activity } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function Notifications() {
  const navigate = useNavigate();

  const notifs = [
    { title: 'Email Alerts', desc: 'Critical threat detections', icon: Bell },
    { title: 'Security Alerts', desc: 'Login & session warnings', icon: ShieldAlert },
    { title: 'New Reports', desc: 'Forensic report generation', icon: FileText },
    { title: 'System Updates', desc: 'Important app updates', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1">
        <div className="bg-[#e0e7ff] border border-[#c7d2fe] p-4 rounded-2xl mb-6 flex items-start">
          <Lock className="w-5 h-5 text-[#312e81] mt-0.5 mr-3 shrink-0" />
          <p className="text-xs text-[#312e81] font-medium leading-relaxed">
            <strong>Always On:</strong> Security notifications are strictly enabled to help protect your account. They cannot be turned off.
          </p>
        </div>

        <div className="space-y-3">
          {notifs.map((item, i) => (
            <div key={i} className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm opacity-90">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
                <item.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-[10px] text-slate-500">{item.desc}</p>
              </div>
              <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <Lock className="w-3 h-3 text-slate-400 mr-1.5" />
                <span className="text-xs font-bold text-slate-600">ON</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav activePage="profile" />
    </div>
  );
}