import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Filter,
  Mail,
  Paperclip,
  AlertTriangle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function History() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');
  const [historyItems, setHistoryItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('threatbye_history');

      if (saved) {
        setHistoryItems(JSON.parse(saved));
      } else {
        setHistoryItems([]);
      }
    } catch (error) {
      console.error('History loading error:', error);
      setHistoryItems([]);
    }
  };

  const getRiskStyle = (risk) => {
    switch (String(risk).toUpperCase()) {
      case 'HIGH':
        return 'bg-red-50 text-red-600';

      case 'MEDIUM':
        return 'bg-orange-50 text-orange-600';

      case 'LOW':
        return 'bg-emerald-50 text-emerald-600';

      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Mails' && item.type === 'mail') ||
      (activeTab === 'Files' && item.type === 'file') ||
      (activeTab === 'Scanned' && item.scanned);

    const searchText = search.toLowerCase();

    const matchesSearch =
      !searchText ||
      (item.title || '').toLowerCase().includes(searchText) ||
      (item.detail || '').toLowerCase().includes(searchText) ||
      (item.sender || '').toLowerCase().includes(searchText);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* Header */}
      <div className="flex items-center p-5 pt-8 bg-white border-b border-slate-100">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="flex-1 text-center text-lg font-bold text-slate-900 pr-8">
          Investigation History
        </h1>

      </div>

      <div className="px-5 pt-4 flex-1">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">

          <div className="bg-white rounded-xl border border-slate-100 p-3">
            <Clock className="w-4 h-4 text-[#312e81] mb-2" />

            <p className="text-lg font-black text-slate-900">
              {historyItems.length}
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              Analyzed
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-3">
            <AlertTriangle className="w-4 h-4 text-red-500 mb-2" />

            <p className="text-lg font-black text-slate-900">
              {
                historyItems.filter(
                  item => String(item.risk).toUpperCase() === 'HIGH'
                ).length
              }
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              High Risk
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mb-2" />

            <p className="text-lg font-black text-slate-900">
              {
                historyItems.filter(
                  item => String(item.risk).toUpperCase() === 'LOW'
                ).length
              }
            </p>

            <p className="text-[9px] font-bold text-slate-400">
              Low Risk
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="mb-4 flex gap-3">

          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5">

            <Search className="w-5 h-5 text-slate-400 mr-2" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search investigations..."
              className="w-full bg-transparent outline-none text-sm text-slate-900"
            />

          </div>

          <button className="bg-white border border-slate-200 rounded-xl p-3">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>

        </div>

        {/* Tabs */}
        <div className="mb-5 flex space-x-6 overflow-x-auto scrollbar-hide">

          {['All', 'Mails', 'Files', 'Scanned'].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium whitespace-nowrap pb-2 ${
                activeTab === tab
                  ? 'text-[#312e81] border-b-2 border-[#312e81]'
                  : 'text-slate-500'
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (

          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">

            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <h3 className="text-sm font-black text-slate-700">
              No investigations yet
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Analyze an email and its forensic result will appear here.
            </p>

            <button
              onClick={() => navigate('/inbox')}
              className="mt-4 px-5 py-2.5 bg-[#312e81] text-white rounded-xl text-xs font-bold"
            >
              Open Gmail Inbox
            </button>

          </div>

        )}

        {/* History */}
        <div className="flex flex-col gap-3">

          {filteredItems.map((item) => (

            <div
              key={item.id}
              onClick={() =>
                item.messageId
                  ? navigate(`/inbox/${item.messageId}`)
                  : null
              }
              className={`bg-white rounded-2xl p-4 flex items-center shadow-sm relative ${
                item.messageId ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
            >

              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4 shrink-0">

                {item.type === 'file' ? (
                  <Paperclip className="w-6 h-6 text-slate-700" />
                ) : (
                  <Mail className="w-6 h-6 text-slate-700" />
                )}

              </div>

              <div className="flex-1 min-w-0 pr-20">

                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {item.title || 'Email Investigation'}
                </h3>

                <p className="text-xs text-slate-500 truncate mt-1">
                  {item.detail || item.sender || 'Unknown sender'}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  {item.date || 'Unknown date'}
                </p>

              </div>

              <div className="absolute top-4 right-4">

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md ${getRiskStyle(
                    item.risk
                  )}`}
                >
                  {item.risk || 'Unknown'}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      <BottomNav activePage="history" />

    </div>
  );
}