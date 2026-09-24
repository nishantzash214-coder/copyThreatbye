import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Calendar, MapPin } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function AccountInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Account Info</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1 space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-[#e0e7ff] rounded-full flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-[#312e81]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Mahendra Khatri</h2>
          <span className="mt-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Profile
          </span>
        </div>

        <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
          <InfoRow icon={Mail} label="Email Address" value="mahendra.khatri@example.com" />
          <div className="h-px bg-slate-50 mx-4"></div>
          <InfoRow icon={Phone} label="Phone Number" value="+91 98765 43210" />
          <div className="h-px bg-slate-50 mx-4"></div>
          <InfoRow icon={MapPin} label="Location" value="Bhopal, Madhya Pradesh" />
          <div className="h-px bg-slate-50 mx-4"></div>
          <InfoRow icon={Calendar} label="Member Since" value="September 2024" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Email Preferences</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500 mt-0.5">Receive alerts and reports</p>
            </div>
            <div className="w-10 h-6 bg-[#312e81] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav activePage="profile" />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center p-3">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}