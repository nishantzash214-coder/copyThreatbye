import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Info,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  Eye,
  Mail,
  RefreshCw
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function RiskDashboard() {
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load real analyzed investigations from localStorage
  const loadHistory = () => {
    try {
      setLoading(true);

      const saved = localStorage.getItem('threatbye_history');

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setHistoryItems(parsed);
        } else {
          setHistoryItems([]);
        }
      } else {
        setHistoryItems([]);
      }
    } catch (error) {
      console.error('Risk dashboard history error:', error);
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    // Refresh when returning to this page
    const handleStorage = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Calculate real risk counts
  const riskStats = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    historyItems.forEach((item) => {
      const risk = String(item.risk || '').toUpperCase();

      if (risk === 'HIGH' || risk === 'HIGH RISK') {
        high++;
      } else if (risk === 'MEDIUM' || risk === 'MEDIUM RISK') {
        medium++;
      } else if (risk === 'LOW' || risk === 'LOW RISK') {
        low++;
      }
    });

    return {
      total: historyItems.length,
      high,
      medium,
      low
    };
  }, [historyItems]);

  const percentages = useMemo(() => {
    const total = riskStats.total;

    if (!total) {
      return {
        high: 0,
        medium: 0,
        low: 0
      };
    }

    return {
      high: Math.round((riskStats.high / total) * 100),
      medium: Math.round((riskStats.medium / total) * 100),
      low: Math.round((riskStats.low / total) * 100)
    };
  }, [riskStats]);

  // Recent high-risk investigations
  const recentHighRisk = useMemo(() => {
    return historyItems
      .filter((item) => {
        const risk = String(item.risk || '').toUpperCase();

        return risk === 'HIGH' || risk === 'HIGH RISK';
      })
      .slice(0, 5);
  }, [historyItems]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Risk Analyzed Dashboard
        </h1>

        <button
          onClick={loadHistory}
          className="text-slate-500 p-1 hover:text-[#312e81]"
          title="Refresh"
        >
          <RefreshCw
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
          />
        </button>

      </div>

      <div className="p-4 flex-1">

        {/* ================================================= */}
        {/* DATE / DATA STATUS */}
        {/* ================================================= */}

        <div className="flex justify-between items-center mb-4">

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Live Investigation Data
            </p>

            <p className="text-xs font-bold text-slate-700 mt-0.5">
              Based on analyzed emails
            </p>
          </div>

          <div className="flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-[10px] font-bold text-slate-600 mr-2">
              Current
            </span>

            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>

        </div>

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 gap-3 mb-6">

          <SummaryCard
            icon={Info}
            title="Total Analyzed"
            value={riskStats.total}
            trend="Saved investigations"
            color="indigo"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="High Risk"
            value={riskStats.high}
            trend={`${percentages.high}% of analyzed`}
            color="red"
          />

          <SummaryCard
            icon={AlertTriangle}
            title="Medium Risk"
            value={riskStats.medium}
            trend={`${percentages.medium}% of analyzed`}
            color="orange"
          />

          <SummaryCard
            icon={ShieldCheck}
            title="Low Risk"
            value={riskStats.low}
            trend={`${percentages.low}% of analyzed`}
            color="emerald"
          />

        </div>

        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {riskStats.total === 0 && (

          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center mb-4">

            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <h2 className="text-sm font-black text-slate-800">
              No analyzed emails yet
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Analyze an email from Gmail to populate the Risk Dashboard.
            </p>

            <button
              onClick={() => navigate('/inbox')}
              className="mt-4 bg-[#312e81] text-white rounded-xl px-5 py-3 text-xs font-bold"
            >
              Open Gmail Inbox
            </button>

          </div>
        )}

        {/* ================================================= */}
        {/* RISK DISTRIBUTION */}
        {/* ================================================= */}

        {riskStats.total > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-4">

            <h2 className="text-sm font-bold text-slate-900 mb-4">
              Risk Distribution
            </h2>

            <div className="flex items-center gap-6">

              {/* Donut */}

              <div className="relative w-24 h-24 shrink-0">

                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 32 32"
                >

                  <circle
                    r="12"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                  />

                  {percentages.low > 0 && (
                    <circle
                      r="12"
                      cx="16"
                      cy="16"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray={`${percentages.low} 100`}
                    />
                  )}

                  {percentages.medium > 0 && (
                    <circle
                      r="12"
                      cx="16"
                      cy="16"
                      fill="transparent"
                      stroke="#f97316"
                      strokeWidth="6"
                      strokeDasharray={`${percentages.medium} 100`}
                      strokeDashoffset={`-${percentages.low}`}
                    />
                  )}

                  {percentages.high > 0 && (
                    <circle
                      r="12"
                      cx="16"
                      cy="16"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="6"
                      strokeDasharray={`${percentages.high} 100`}
                      strokeDashoffset={`-${
                        percentages.low + percentages.medium
                      }`}
                    />
                  )}

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-sm font-black text-slate-900 leading-none">
                    {riskStats.total}
                  </span>

                  <span className="text-[8px] font-bold text-slate-500">
                    Total
                  </span>

                </div>

              </div>

              {/* Distribution rows */}

              <div className="flex flex-col gap-3 flex-1">

                <DistRow
                  color="bg-red-500"
                  label="High Risk"
                  val={riskStats.high}
                  perc={`(${percentages.high}%)`}
                />

                <DistRow
                  color="bg-orange-500"
                  label="Medium Risk"
                  val={riskStats.medium}
                  perc={`(${percentages.medium}%)`}
                />

                <DistRow
                  color="bg-emerald-500"
                  label="Low Risk"
                  val={riskStats.low}
                  perc={`(${percentages.low}%)`}
                />

              </div>

            </div>

          </div>
        )}

        {/* ================================================= */}
        {/* RISK OVERVIEW */}
        {/* ================================================= */}

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-4">

          <div className="flex justify-between items-center mb-4">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Threat Overview
              </h2>

              <p className="text-[9px] text-slate-400 mt-1">
                Based on currently saved investigations
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />

          </div>

          <div className="space-y-4">

            <RiskBar
              label="High Risk"
              value={riskStats.high}
              percentage={percentages.high}
              color="bg-red-500"
            />

            <RiskBar
              label="Medium Risk"
              value={riskStats.medium}
              percentage={percentages.medium}
              color="bg-orange-500"
            />

            <RiskBar
              label="Low Risk"
              value={riskStats.low}
              percentage={percentages.low}
              color="bg-emerald-500"
            />

          </div>

        </div>

        {/* ================================================= */}
        {/* RECENT HIGH RISK */}
        {/* ================================================= */}

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">

          <div className="flex justify-between items-center mb-4">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent High Risk Detections
              </h2>

              <p className="text-[9px] text-slate-400 mt-1">
                Emails requiring attention
              </p>
            </div>

            <button
              onClick={() => navigate('/history')}
              className="text-[10px] font-bold text-[#312e81] hover:underline"
            >
              View History
            </button>

          </div>

          {recentHighRisk.length === 0 ? (

            <div className="text-center py-6">

              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />

              <p className="text-xs font-bold text-slate-600">
                No high-risk investigations
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                High-risk analyzed emails will appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {recentHighRisk.map((item, index) => (

                <div key={item.id || item.messageId || index}>

                  <ReportItem
                    item={item}
                    onClick={() => {
                      if (item.messageId) {
                        navigate(`/inbox/${item.messageId}`);
                      }
                    }}
                  />

                  {index < recentHighRisk.length - 1 && (
                    <div className="h-px w-full bg-slate-50 mt-3" />
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <BottomNav activePage="dashboard" />

    </div>
  );
}


/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  trend,
  color
}) {
  const bgColors = {
    indigo: 'bg-indigo-50',
    red: 'bg-red-50',
    orange: 'bg-orange-50',
    emerald: 'bg-emerald-50'
  };

  const textColors = {
    indigo: 'text-[#312e81]',
    red: 'text-red-600',
    orange: 'text-orange-600',
    emerald: 'text-emerald-600'
  };

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col">

      <div className="flex items-center gap-2 mb-3">

        <div className={`p-1.5 rounded-lg ${bgColors[color]}`}>

          <Icon
            className={`w-3.5 h-3.5 stroke-[2.5] ${textColors[color]}`}
          />

        </div>

        <span className="text-[10px] font-bold text-slate-500 tracking-wide">
          {title}
        </span>

      </div>

      <div className="mt-auto">

        <p className="text-xl font-black text-slate-900 leading-none">
          {value}
        </p>

        <p className="text-[8px] font-bold text-slate-400 mt-1">
          {trend}
        </p>

      </div>

    </div>
  );
}


/* ================================================= */
/* DISTRIBUTION ROW */
/* ================================================= */

function DistRow({
  color,
  label,
  val,
  perc
}) {
  return (
    <div className="flex justify-between items-center text-[10px]">

      <div className="flex items-center font-bold text-slate-700">

        <div
          className={`w-2 h-2 rounded-full ${color} mr-2`}
        />

        {label}

      </div>

      <div className="font-bold text-slate-900">

        {val}

        <span className="text-slate-400 ml-1">
          {perc}
        </span>

      </div>

    </div>
  );
}


/* ================================================= */
/* RISK BAR */
/* ================================================= */

function RiskBar({
  label,
  value,
  percentage,
  color
}) {
  return (
    <div>

      <div className="flex justify-between items-center text-[10px] font-bold mb-1">

        <span className="text-slate-700">
          {label}
        </span>

        <span className="text-slate-900">
          {value} ({percentage}%)
        </span>

      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">

        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  );
}


/* ================================================= */
/* HIGH-RISK REPORT ITEM */
/* ================================================= */

function ReportItem({
  item,
  onClick
}) {
  const riskScore = item.riskScore;

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between group ${
        item.messageId ? 'cursor-pointer' : ''
      }`}
    >

      <div className="flex items-center gap-3 flex-1 min-w-0">

        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">

          <Mail className="w-4 h-4 text-red-500" />

        </div>

        <div className="flex-1 min-w-0">

          <p className="text-[11px] font-bold text-slate-900 line-clamp-1">
            {item.title || 'Email Investigation'}
          </p>

          <p className="text-[9px] text-slate-500 truncate mt-0.5">
            {item.detail || item.sender || 'Unknown sender'}
          </p>

          {riskScore !== null && riskScore !== undefined && (
            <p className="text-[8px] text-slate-400 mt-0.5">
              Risk score: {riskScore}
            </p>
          )}

        </div>

      </div>

      <div className="text-right ml-2 shrink-0">

        <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
          High Risk
        </span>

        <p className="text-[8px] font-medium text-slate-400 mt-1">
          {item.date || 'Unknown date'}
        </p>

      </div>

      <Eye className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#312e81] ml-2 shrink-0" />

    </div>
  );
}