import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Smartphone, Monitor, ChevronRight } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function SecuritySettings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Security</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1 space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Access</h2>
        
        <button 
          onClick={() => navigate('/profile/security/change-password')}
          className="w-full flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-[#e0e7ff] rounded-xl flex items-center justify-center mr-4">
            <Key className="w-5 h-5 text-[#312e81]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-slate-800">Change Password</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Update your account password</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 pr-4">
            <p className="text-sm font-bold text-slate-800">Two-Factor Auth (2FA)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Extra layer of security</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
            Enabled
          </span>
        </div>

        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2 mt-6">Active Sessions</h2>
        
        <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
          <div className="flex items-center p-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
              <Monitor className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Windows • Chrome</p>
              <p className="text-[10px] text-slate-500">Bhopal, India • Active Now</p>
            </div>
          </div>
          <div className="h-px bg-slate-50 mx-4"></div>
          <div className="flex items-center p-3 opacity-70">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
              <Smartphone className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">iPhone 14 • Safari</p>
              <p className="text-[10px] text-slate-500">Bhopal, India • 2 hours ago</p>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-4 bg-white text-red-600 border border-red-100 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-colors">
          Logout All Sessions
        </button>

      </div>
      <BottomNav activePage="profile" />
    </div>
  );
}