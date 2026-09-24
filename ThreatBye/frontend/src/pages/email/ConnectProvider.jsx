import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Lock } from 'lucide-react';

export default function ConnectProvider() {
  const navigate = useNavigate();

  const connectGmail = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/gmail/login');

      if (!response.ok) {
        throw new Error('Unable to start Gmail login');
      }

      const data = await response.json();

      if (!data.authorization_url) {
        throw new Error('Google authorization URL was not returned');
      }

      // Redirect user to Google
      window.location.href = data.authorization_url;

    } catch (error) {
      console.error('Gmail connection error:', error);
      alert('Unable to connect Gmail. Make sure the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Connect Gmail
        </h1>

        <div className="w-8"></div>

      </div>

      <div className="p-5 flex-1 flex flex-col items-center">

        <div className="w-full flex flex-col items-center">

          <div className="relative mb-6 mt-8">

            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100">

              <span className="text-red-500 font-black text-4xl">
                G
              </span>

            </div>

            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#312e81] rounded-full flex items-center justify-center border-2 border-white shadow-sm">

              <Shield className="w-4 h-4 text-white" />

            </div>

          </div>

          <h2 className="text-xl font-black text-slate-900 mb-2 text-center">
            Secure Gmail Connection
          </h2>

          <p className="text-xs text-slate-500 text-center mb-8 max-w-[280px] leading-relaxed">
            Connect your Gmail account securely using Google OAuth 2.0.
            Your Gmail password is never stored by ThreatBye.
          </p>

          <div className="w-full space-y-4 mb-10">

            <FeatureItem
              icon={Mail}
              text="Read your emails securely"
            />

            <FeatureItem
              icon={Shield}
              text="Analyze threats and risks"
            />

            <FeatureItem
              icon={Lock}
              text="Your data is protected"
            />

          </div>

          <button
            onClick={connectGmail}
            className="w-full flex items-center justify-center gap-3 bg-[#312e81] text-white font-bold rounded-xl py-4 hover:bg-[#1e1b4b] shadow-md transition-all"
          >

            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">

              <span className="text-[#312e81] font-black text-xs">
                G
              </span>

            </div>

            Continue with Google

          </button>

          <p className="text-[10px] text-slate-400 mt-4 text-center">
            You will be redirected to Google to authorize Gmail access.
          </p>

        </div>

      </div>

    </div>
  );
}


function FeatureItem({ icon: Icon, text }) {

  return (
    <div className="flex items-center gap-3 px-4">

      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">

        <Icon className="w-4 h-4 text-[#312e81]" />

      </div>

      <p className="text-sm font-bold text-slate-700">
        {text}
      </p>

    </div>
  );
}