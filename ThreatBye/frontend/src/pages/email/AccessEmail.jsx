import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Plus,
  MoreVertical,
  ChevronRight,
  Info,
  Inbox as InboxIcon
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function AccessEmail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Access to Email
        </h1>

        <div className="w-8"></div>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center">

        {/* Email Icon */}
        <div className="w-20 h-20 bg-[#e0e7ff] rounded-2xl flex items-center justify-center mb-6 mt-4 shadow-sm">
          <Mail className="w-10 h-10 text-[#312e81]" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-black text-slate-900 mb-2 text-center">
          Access & Secure Your Email
        </h2>

        <p className="text-sm text-slate-500 text-center mb-8 max-w-[280px]">
          Connect your email account to view, analyze, and protect your messages.
        </p>

        {/* Connect Email */}
        <button
          onClick={() => navigate('/access-email/provider')}
          className="w-full flex items-center justify-center gap-2 bg-[#312e81] text-white font-bold rounded-xl py-4 hover:bg-[#1e1b4b] transition-colors mb-8 shadow-md shadow-indigo-200"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Connect Email Account
        </button>

        {/* Connected Accounts */}
        <div className="w-full">

          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Connected Accounts
          </h3>

          {/* Connected Account Card */}
          <div
            onClick={() => navigate('/inbox')}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >

            <div className="flex items-center gap-3">

              {/* Google Icon */}
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-red-500 font-black text-lg">
                  G
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Gmail Account
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Connected with Google
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                Active
              </span>

              <MoreVertical className="w-4 h-4 text-slate-400" />

            </div>

          </div>

          {/* Open Inbox Button */}
          <button
            onClick={() => navigate('/inbox')}
            className="w-full flex items-center justify-center gap-2 bg-[#312e81] text-white font-bold rounded-xl py-4 mb-6 hover:bg-[#1e1b4b] transition-colors shadow-md"
          >
            <InboxIcon className="w-5 h-5" />
            Open Gmail Inbox
          </button>

          {/* Guide Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-[#312e81]" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Email Access Guide
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5">
                  Learn how email access works
                </p>
              </div>

            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />

          </div>

        </div>

      </div>

      <BottomNav activePage="dashboard" />

    </div>
  );
}