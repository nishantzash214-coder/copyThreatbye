import { useNavigate } from 'react-router-dom';
import { Home, Shield, Clock, AlertCircle, User } from 'lucide-react';

export default function BottomNav({ activePage }) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center pt-3 pb-safe-bottom h-16 px-2 z-50">
      
      {/* 1. Dashboard */}
      <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center justify-center w-16 ${activePage === 'dashboard' ? 'text-[#4338ca]' : 'text-slate-400 hover:text-[#312e81]'}`}>
        <Home className={`w-6 h-6 mb-1 ${activePage === 'dashboard' ? 'stroke-2 fill-[#e0e7ff]' : 'stroke-[1.5]'}`} />
        <span className={`text-[10px] ${activePage === 'dashboard' ? 'font-bold' : 'font-medium'}`}>Dashboard</span>
      </button>

      {/* 2. Evi Locker
      <button onClick={() => navigate('/evi-locker')} className={`flex flex-col items-center justify-center w-16 ${activePage === 'evilocker' ? 'text-[#4338ca]' : 'text-slate-400 hover:text-[#312e81]'}`}>
        <Shield className={`w-6 h-6 mb-1 ${activePage === 'evilocker' ? 'stroke-2 fill-[#e0e7ff]' : 'stroke-[1.5]'}`} />
        <span className={`text-[10px] ${activePage === 'evilocker' ? 'font-bold' : 'font-medium'}`}>Evi Locker</span>
      </button> */}

      {/* 3. History */}
      <button onClick={() => navigate('/history')} className={`flex flex-col items-center justify-center w-16 ${activePage === 'history' ? 'text-[#4338ca]' : 'text-slate-400 hover:text-[#312e81]'}`}>
        <Clock className={`w-6 h-6 mb-1 ${activePage === 'history' ? 'stroke-2 fill-[#e0e7ff]' : 'stroke-[1.5]'}`} />
        <span className={`text-[10px] ${activePage === 'history' ? 'font-bold' : 'font-medium'}`}>History</span>
      </button>

      {/* 4. Alerts */}
      <button onClick={() => navigate('/alerts')} className={`flex flex-col items-center justify-center w-16 ${activePage === 'alerts' ? 'text-[#4338ca]' : 'text-slate-400 hover:text-[#312e81]'}`}>
        <AlertCircle className={`w-6 h-6 mb-1 ${activePage === 'alerts' ? 'stroke-2 fill-[#e0e7ff]' : 'stroke-[1.5]'}`} />
        <span className={`text-[10px] ${activePage === 'alerts' ? 'font-bold' : 'font-medium'}`}>Alerts</span>
      </button>

      {/* 5. Profile */}
      <button onClick={() => navigate('/profile')} className={`flex flex-col items-center justify-center w-16 ${activePage === 'profile' ? 'text-[#4338ca]' : 'text-slate-400 hover:text-[#312e81]'}`}>
        <User className={`w-6 h-6 mb-1 ${activePage === 'profile' ? 'stroke-2 fill-[#e0e7ff]' : 'stroke-[1.5]'}`} />
        <span className={`text-[10px] ${activePage === 'profile' ? 'font-bold' : 'font-medium'}`}>Profile</span>
      </button>

    </div>
  );
}