import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  Loader2,
  X,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Shield,
  FileText
} from 'lucide-react';

export default function UploadMail() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError('');
    setResult(null);

    // Backend/project limit
    if (file.size > 25 * 1024 * 1024) {
      setError('File is larger than the 25MB limit.');
      return;
    }

    setSelectedFile(file);
    uploadAndAnalyze(file);
  };

  const uploadAndAnalyze = async (file) => {
    setStatus('scanning');
    setProgress(5);
    setError('');

    let progressTimer;

    try {
      // Visual progress only while the real backend request is running.
      progressTimer = setInterval(() => {
        setProgress((current) => {
          if (current >= 90) {
            return current;
          }

          return Math.min(
            current + Math.floor(Math.random() * 8) + 2,
            90
          );
        });
      }, 500);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'http://127.0.0.1:8000/api/upload-email',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          'Unable to analyze the uploaded email.'
        );
      }

      console.log('Upload analysis result:', data);

      clearInterval(progressTimer);
      setProgress(100);

      setResult(data);

      // Save this investigation to the same history
      // used by History, Alerts, Risk Dashboard and Evi Locker.
      const existingHistory = JSON.parse(
        localStorage.getItem('threatbye_history') || '[]'
      );

      const reportId =
        data.evidence?.report_id ||
        data.report_id ||
        data.reportId ||
        null;

      const risk =
        data.risk?.level ||
        data.risk_level ||
        data.riskLevel ||
        'UNKNOWN';

      const riskScore =
        data.risk?.score ??
        data.risk_score ??
        data.riskScore ??
        null;

      const emailSubject =
        data.email?.subject ||
        data.subject ||
        file.name ||
        'Uploaded Email Investigation';

      const sender =
        data.email?.from ||
        data.from ||
        data.sender ||
        'Uploaded Email';

      const historyItem = {
        id: reportId || `upload-${Date.now()}`,
        messageId: null,
        type: 'mail',
        title: emailSubject,
        detail: sender,
        sender: sender,
        date:
          data.email?.date ||
          data.date ||
          new Date().toLocaleString(),
        risk: risk,
        scanned: true,
        riskScore: riskScore,
        reportId: reportId
      };

      const updatedHistory = [
        historyItem,
        ...existingHistory.filter(
          (item) =>
            item.reportId !== reportId ||
            !reportId
        )
      ];

      localStorage.setItem(
        'threatbye_history',
        JSON.stringify(updatedHistory)
      );

      setStatus('success');
    } catch (uploadError) {
      console.error('Upload analysis error:', uploadError);

      if (progressTimer) {
        clearInterval(progressTimer);
      }

      setStatus('error');

      setError(
        uploadError.message ||
        'Unable to analyze the uploaded email.'
      );
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setStatus('idle');
    setProgress(0);
    setError('');
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewReport = () => {
    const reportId =
      result?.evidence?.report_id ||
      result?.report_id ||
      result?.reportId;

    if (reportId) {
      navigate(`/evi-locker/report/${reportId}`);
      return;
    }

    navigate('/evi-locker');
  };

  const getRiskConfig = () => {
    const risk = String(
      result?.risk?.level ||
      result?.risk_level ||
      result?.riskLevel ||
      ''
    ).toUpperCase();

    if (risk === 'HIGH' || risk === 'HIGH RISK') {
      return {
        label: 'HIGH RISK',
        icon: ShieldAlert,
        bg: 'bg-red-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-700'
      };
    }

    if (
      risk === 'MEDIUM' ||
      risk === 'MEDIUM RISK'
    ) {
      return {
        label: 'MEDIUM RISK',
        icon: AlertTriangle,
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        textColor: 'text-orange-700'
      };
    }

    return {
      label: 'LOW RISK',
      icon: Shield,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700'
    };
  };

  const riskConfig = getRiskConfig();
  const RiskIcon = riskConfig.icon;

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100">

        <button
          onClick={() =>
            status === 'scanning'
              ? handleCancel()
              : navigate(-1)
          }
          className="text-slate-800 p-1"
        >
          {status === 'scanning' ? (
            <X className="w-6 h-6" />
          ) : (
            <ArrowLeft className="w-6 h-6" />
          )}
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Upload Mail
        </h1>

        <div className="w-8" />
      </div>

      <div className="p-5 flex-1 flex flex-col">

        {/* IDLE */}
        {status === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center">

            <div
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="w-full max-w-sm aspect-square bg-white border-2 border-dashed border-[#c7d2fe] rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
            >

              <div className="w-20 h-20 bg-[#e0e7ff] rounded-2xl flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-[#312e81]" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">
                Select suspicious email
              </h2>

              <p className="text-xs text-slate-500 text-center max-w-[220px]">
                Upload an email file for real ThreatBye analysis.
                Maximum size: 25MB.
              </p>

              <button
                type="button"
                className="mt-8 px-8 py-3 bg-[#312e81] text-white font-bold text-sm rounded-xl shadow-sm"
              >
                Browse Files
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".eml,.msg,.txt"
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-4 w-full max-w-sm bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs font-medium text-center">
                {error}
              </div>
            )}

          </div>
        )}

        {/* SCANNING */}
        {status === 'scanning' && (
          <div className="flex-1 flex flex-col items-center justify-center">

            <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-sm border border-slate-100 flex flex-col items-center">

              <Loader2 className="w-12 h-12 text-[#312e81] animate-spin mb-4" />

              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Analyzing Email
              </h2>

              <p className="text-xs text-slate-500 mb-6 text-center">
                ThreatBye is analyzing{' '}
                <span className="font-bold text-slate-700">
                  {selectedFile?.name}
                </span>
                {' '}for threats, IOCs and security indicators.
              </p>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-[#312e81] h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>

              <p className="text-[10px] font-bold text-[#312e81] self-end">
                {progress}%
              </p>

            </div>
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center">

            <div className="bg-white p-7 rounded-3xl w-full max-w-sm shadow-sm border border-red-100 flex flex-col items-center text-center">

              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Analysis Failed
              </h2>

              <p className="text-xs text-red-600 mb-5">
                {error}
              </p>

              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-[#312e81] text-white rounded-xl text-xs font-bold"
              >
                Try Another File
              </button>

            </div>
          </div>
        )}

        {/* SUCCESS */}
        {status === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center">

            <div className="bg-white p-7 rounded-3xl w-full max-w-sm shadow-sm border border-slate-100">

              {/* Success */}
              <div className="flex flex-col items-center text-center">

                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  Analysis Complete
                </h2>

                <p className="text-xs text-slate-500 mb-5 truncate max-w-full">
                  {selectedFile?.name}
                </p>

              </div>

              {/* Risk */}
              <div
                className={`rounded-2xl p-4 ${riskConfig.bg} flex items-center gap-3 mb-4`}
              >

                <div
                  className={`w-11 h-11 rounded-xl ${riskConfig.iconBg} flex items-center justify-center`}
                >
                  <RiskIcon
                    className={`w-6 h-6 ${riskConfig.iconColor}`}
                  />
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Threat Assessment
                  </p>

                  <p
                    className={`text-sm font-black ${riskConfig.textColor}`}
                  >
                    {riskConfig.label}
                  </p>
                </div>

              </div>

              {/* Evidence */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-5">

                <div className="flex items-center gap-3">

                  <FileText className="w-5 h-5 text-slate-500" />

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">
                      Forensic Evidence
                    </p>

                    <p className="text-[10px] text-slate-500 truncate">
                      {result?.evidence?.report_id ||
                        result?.report_id ||
                        result?.reportId ||
                        'Evidence stored'}
                    </p>
                  </div>

                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">

                <button
                  onClick={handleViewReport}
                  className="w-full flex items-center justify-center gap-2 bg-[#312e81] text-white rounded-xl py-3 text-xs font-bold hover:bg-[#1e1b4b] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Forensic Report
                </button>

                <button
                  onClick={() => navigate('/evi-locker')}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Open Evidence Locker
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}