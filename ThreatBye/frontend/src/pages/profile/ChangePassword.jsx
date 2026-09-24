import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError('All fields are required.');
      return;
    }
    
    // Basic Regex for strong password
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    if (!strongRegex.test(passwords.new)) {
      setError('Password does not meet requirements.');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }

    // Success State
    setSuccess(true);
    setTimeout(() => { navigate(-1); }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Change Password</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1">
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="text-sm font-bold">Password updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField 
            label="Current Password" 
            value={passwords.current}
            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            show={showCurrent} 
            toggle={() => setShowCurrent(!showCurrent)} 
          />
          <PasswordField 
            label="New Password" 
            value={passwords.new}
            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            show={showNew} 
            toggle={() => setShowNew(!showNew)} 
          />
          <PasswordField 
            label="Confirm New Password" 
            value={passwords.confirm}
            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            show={showNew} 
            toggle={() => setShowNew(!showNew)} 
          />

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mt-6">
            <h3 className="text-xs font-bold text-slate-800 mb-2">Password Requirements:</h3>
            <ul className="text-[11px] text-slate-500 space-y-1 ml-4 list-disc">
              <li>At least 8 characters long</li>
              <li>Include uppercase & lowercase letters</li>
              <li>Include numbers & special characters</li>
            </ul>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 py-4 bg-[#312e81] text-white font-bold rounded-xl shadow-sm hover:bg-[#1e1b4b] transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">{label}</label>
      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#312e81]">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-sm text-slate-900 [&::-ms-reveal]:hidden"
          placeholder="••••••••"
        />
        <button type="button" onClick={toggle} className="text-slate-400 p-1">
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}