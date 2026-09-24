import BottomNav from '../components/BottomNav';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Download,
  MoreVertical,
  CheckCircle2,
  Mail,
  ShieldAlert,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function Reports() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Generated');
  const [reports, setReports] = useState([]);

  const tabs = ['All', 'Generated', 'Shared', 'Archived'];

  const loadReports = () => {
    try {
      const saved = localStorage.getItem('threatbye_history');

      if (!saved) {
        setReports([]);
        return;
      }

      const history = JSON.parse(saved);

      if (!Array.isArray(history)) {
        setReports([]);
        return;
      }

      const generatedReports = history
        .filter((item) => item.reportId)
        .map((item) => {
          const risk = String(item.risk || '').toUpperCase();

          let theme = 'blue';

          if (risk === 'HIGH' || risk === 'HIGH RISK') {
            theme = 'red';
          } else if (
            risk === 'MEDIUM' ||
            risk === 'MEDIUM RISK'
          ) {
            theme = 'yellow';
          } else if (
            risk === 'LOW' ||
            risk === 'LOW RISK'
          ) {
            theme = 'green';
          }

          return {
            id: item.id || item.messageId,
            messageId: item.messageId,
            reportId: item.reportId,
            title:
              item.title ||
              'Email Threat Investigation',
            sender:
              item.sender ||
              item.detail ||
              'Unknown sender',
            date:
              item.date ||
              'Unknown date',
            risk,
            theme
          };
        });

      setReports(generatedReports);
    } catch (error) {
      console.error('Reports loading error:', error);
      setReports([]);
    }
  };

  useEffect(() => {
    loadReports();

    const handleStorage = () => {
      loadReports();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (activeTab === 'Generated' || activeTab === 'All') {
      return reports;
    }

    // Shared and Archived are not implemented yet.
    return [];
  }, [reports, activeTab]);

  const getThemeStyle = (theme) => {
    switch (theme) {
      case 'red':
        return 'bg-red-100 text-red-600';

      case 'yellow':
        return 'bg-yellow-100 text-yellow-600';

      case 'green':
        return 'bg-green-100 text-green-600';

      case 'purple':
        return 'bg-purple-100 text-purple-700';

      case 'blue':
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const getRiskIcon = (risk) => {
    if (risk === 'HIGH' || risk === 'HIGH RISK') {
      return ShieldAlert;
    }

    if (risk === 'MEDIUM' || risk === 'MEDIUM RISK') {
      return AlertTriangle;
    }

    return Info;
  };

  const handleOpenReport = (report) => {
    if (report.reportId) {
      navigate(`/evi-locker/report/${report.reportId}`);
    }
  };

  const handleOpenEmail = (report) => {
    if (report.messageId) {
      navigate(`/inbox/${report.messageId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Reports
        </h1>

        <button
          onClick={loadReports}
          className="text-xs font-bold text-[#312e81]"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 flex justify-between border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-3 px-2 whitespace-nowrap relative ${
              activeTab === tab
                ? 'text-[#312e81]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}

            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#312e81] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Reports */}
      <div className="px-5 flex-1 flex flex-col gap-3">

        {filteredReports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4">
              {activeTab === 'Generated' || activeTab === 'All' ? (
                <FileText className="w-8 h-8 text-[#312e81]" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              )}
            </div>

            <h2 className="text-base font-bold text-slate-900 mb-1">
              {activeTab === 'Generated' || activeTab === 'All'
                ? 'No forensic reports yet'
                : `No ${activeTab.toLowerCase()} reports`}
            </h2>

            <p className="text-xs text-slate-500 max-w-xs">
              {activeTab === 'Generated' || activeTab === 'All'
                ? 'Analyze an email from Gmail to generate a forensic investigation report.'
                : 'This report category is not available yet.'}
            </p>

            {(activeTab === 'Generated' || activeTab === 'All') && (
              <button
                onClick={() => navigate('/inbox')}
                className="mt-5 flex items-center gap-2 bg-[#312e81] text-white px-5 py-3 rounded-xl text-xs font-bold"
              >
                <Mail className="w-4 h-4" />
                Open Gmail Inbox
              </button>
            )}

          </div>
        ) : (
          filteredReports.map((report) => {
            const RiskIcon = getRiskIcon(report.risk);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              >

                <div className="flex items-center">

                  {/* File Icon */}
                  <button
                    onClick={() => handleOpenReport(report)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${getThemeStyle(
                      report.theme
                    )}`}
                  >
                    <FileText className="w-6 h-6 stroke-[2]" />
                  </button>

                  {/* Report Info */}
                  <div className="flex-1 min-w-0">

                    <button
                      onClick={() => handleOpenReport(report)}
                      className="text-left w-full"
                    >
                      <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                        Forensic Report
                      </h3>

                      <p className="text-xs text-slate-500 truncate mb-1">
                        {report.title}
                      </p>

                      <p className="text-[10px] text-slate-500 truncate">
                        {report.date}
                      </p>
                    </button>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-2">

                    <button
                      onClick={() => handleOpenReport(report)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
                      title="Open report"
                    >
                      <Download className="w-5 h-5 stroke-[2]" />
                    </button>

                    <button
                      onClick={() => handleOpenEmail(report)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors"
                      title="Open email"
                    >
                      <MoreVertical className="w-5 h-5 stroke-[2]" />
                    </button>

                  </div>

                </div>

                {/* Risk Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <RiskIcon className="w-4 h-4 text-slate-500" />

                    <span className="text-[10px] font-bold text-slate-500">
                      Risk
                    </span>

                    <span className="text-[10px] font-black text-slate-800">
                      {report.risk || 'UNKNOWN'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenReport(report)}
                    className="text-[10px] font-bold text-[#312e81]"
                  >
                    View Report →
                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>

      <BottomNav activePage="reports" />

    </div>
  );
}