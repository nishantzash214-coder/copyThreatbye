import { useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Shield,
  CloudUpload,
  Mail,
  ShieldCheck,
  BarChart2,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Send,
  Hand,
  AlertTriangle,
  Activity,
  FileCheck,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [gmailStatus, setGmailStatus] = useState('checking');
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    checkGmail();
  }, []);

  const checkGmail = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/gmail/messages?max_results=10'
      );

      if (!response.ok) {
        setGmailStatus('disconnected');
        return;
      }

      const data = await response.json();

      setGmailStatus('connected');
      setMessageCount(data.count || 0);
    } catch (error) {
      console.error('Gmail status error:', error);
      setGmailStatus('disconnected');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between p-5 pt-8">

        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-slate-800 p-1 hover:bg-slate-200 rounded-full transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          ThreatBye
        </h1>

        <button
          onClick={() => navigate('/evi-locker')}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100"
        >
          <Shield className="w-4 h-4 text-[#312e81]" />

          <span className="text-xs font-bold text-slate-800">
            Evi Locker
          </span>
        </button>

      </div>

      <div className="px-5 flex-1">

        {/* ================================================= */}
        {/* SECURITY STATUS */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#312e81]" />
              </div>

              <div>

                <h2 className="text-sm font-black text-slate-900">
                  ThreatBye Protection
                </h2>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Email threat detection system
                </p>

              </div>

            </div>

            <Activity className="w-5 h-5 text-emerald-500" />

          </div>

          {/* Gmail Status */}

          <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-xl p-3">

            <div className="flex items-center gap-2">

              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  gmailStatus === 'connected'
                    ? 'bg-emerald-500'
                    : gmailStatus === 'disconnected'
                      ? 'bg-red-500'
                      : 'bg-yellow-400'
                }`}
              />

              <span className="text-xs font-bold text-slate-700">
                Gmail
              </span>

            </div>

            <span className="text-[10px] font-black uppercase text-slate-500">
              {gmailStatus === 'connected'
                ? 'Connected'
                : gmailStatus === 'disconnected'
                  ? 'Disconnected'
                  : 'Checking...'}
            </span>

          </div>

        </div>

        {/* ================================================= */}
        {/* QUICK STATS */}
        {/* ================================================= */}

        <div className="grid grid-cols-3 gap-3 mb-6">

          {/* Gmail */}

          <button
            onClick={() => navigate('/inbox')}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left"
          >

            <Mail className="w-5 h-5 text-[#312e81] mb-2" />

            <p className="text-xl font-black text-slate-900">
              {messageCount}
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              Gmail Loaded
            </p>

          </button>

          {/* AI */}

          <button
            onClick={() => navigate('/risk-dashboard')}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left"
          >

            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />

            <p className="text-xl font-black text-slate-900">
              AI
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              Detection
            </p>

          </button>

          {/* Evidence */}

          <button
            onClick={() => navigate('/evi-locker')}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left"
          >

            <FileCheck className="w-5 h-5 text-purple-600 mb-2" />

            <p className="text-xl font-black text-slate-900">
              SHA
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              Evidence
            </p>

          </button>

        </div>

        {/* ================================================= */}
        {/* MAIN WORKFLOW */}
        {/* ================================================= */}

        <div className="relative pt-2 pb-2">

          {/* Timeline Line */}

          <div className="absolute left-[27px] top-12 bottom-12 w-[2px] bg-slate-200" />

          {/* ================================================= */}
          {/* UPLOAD MAIL */}
          {/* ================================================= */}

          <div
            onClick={() => navigate('/upload')}
            className="relative z-10 flex items-center mb-6 cursor-pointer group"
          >

            <div className="w-14 h-14 bg-[#e0e7ff] text-[#312e81] rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">

              <CloudUpload className="w-6 h-6" />

            </div>

            <div className="ml-4 flex-1">

              <h3 className="text-sm font-bold text-slate-900">
                Upload Mail
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Analyze a suspicious .eml file
              </p>

            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />

          </div>

          {/* ================================================= */}
          {/* GMAIL INBOX */}
          {/* ================================================= */}

          <div
            onClick={() => navigate('/inbox')}
            className="relative z-10 flex items-center mb-6 cursor-pointer group"
          >

            <div className="w-14 h-14 bg-[#e0e7ff] text-[#312e81] rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">

              <Mail className="w-6 h-6" />

            </div>

            <div className="ml-4 flex-1">

              <h3 className="text-sm font-bold text-slate-900">
                Gmail Inbox
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                View and analyze real emails
              </p>

              {gmailStatus === 'connected' && (
                <span className="inline-block mt-1.5 px-2.5 py-1 bg-[#dcfce7] text-[#166534] text-[10px] font-bold rounded-md">
                  Connected
                </span>
              )}

            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />

          </div>

          {/* ================================================= */}
          {/* RISK ANALYZER */}
          {/* ================================================= */}

          <div
            onClick={() => navigate('/analysis')}
            className="relative z-10 flex items-center mb-6 cursor-pointer group"
          >

            <div className="w-14 h-14 bg-[#e0e7ff] text-[#312e81] rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">

              <ShieldCheck className="w-6 h-6" />

            </div>

            <div className="ml-4 flex-1">

              <h3 className="text-sm font-bold text-slate-900">
                Risk Analyzer
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Detect phishing and suspicious behavior
              </p>

            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />

          </div>

          {/* ================================================= */}
          {/* RISK DASHBOARD */}
          {/* ================================================= */}

          <div
            onClick={() => navigate('/risk-dashboard')}
            className="relative z-10 flex items-center mb-6 cursor-pointer group"
          >

            <div className="w-14 h-14 bg-[#e0e7ff] text-[#312e81] rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">

              <BarChart2 className="w-6 h-6" />

            </div>

            <div className="ml-4 flex-1">

              <h3 className="text-sm font-bold text-slate-900">
                Risk Dashboard
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                View threat scores and security insights
              </p>

            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />

          </div>

        </div>

        {/* ================================================= */}
        {/* EMAIL DECISION */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl p-4 mt-5 shadow-sm border border-slate-100">

          <div className="text-center mb-4">

            <h3 className="text-sm font-bold text-slate-900">
              Email Decision
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Review before interacting with suspicious mail
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() => navigate('/inbox')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#f0fdf4] text-[#166534] py-3 rounded-xl border border-[#bbf7d0] font-bold text-sm"
            >

              <CheckCircle2 className="w-4 h-4" />

              Safe

            </button>

            <button
              onClick={() => navigate('/alerts')}
              className="flex-1 flex items-center justify-center gap-2 bg-[#fef2f2] text-[#991b1b] py-3 rounded-xl border border-[#fecaca] font-bold text-sm"
            >

              <XCircle className="w-4 h-4" />

              Threat

            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* NETWORK / OPERATOR */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm border border-slate-100">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

              <Send className="w-5 h-5 text-[#312e81]" />

            </div>

            <div>

              <h3 className="text-sm font-bold text-slate-900">
                Network / Operator
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Review network activity and operator signals
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >

              <Hand className="w-4 h-4 text-[#312e81]" />

              Network

            </button>

            <button
              onClick={() => navigate('/analysis')}
              className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >

              <AlertTriangle className="w-4 h-4 text-orange-500" />

              Operator

            </button>

          </div>

        </div>

        

        {/* ================================================= */}
        {/* INVESTIGATION HISTORY */}
        {/* ================================================= */}

        <button
          onClick={() => navigate('/history')}
          className="w-full mt-4 bg-white border border-slate-200 rounded-2xl p-4 flex items-center text-left mb-5"
        >

          <Clock className="w-5 h-5 mr-4 text-[#312e81]" />

          <div className="flex-1">

            <h3 className="font-bold text-sm text-slate-900">
              Investigation History
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Review previously analyzed emails
            </p>

          </div>

          <ChevronRight className="w-5 h-5 text-slate-400" />

        </button>

      </div>

      {/* ================================================= */}
      {/* BOTTOM NAVIGATION */}
      {/* ================================================= */}

      <BottomNav activePage="dashboard" />

      {/* ================================================= */}
      {/* SIDE MENU */}
      {/* ================================================= */}

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

    </div>
  );
}