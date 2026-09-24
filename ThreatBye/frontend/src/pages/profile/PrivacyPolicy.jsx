import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Privacy Policy</h1>
        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1 space-y-4">
        <PolicyCard title="Your Privacy Matters">
          ThreatBye is committed to protecting your data. We strictly analyze emails for threats without storing your personal communication contents.
        </PolicyCard>
        
        <PolicyCard title="Information We Collect">
          We collect basic profile details, device session logs, and email metadata solely required for forensic analysis and threat scoring.
        </PolicyCard>

        <PolicyCard title="How We Use Information">
          Your data is used exclusively to generate Evi Locker reports, alert you of suspicious activities, and maintain account security.
        </PolicyCard>

        <PolicyCard title="Data Protection">
          All data is encrypted in transit and at rest. We do not sell your personal data to third-party advertising networks.
        </PolicyCard>
      </div>
      <BottomNav activePage="profile" />
    </div>
  );
}

function PolicyCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-[#312e81] mb-2">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}