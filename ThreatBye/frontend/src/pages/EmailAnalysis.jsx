import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, ShieldCheck } from 'lucide-react';

export default function EmailAnalysis() {
  const navigate = useNavigate();

  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    try {
      const history = JSON.parse(
        localStorage.getItem('threatbye_history') || '[]'
      );

      if (history.length > 0) {
        const latest = history[0];

        setRiskData({
          score:
            latest.riskScore !== null &&
            latest.riskScore !== undefined
              ? Number(latest.riskScore)
              : null,

          level: latest.risk || 'UNKNOWN',

          title: latest.title || 'Analyzed Email',

          sender: latest.sender || latest.detail || 'Unknown sender',

          date: latest.date || ''
        });
      }
    } catch (error) {
      console.error('Unable to load risk analysis:', error);
    }
  }, []);

  const score = riskData?.score ?? 0;

  const getRiskLevel = (value) => {
    if (value >= 70) return 'HIGH RISK';
    if (value >= 40) return 'MEDIUM RISK';
    if (value > 0) return 'LOW RISK';
    return 'NOT ANALYZED';
  };

  const getRiskColor = (value) => {
    if (value >= 70) return '#dc2626';
    if (value >= 40) return '#f59e0b';
    return '#16a34a';
  };

  const riskLevel =
    riskData?.level && riskData.level !== 'UNKNOWN'
      ? String(riskData.level).toUpperCase()
      : getRiskLevel(score);

  const riskColor = getRiskColor(score);

  const circumference = 251.2;

  const dashOffset =
    circumference - (circumference * score) / 100;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-6">

      {/* Top Navigation */}
      <div className="flex items-center justify-between p-5 pt-8">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Risk Analyzer Score
        </h1>

        <button className="text-slate-800 p-1">
          <MoreHorizontal className="w-6 h-6" />
        </button>

      </div>

      <div className="px-5 flex flex-col gap-4">

        {/* Main Risk Score */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="flex flex-col items-center">

            <p className="text-sm font-semibold text-slate-500 mb-6">
              EMAIL RISK SCORE
            </p>

            {/* Circular Score */}
            <div className="relative w-52 h-52 flex items-center justify-center">

              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >

                {/* Background */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />

                {/* Score */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={riskColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    riskData?.score !== null
                      ? dashOffset
                      : circumference
                  }
                />

              </svg>

              <div className="absolute flex flex-col items-center">

                <span className="text-5xl font-black text-slate-900">
                  {riskData?.score ?? '--'}
                </span>

                <span className="text-sm text-slate-500 font-semibold mt-1">
                  / 100
                </span>

              </div>

            </div>

            {/* Risk Level */}
            <div className="mt-6 text-center">

              <p
                className="text-2xl font-black"
                style={{ color: riskColor }}
              >
                {riskLevel}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                {riskData
                  ? 'Based on the latest email threat analysis.'
                  : 'No analyzed email is available yet.'}
              </p>

            </div>

          </div>

        </div>

        {/* Analyzed Email */}
        {riskData && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Analyzed Email
            </h3>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Subject
                </p>

                <p className="text-sm text-slate-800 font-semibold mt-1 break-words">
                  {riskData.title}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Sender
                </p>

                <p className="text-sm text-slate-800 mt-1 break-words">
                  {riskData.sender}
                </p>
              </div>

              {riskData.date && (
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    Analyzed
                  </p>

                  <p className="text-sm text-slate-800 mt-1">
                    {riskData.date}
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Score Meaning */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="flex items-center gap-3 mb-4">

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  score >= 70
                    ? '#fef2f2'
                    : score >= 40
                    ? '#fffbeb'
                    : '#f0fdf4'
              }}
            >
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: riskColor }}
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Risk Assessment
              </h3>

              <p className="text-xs text-slate-500">
                Threat score interpretation
              </p>
            </div>

          </div>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-slate-500">
                0 – 39
              </span>

              <span className="font-semibold text-green-600">
                Low Risk
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                40 – 69
              </span>

              <span className="font-semibold text-orange-500">
                Medium Risk
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                70 – 100
              </span>

              <span className="font-semibold text-red-600">
                High Risk
              </span>
            </div>

          </div>

        </div>

        {/* Open Email */}
        {riskData?.messageId && (
          <button
            onClick={() => navigate(`/inbox/${riskData.messageId}`)}
            className="w-full bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold rounded-xl py-3.5 transition-colors"
          >
            View Analyzed Email
          </button>
        )}

      </div>
    </div>
  );
}