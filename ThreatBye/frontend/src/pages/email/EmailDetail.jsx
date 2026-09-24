import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Shield,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Link as LinkIcon,
  Globe,
  Brain,
  FileCheck,
  Lock
} from 'lucide-react';

export default function EmailDetail() {
  const navigate = useNavigate();
  const { messageId } = useParams();

  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    fetchEmail();
  }, [messageId]);

  const fetchEmail = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://127.0.0.1:8000/gmail/messages/${messageId}`
      );

      if (!response.ok) {
        throw new Error('Unable to load this email.');
      }

      const data = await response.json();
      setEmail(data.message);

    } catch (error) {
      console.error('Email detail error:', error);
      setError(error.message || 'Unable to load email.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeThreat = async () => {
  try {
    setAnalyzing(true);
    setAnalysisError('');
    setAnalysis(null);

    const response = await fetch(
      `http://127.0.0.1:8000/gmail/analyze/${messageId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || 'Unable to analyze this email.'
      );
    }

    console.log('Threat analysis result:', data);

    // Save analyzed email to History
    try {
      const existingHistory = JSON.parse(
        localStorage.getItem('threatbye_history') || '[]'
      );

      const historyItem = {
        id: data.evidence?.report_id || messageId,
        messageId: messageId,
        type: 'mail',
        title: data.email?.subject || email?.subject || 'Email Investigation',
        detail: data.email?.from || email?.from || 'Unknown sender',
        sender: data.email?.from || email?.from || '',
        date:
          data.email?.date ||
          email?.date ||
          new Date().toLocaleString(),
        risk:
          data.risk?.level ||
          data.risk_level ||
          'UNKNOWN',
        scanned: true,
        riskScore:
          data.risk?.score ??
          data.risk_score ??
          null,
        reportId:
          data.evidence?.report_id || null
      };

      const updatedHistory = [
        historyItem,
        ...existingHistory.filter(
          item => item.messageId !== messageId
        )
      ];

      localStorage.setItem(
        'threatbye_history',
        JSON.stringify(updatedHistory)
      );

      console.log('Saved to ThreatBye History:', historyItem);

    } catch (historyError) {
      console.error(
        'Failed to save history:',
        historyError
      );
    }

    setAnalysis(data);

  } catch (error) {
    console.error('Threat analysis error:', error);

    setAnalysisError(
      error.message || 'Unable to analyze this email.'
    );

  } finally {
    setAnalyzing(false);
  }
  };

  const getHeader = (name) => {
    if (!email?.payload?.headers) return '';

    const header = email.payload.headers.find(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase()
    );

    return header?.value || '';
  };

  const sender = getHeader('From');
  const recipient = getHeader('To');
  const subject = getHeader('Subject');
  const date = getHeader('Date');

  /*
   * Analysis values
   */
  const riskScore =
    analysis?.risk_analysis?.risk_score ??
    analysis?.report?.threat?.risk_score ??
    0;

  const riskLevel =
    analysis?.risk_analysis?.risk_level ??
    analysis?.report?.threat?.risk_level ??
    'UNKNOWN';

  const mlPrediction =
    analysis?.ml_prediction?.label ??
    analysis?.report?.ml_prediction?.label ??
    'unknown';

  const mlConfidence =
    analysis?.ml_prediction?.confidence ??
    analysis?.report?.ml_prediction?.confidence ??
    0;

  const authentication =
    analysis?.authentication?.authentication ||
    analysis?.forensic_report?.authentication?.authentication ||
    {};

  const threatIntel =
    analysis?.threat_intelligence ||
    analysis?.forensic_report?.threat_intelligence ||
    {};

  const iocs =
    analysis?.iocs ||
    analysis?.forensic_report?.indicators_of_compromise ||
    {};

  const riskReasons =
    analysis?.risk_analysis?.reasons ||
    analysis?.report?.threat?.reasons ||
    [];

  const recommendation =
    analysis?.risk_analysis?.recommendation ||
    analysis?.report?.threat?.recommendation ||
    'Review this email carefully.';

  const evidence = analysis?.evidence;

  const riskColor =
    riskLevel === 'HIGH'
      ? 'text-red-600'
      : riskLevel === 'MEDIUM'
        ? 'text-orange-600'
        : riskLevel === 'LOW'
          ? 'text-emerald-600'
          : 'text-slate-600';

  const riskBg =
    riskLevel === 'HIGH'
      ? 'bg-red-50 border-red-100'
      : riskLevel === 'MEDIUM'
        ? 'bg-orange-50 border-orange-100'
        : riskLevel === 'LOW'
          ? 'bg-emerald-50 border-emerald-100'
          : 'bg-slate-50 border-slate-100';

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">

        <button
          onClick={() => navigate('/inbox')}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Email Details
        </h1>

        <div className="w-8"></div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center p-8">

          <div className="text-center">

            <RefreshCw className="w-7 h-7 text-[#312e81] animate-spin mx-auto mb-3" />

            <p className="text-sm font-bold text-slate-600">
              Loading email...
            </p>

          </div>

        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex-1 p-5">

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">

            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />

            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              onClick={fetchEmail}
              className="mt-4 px-5 py-2.5 bg-[#312e81] text-white rounded-lg text-xs font-bold"
            >
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* Main Email */}
      {!loading && !error && email && (

        <div className="p-4 flex-1">

          {/* Subject */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">

                <Mail className="w-5 h-5 text-[#312e81]" />

              </div>

              <div className="min-w-0">

                <h2 className="text-base font-black text-slate-900 break-words">
                  {subject || '(No subject)'}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {date}
                </p>

              </div>

            </div>

          </div>

          {/* Email Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">

            <h3 className="text-sm font-black text-slate-900 mb-4">
              Email Information
            </h3>

            <div className="space-y-3">

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  From
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1 break-words">
                  {sender || 'Unknown sender'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  To
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1 break-words">
                  {recipient || 'Unknown recipient'}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Date
                </p>

                <p className="text-xs font-bold text-slate-800 mt-1">
                  {date || 'Unknown date'}
                </p>
              </div>

            </div>

          </div>

          {/* Message Preview */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">

            <h3 className="text-sm font-black text-slate-900 mb-3">
              Message Preview
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {email.snippet || 'No message preview available.'}
            </p>

          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeThreat}
            disabled={analyzing}
            className="w-full flex items-center justify-center gap-3 bg-[#312e81] text-white font-bold rounded-xl py-4 shadow-md hover:bg-[#1e1b4b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Email...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Analyze Threat
              </>
            )}

          </button>

          {/* Analysis Error */}
          {analysisError && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-5">

              <div className="flex items-start gap-3">

                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />

                <div>

                  <h3 className="text-sm font-black text-red-700">
                    Analysis Failed
                  </h3>

                  <p className="text-xs text-red-600 mt-1">
                    {analysisError}
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* THREAT ANALYSIS RESULT */}
          {/* ================================================= */}

          {analysis && (
            <div className="mt-5 space-y-4">

              {/* Title */}
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">

                  <Shield className="w-5 h-5 text-[#312e81]" />

                </div>

                <div>

                  <h2 className="text-base font-black text-slate-900">
                    Threat Analysis
                  </h2>

                  <p className="text-[10px] text-slate-400">
                    ThreatBye Security Assessment
                  </p>

                </div>

              </div>

              {/* Risk Score */}
              <div className={`rounded-2xl border p-6 ${riskBg}`}>

                <div className="text-center">

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Risk Score
                  </p>

                  <div className={`text-5xl font-black mt-2 ${riskColor}`}>
                    {riskScore}
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    out of 100
                  </p>

                  <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white border ${riskColor}`}>

                    <Shield className="w-4 h-4" />

                    <span className="text-xs font-black">
                      {riskLevel} RISK
                    </span>

                  </div>

                </div>

              </div>

              {/* ML Detection */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">

                    <Brain className="w-4 h-4 text-purple-600" />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-slate-900">
                      Machine Learning Detection
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      AI-based email classification
                    </p>

                  </div>

                </div>

                <div className="flex justify-between items-center">

                  <span className="text-xs font-bold text-slate-500">
                    Prediction
                  </span>

                  <span className="text-xs font-black uppercase text-orange-600">
                    {mlPrediction}
                  </span>

                </div>

                <div className="mt-3">

                  <div className="flex justify-between mb-1">

                    <span className="text-[10px] font-bold text-slate-400">
                      Confidence
                    </span>

                    <span className="text-[10px] font-black text-slate-700">
                      {(mlConfidence * 100).toFixed(2)}%
                    </span>

                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-[#312e81] rounded-full"
                      style={{
                        width: `${Math.min(
                          mlConfidence * 100,
                          100
                        )}%`
                      }}
                    />

                  </div>

                </div>

              </div>

              {/* Authentication */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">

                    <Lock className="w-4 h-4 text-emerald-600" />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-slate-900">
                      Email Authentication
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      Sender authentication checks
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-3 gap-2">

                  <AuthBadge
                    label="SPF"
                    value={authentication.spf}
                  />

                  <AuthBadge
                    label="DKIM"
                    value={authentication.dkim}
                  />

                  <AuthBadge
                    label="DMARC"
                    value={authentication.dmarc}
                  />

                </div>

              </div>

              {/* Indicators */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">

                    <AlertTriangle className="w-4 h-4 text-orange-600" />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-slate-900">
                      Indicators of Compromise
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      Potentially relevant indicators
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">

                  <StatBox
                    icon={LinkIcon}
                    label="URLs"
                    value={iocs.urls?.length || 0}
                  />

                  <StatBox
                    icon={Globe}
                    label="Domains"
                    value={iocs.domains?.length || 0}
                  />

                  <StatBox
                    icon={Shield}
                    label="IP Addresses"
                    value={iocs.ip_addresses?.length || 0}
                  />

                </div>

                {iocs.urls?.length > 0 && (
                  <div>

                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                      Detected URLs
                    </p>

                    {iocs.urls.map((url, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-lg p-3 mb-2 break-all"
                      >
                        <p className="text-[10px] text-slate-600">
                          {url}
                        </p>
                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Threat Intelligence */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">

                    <Globe className="w-4 h-4 text-blue-600" />

                  </div>

                  <div>

                    <h3 className="text-sm font-black text-slate-900">
                      Threat Intelligence
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      External intelligence analysis
                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between mb-4">

                  <span className="text-xs font-bold text-slate-500">
                    Provider
                  </span>

                  <span className="text-xs font-black text-slate-800">
                    {threatIntel.external_intelligence?.provider || 'N/A'}
                  </span>

                </div>

                {threatIntel.domains?.map((domain, index) => (

                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-4"
                  >

                    <div className="flex justify-between items-center mb-3">

                      <span className="text-xs font-black text-slate-800 break-all">
                        {domain.domain}
                      </span>

                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {domain.status}
                      </span>

                    </div>

                    <div className="grid grid-cols-3 gap-2">

                      <MiniStat
                        label="Harmless"
                        value={domain.harmless}
                      />

                      <MiniStat
                        label="Suspicious"
                        value={domain.suspicious}
                      />

                      <MiniStat
                        label="Malicious"
                        value={domain.malicious}
                      />

                    </div>

                  </div>

                ))}

              </div>

              {/* Risk Reasons */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                <h3 className="text-sm font-black text-slate-900 mb-4">
                  Risk Assessment
                </h3>

                <div className="space-y-2">

                  {riskReasons.map((reason, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-2"
                    >

                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />

                      <p className="text-xs text-slate-600">
                        {reason}
                      </p>

                    </div>

                  ))}

                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">

                  <p className="text-[10px] font-black text-amber-700 uppercase mb-1">
                    Recommendation
                  </p>

                  <p className="text-xs text-amber-800 leading-relaxed">
                    {recommendation}
                  </p>

                </div>

              </div>

              {/* Forensic Evidence */}
              {evidence && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">

                      <FileCheck className="w-4 h-4 text-[#312e81]" />

                    </div>

                    <div>

                      <h3 className="text-sm font-black text-slate-900">
                        Forensic Evidence
                      </h3>

                      <p className="text-[10px] text-slate-400">
                        Evidence preservation record
                      </p>

                    </div>

                  </div>

                  <div className="space-y-3">

                    <EvidenceRow
                      label="Report ID"
                      value={evidence.report_id}
                    />

                    <EvidenceRow
                      label="SHA-256"
                      value={evidence.sha256}
                    />

                    <div className="flex justify-between items-center">

                      <span className="text-[10px] font-bold text-slate-400">
                        Storage
                      </span>

                      <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600">

                        <CheckCircle className="w-3 h-3" />

                        {evidence.stored ? 'STORED' : 'NOT STORED'}

                      </span>

                    </div>
                    

                  </div>
                  {/* View Forensic Report Button */}
                    <button
                      onClick={() =>
                        navigate(`/evi-locker/report/${evidence.report_id}`)
                      }
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-[#312e81] text-white rounded-xl py-3 text-xs font-black hover:bg-[#1e1b4b] transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      View Forensic Report
                    </button>

                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}


/* ================================================= */
/* Helper Components */
/* ================================================= */

function AuthBadge({ label, value }) {
  const passed =
    String(value || '').toLowerCase() === 'pass';

  return (
    <div
      className={`rounded-xl p-3 text-center border ${
        passed
          ? 'bg-emerald-50 border-emerald-100'
          : 'bg-red-50 border-red-100'
      }`}
    >

      {passed ? (
        <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-red-600 mx-auto mb-1" />
      )}

      <p className="text-[10px] font-black text-slate-700">
        {label}
      </p>

      <p
        className={`text-[9px] font-black uppercase ${
          passed
            ? 'text-emerald-600'
            : 'text-red-600'
        }`}
      >
        {value || 'UNKNOWN'}
      </p>

    </div>
  );
}


function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">

      <Icon className="w-4 h-4 text-[#312e81] mx-auto mb-1" />

      <p className="text-lg font-black text-slate-900">
        {value}
      </p>

      <p className="text-[9px] font-bold text-slate-400">
        {label}
      </p>

    </div>
  );
}


function MiniStat({ label, value }) {
  return (
    <div className="bg-white rounded-lg p-2 text-center border border-slate-100">

      <p className="text-sm font-black text-slate-900">
        {value ?? 0}
      </p>

      <p className="text-[8px] font-bold text-slate-400">
        {label}
      </p>

    </div>
  );
}


function EvidenceRow({ label, value }) {
  return (
    <div>

      <p className="text-[10px] font-bold text-slate-400 mb-1">
        {label}
      </p>

      <div className="bg-slate-50 rounded-lg p-3">

        <p className="text-[9px] font-mono text-slate-600 break-all">
          {value || 'N/A'}
        </p>

      </div>

    </div>
  );
}