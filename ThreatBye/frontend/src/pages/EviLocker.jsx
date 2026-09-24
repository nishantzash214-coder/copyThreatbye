import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Mail
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function EviLocker() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [reports, setReports] = useState([]);

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

      const realReports = history
        .filter((item) => item.reportId)
        .map((item) => {
          const risk = String(item.risk || '').toUpperCase();

          let threatLevel = 'Low Risk';

          if (risk === 'HIGH' || risk === 'HIGH RISK') {
            threatLevel = 'High Risk';
          } else if (
            risk === 'MEDIUM' ||
            risk === 'MEDIUM RISK'
          ) {
            threatLevel = 'Medium Risk';
          }

          return {
            id: item.id || item.messageId || item.reportId,
            caseId: item.reportId,
            subject:
              item.title ||
              'Email Threat Investigation',
            sender:
              item.sender ||
              item.detail ||
              'Unknown sender',
            date: item.date || 'Unknown date',
            threatLevel,
            messageId: item.messageId || null,
            reportId: item.reportId
          };
        });

      setReports(realReports);
    } catch (error) {
      console.error('Evi Locker loading error:', error);
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

  const statistics = useMemo(() => {
    const high = reports.filter(
      (report) => report.threatLevel === 'High Risk'
    ).length;

    const medium = reports.filter(
      (report) => report.threatLevel === 'Medium Risk'
    ).length;

    const low = reports.filter(
      (report) => report.threatLevel === 'Low Risk'
    ).length;

    return {
      total: reports.length,
      high,
      medium,
      low
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return reports.filter((report) => {
      const matchesSearch =
        !search ||
        report.caseId.toLowerCase().includes(search) ||
        report.subject.toLowerCase().includes(search) ||
        report.sender.toLowerCase().includes(search);

      const matchesFilter =
        activeFilter === 'All' ||
        report.threatLevel.startsWith(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchTerm, activeFilter]);

  const getRiskStyle = (threatLevel) => {
    if (threatLevel === 'High Risk') {
      return {
        badge: 'bg-red-50 text-red-600',
        dot: 'bg-red-600'
      };
    }

    if (threatLevel === 'Medium Risk') {
      return {
        badge: 'bg-orange-50 text-orange-600',
        dot: 'bg-orange-600'
      };
    }

    return {
      badge: 'bg-emerald-50 text-emerald-600',
      dot: 'bg-emerald-600'
    };
  };

  const openReport = (report) => {
    if (report.reportId) {
      navigate(`/evi-locker/report/${report.reportId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onClick={loadReports}
          className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 transition-colors"
          title="Refresh"
        >
          <SlidersHorizontal className="w-5 h-5 text-slate-800" />
        </button>
      </div>

      <div className="px-5">

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />

            <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase">
              Secure Repository
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Forensic Report Repository
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 mb-4 focus-within:border-[#312e81] shadow-sm transition-colors">

          <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />

          <input
            type="text"
            placeholder="Search reports / Case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">

          {['All', 'High', 'Medium', 'Low'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                activeFilter === filter
                  ? 'bg-[#e0e7ff] text-[#312e81] border-[#c7d2fe]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter === 'All'
                ? 'All Reports'
                : `${filter} Risk`}
            </button>
          ))}

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">

          {/* Total */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <FileText className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {statistics.total}
              </p>

              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Total Reports
              </p>
            </div>
          </div>

          {/* High */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="bg-red-50 p-2 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {statistics.high}
              </p>

              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                High Risk
              </p>
            </div>
          </div>

          {/* Medium */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {statistics.medium}
              </p>

              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Medium Risk
              </p>
            </div>
          </div>

          {/* Low */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <Shield className="w-5 h-5 stroke-[2]" />
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {statistics.low}
              </p>

              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                Low Risk
              </p>
            </div>
          </div>

        </div>

        {/* Recent Reports */}
        <h2 className="text-sm font-bold text-slate-900 mb-3">
          Recent Reports
        </h2>

        <div className="flex flex-col gap-3">

          {filteredReports.map((report) => {
            const riskStyle = getRiskStyle(report.threatLevel);

            return (
              <div
                key={report.id}
                onClick={() => openReport(report)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform cursor-pointer"
              >

                {/* Top Row */}
                <div className="flex justify-between items-start mb-2">

                  <span className="text-[10px] font-bold text-[#312e81] bg-[#e0e7ff] px-2 py-1 rounded-md truncate max-w-[60%]">
                    {report.caseId}
                  </span>

                  <div
                    className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md ${riskStyle.badge}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${riskStyle.dot}`}
                    />

                    {report.threatLevel}
                  </div>

                </div>

                {/* Subject */}
                <h3 className="text-sm font-bold text-slate-900 mb-1 truncate">
                  {report.subject}
                </h3>

                {/* Sender */}
                <p className="text-[10px] text-slate-500 truncate">
                  {report.sender}
                </p>

                {/* Bottom */}
                <div className="flex justify-between items-end mt-3">

                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {report.date}
                  </p>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      openReport(report);
                    }}
                    className="flex items-center text-xs font-bold text-slate-400 hover:text-[#312e81] transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1 stroke-[2]" />
                    View
                  </button>

                </div>

              </div>
            );
          })}

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-[#312e81]" />
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {reports.length === 0
                  ? 'No forensic reports yet'
                  : 'No reports found'}
              </h3>

              <p className="text-xs text-slate-500">
                {reports.length === 0
                  ? 'Analyze an email from Gmail to create a forensic report.'
                  : 'Try changing your search or risk filter.'}
              </p>

              {reports.length === 0 && (
                <button
                  onClick={() => navigate('/inbox')}
                  className="mt-5 inline-flex items-center gap-2 bg-[#312e81] text-white px-5 py-3 rounded-xl text-xs font-bold"
                >
                  <Mail className="w-4 h-4" />
                  Open Gmail Inbox
                </button>
              )}

            </div>
          )}

        </div>
      </div>

      <BottomNav activePage="evilocker" />

    </div>
  );
}