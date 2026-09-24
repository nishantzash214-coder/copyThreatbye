import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Filter,
  ShieldAlert,
  FileText,
  Bell,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export default function Inbox() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Primary');
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =========================
  // FETCH GMAIL
  // =========================

  useEffect(() => {
    fetchGmailMessages();
  }, []);

  const fetchGmailMessages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://127.0.0.1:8000/gmail/messages?max_results=20'
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Gmail is not connected. Please connect your Gmail account first.'
          );
        }

        throw new Error('Unable to fetch Gmail messages.');
      }

      const data = await response.json();

      setEmails(data.messages || []);

    } catch (error) {
      console.error('Gmail messages error:', error);

      setError(
        error.message || 'Unable to load Gmail messages.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RISK ICON
  // =========================

  const getRiskIcon = (email) => {
    const subject = (email.subject || '').toLowerCase();
    const sender = (email.from || '').toLowerCase();

    if (
      subject.includes('security') ||
      subject.includes('alert') ||
      subject.includes('suspicious') ||
      subject.includes('password') ||
      subject.includes('verify')
    ) {
      return {
        icon: ShieldAlert,
        iconColor: 'text-red-600',
        bg: 'bg-red-50',
        risk: 'High'
      };
    }

    if (
      sender.includes('facebook') ||
      sender.includes('linkedin') ||
      sender.includes('instagram')
    ) {
      return {
        icon: Bell,
        iconColor: 'text-orange-600',
        bg: 'bg-orange-50',
        risk: 'Medium'
      };
    }

    return {
      icon: FileText,
      iconColor: 'text-emerald-600',
      bg: 'bg-emerald-50',
      risk: 'Low'
    };
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      const now = new Date();

      const sameDay =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (sameDay) {
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      return date.toLocaleDateString([], {
        day: '2-digit',
        month: 'short'
      });

    } catch {
      return dateString;
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredEmails = emails.filter((email) => {

    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      (email.from || '').toLowerCase().includes(query) ||
      (email.subject || '').toLowerCase().includes(query) ||
      (email.snippet || '').toLowerCase().includes(query)
    );
  });

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">

        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-800 p-1"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Gmail Inbox
        </h1>

        <button
          onClick={fetchGmailMessages}
          className="text-slate-600 p-1"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

      </div>

      <div className="p-4 flex-1">

        {/* ================= SEARCH ================= */}

        <div className="flex gap-2 mb-4">

          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">

            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emails..."
              className="w-full bg-transparent outline-none text-sm text-slate-900"
            />

          </div>

          <button
            className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm flex items-center justify-center text-slate-600"
            title="Filter"
          >
            <Filter className="w-5 h-5" />
          </button>

        </div>

        {/* ================= TABS ================= */}

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">

          {['Primary', 'Social', 'Updates', 'Promotions'].map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-[#312e81] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* ================= LOADING ================= */}

        {loading && (

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">

            <RefreshCw className="w-6 h-6 text-[#312e81] animate-spin mx-auto mb-3" />

            <p className="text-sm font-bold text-slate-600">
              Loading Gmail messages...
            </p>

          </div>

        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">

            <AlertTriangle className="w-7 h-7 text-red-600 mx-auto mb-3" />

            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              onClick={fetchGmailMessages}
              className="mt-4 px-5 py-2.5 bg-[#312e81] text-white rounded-lg text-xs font-bold"
            >
              Try Again
            </button>

          </div>

        )}

        {/* ================= EMAIL LIST ================= */}

        {!loading && !error && (

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {filteredEmails.length === 0 ? (

              <div className="p-10 text-center">

                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />

                <p className="text-sm font-bold text-slate-600">
                  {search
                    ? 'No matching emails found.'
                    : 'No Gmail messages found.'
                  }
                </p>

              </div>

            ) : (

              filteredEmails.map((email) => {

                const risk = getRiskIcon(email);

                const Icon = risk.icon;

                return (

                  <div
                    key={email.id}
                    onClick={() => navigate(`/inbox/${email.id}`)}
                    className="flex items-start gap-3 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                  >

                    {/* ICON */}

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${risk.bg}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${risk.iconColor}`}
                      />
                    </div>

                    {/* EMAIL */}

                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between items-center mb-1">

                        <h3 className="text-xs font-black text-slate-900 truncate pr-2">
                          {email.from || 'Unknown sender'}
                        </h3>

                        <span className="text-[9px] font-bold text-slate-400 shrink-0">
                          {formatDate(email.date)}
                        </span>

                      </div>

                      <h4 className="text-[11px] font-bold text-slate-800 truncate">
                        {email.subject || '(No subject)'}
                      </h4>

                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {email.snippet || 'No preview available'}
                      </p>

                    </div>

                    {/* RISK */}

                    <div className="shrink-0 pt-1 flex flex-col items-end gap-1">

                      <div
                        className={`w-2 h-2 rounded-full ${
                          risk.risk === 'High'
                            ? 'bg-red-600'
                            : risk.risk === 'Medium'
                            ? 'bg-orange-500'
                            : 'bg-emerald-500'
                        }`}
                      />

                      <span
                        className={`text-[8px] font-bold ${
                          risk.risk === 'High'
                            ? 'text-red-600'
                            : risk.risk === 'Medium'
                            ? 'text-orange-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {risk.risk}
                      </span>

                    </div>

                  </div>

                );
              })

            )}

          </div>

        )}

      </div>

      <BottomNav activePage="dashboard" />

    </div>
  );
}