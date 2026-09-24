import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  ShieldAlert,
  CheckCircle,
  Mail,
  MapPin,
  Globe,
  FileText,
  Link2,
  ShieldCheck,
  Hash,
  RefreshCw
} from 'lucide-react';

export default function ReportDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const loadReport = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `https://copythreatbye.onrender.com/investigation/report/${caseId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to load forensic report.'
        );
      }

      console.log('Forensic report:', data);

      setReport(data);
    } catch (err) {
      console.error('Forensic report error:', err);
      setError(
        err.message || 'Unable to load forensic report.'
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyIntegrity = async () => {
    try {
      setVerifying(true);

      const response = await fetch(
        `https://copythreatbye.onrender.com/investigation/verify/${caseId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to verify evidence integrity.'
        );
      }

      console.log('Integrity verification:', data);

      setIntegrity(data);
    } catch (err) {
      console.error('Integrity verification error:', err);
      setIntegrity({
        integrity_valid: false,
        error:
          err.message || 'Integrity verification failed.'
      });
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [caseId]);

  const getValue = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        return value;
      }
    }

    return 'Not available';
  };

  const email = report?.email || {};
  const risk = report?.risk || {};
  const ml = report?.ml || {};
  const iocs = report?.iocs || {};
  const auth = report?.authentication || {};
  const vt = report?.virustotal || {};
  const evidence = report?.evidence || {};

  const riskScore = getValue(
    risk.score,
    report?.risk_score,
    report?.score,
    0
  );

  const riskLevel = String(
    getValue(
      risk.level,
      report?.risk_level,
      report?.threat_level,
      'UNKNOWN'
    )
  ).toUpperCase();

  const isHighRisk =
    riskLevel === 'HIGH' ||
    riskLevel === 'HIGH RISK';

  const isMediumRisk =
    riskLevel === 'MEDIUM' ||
    riskLevel === 'MEDIUM RISK';

  const riskColor = isHighRisk
    ? 'text-red-600'
    : isMediumRisk
      ? 'text-orange-600'
      : 'text-emerald-600';

  const riskBg = isHighRisk
    ? 'bg-red-50'
    : isMediumRisk
      ? 'bg-orange-50'
      : 'bg-emerald-50';

  const riskDot = isHighRisk
    ? 'bg-red-600'
    : isMediumRisk
      ? 'bg-orange-600'
      : 'bg-emerald-600';

  const formatArray = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (value === undefined || value === null || value === '') {
      return [];
    }

    return [value];
  };

  const urls = formatArray(
    iocs.urls || report?.urls
  );

  const domains = formatArray(
    iocs.domains || report?.domains
  );

  const ips = formatArray(
    iocs.ips || report?.ips
  );

  const indicators = formatArray(
    risk.reasons ||
    report?.threat_indicators ||
    report?.indicators
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

        <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-800 p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-bold text-slate-900">
            Forensic Report
          </h1>

          <div className="w-8" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-[#312e81] animate-spin mb-3" />

            <p className="text-sm font-bold text-slate-700">
              Loading forensic evidence...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

        <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-800 p-1"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-bold text-slate-900">
            Forensic Report
          </h1>

          <div className="w-8" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl p-7 text-center border border-red-100 max-w-sm">

            <ShieldAlert className="w-10 h-10 text-red-600 mx-auto mb-3" />

            <h2 className="text-base font-bold text-slate-900 mb-2">
              Report unavailable
            </h2>

            <p className="text-xs text-slate-500 mb-5">
              {error || 'No forensic evidence was found for this report.'}
            </p>

            <button
              onClick={loadReport}
              className="bg-[#312e81] text-white px-5 py-3 rounded-xl text-xs font-bold"
            >
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-8">

      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8 bg-white border-b border-slate-100 sticky top-0 z-10">

        <button
          onClick={() => navigate(-1)}
          className="text-slate-800 p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-slate-900">
          Forensic Report
        </h1>

        <button
          onClick={loadReport}
          className="text-slate-800 p-1"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

      </div>

      <div className="px-5 pt-6 flex-1">

        {/* Report ID */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 bg-[#e0e7ff] text-[#312e81] border border-[#c7d2fe] px-4 py-2 rounded-full font-bold text-xs max-w-full">

            <ShieldAlert className="w-4 h-4 flex-shrink-0" />

            <span className="truncate">
              {caseId}
            </span>

          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Risk Level
            </p>

            <div
              className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md ${riskBg} ${riskColor}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${riskDot}`}
              />

              {riskLevel}
            </div>

          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">

            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Investigation
            </p>

            <div className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600">

              <CheckCircle className="w-3.5 h-3.5 mr-1" />

              Complete

            </div>

          </div>

        </div>

        {/* Email Information */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">

            <Mail className="w-4 h-4 mr-2 text-slate-400" />

            Email Information

          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">
                Sender
              </p>

              <p className="text-sm font-bold text-slate-800 break-all">
                {getValue(
                  email.from,
                  report.from,
                  report.sender
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">
                Subject
              </p>

              <p className="text-sm font-bold text-slate-800">
                {getValue(
                  email.subject,
                  report.subject
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500 font-medium mb-0.5">
                Received
              </p>

              <p className="text-sm font-bold text-slate-800">
                {getValue(
                  email.date,
                  report.date
                )}
              </p>
            </div>

          </div>
        </div>

        {/* Threat Score */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-5">

            <ShieldAlert className="w-4 h-4 mr-2 text-slate-400" />

            Threat Assessment

          </h2>

          <div className="flex items-center gap-5">

            <div className="relative w-24 h-24 flex-shrink-0">

              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={
                    isHighRisk
                      ? '#dc2626'
                      : isMediumRisk
                        ? '#f97316'
                        : '#059669'
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 -
                    (251.2 *
                      Math.min(
                        100,
                        Math.max(0, Number(riskScore) || 0)
                      )) /
                      100
                  }
                />

              </svg>

              <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-900">
                {riskScore}
              </span>

            </div>

            <div>

              <p className={`text-sm font-black ${riskColor}`}>
                {riskLevel}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Threat score from the completed investigation.
              </p>

            </div>

          </div>

        </div>

        {/* ML Detection */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />

            AI / ML Detection

          </h2>

          <div className="grid grid-cols-2 gap-3">

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">
                Classification
              </p>

              <p className="text-sm font-black text-slate-800">
                {getValue(
                  ml.label,
                  ml.classification,
                  report.ml_label,
                  'Not available'
                )}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">
                Confidence
              </p>

              <p className="text-sm font-black text-slate-800">
                {ml.confidence !== undefined &&
                ml.confidence !== null
                  ? `${(
                      Number(ml.confidence) * 100
                    ).toFixed(1)}%`
                  : 'Not available'}
              </p>
            </div>

          </div>

        </div>

        {/* Authentication */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <ShieldCheck className="w-4 h-4 mr-2 text-slate-400" />

            Email Authentication

          </h2>

          <div className="grid grid-cols-3 gap-2">

            <AuthBadge
              label="SPF"
              value={auth.spf}
            />

            <AuthBadge
              label="DKIM"
              value={auth.dkim}
            />

            <AuthBadge
              label="DMARC"
              value={auth.dmarc}
            />

          </div>

        </div>

        {/* IOC Findings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">

            <Link2 className="w-4 h-4 mr-2 text-slate-400" />

            Indicators of Compromise

          </h2>

          <IocSection
            title="URLs"
            items={urls}
          />

          <IocSection
            title="Domains"
            items={domains}
          />

          <IocSection
            title="IP Addresses"
            items={ips}
          />

          {urls.length === 0 &&
            domains.length === 0 &&
            ips.length === 0 && (
              <p className="text-xs text-slate-500">
                No IOC values were extracted.
              </p>
            )}

        </div>

        {/* Threat Intelligence */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <Globe className="w-4 h-4 mr-2 text-slate-400" />

            Threat Intelligence

          </h2>

          <div className="space-y-3">

            <InfoRow
              label="VirusTotal"
              value={
                vt.domain_reputation ??
                vt.reputation ??
                'Not available'
              }
            />

            <InfoRow
              label="Malicious"
              value={
                vt.malicious ??
                vt.stats?.malicious ??
                '0'
              }
            />

            <InfoRow
              label="Suspicious"
              value={
                vt.suspicious ??
                vt.stats?.suspicious ??
                '0'
              }
            />

          </div>

        </div>

        {/* Forensic Evidence */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <Hash className="w-4 h-4 mr-2 text-slate-400" />

            Forensic Evidence

          </h2>

          <div className="space-y-3">

            <InfoRow
              label="Report ID"
              value={getValue(
                evidence.report_id,
                caseId
              )}
            />

            <InfoRow
              label="SHA-256"
              value={getValue(
                evidence.sha256,
                evidence.hash,
                report.sha256
              )}
              mono
            />

            <InfoRow
              label="Evidence Stored"
              value={
                evidence.stored === true
                  ? 'Yes'
                  : evidence.stored === false
                    ? 'No'
                    : 'Available'
              }
            />

          </div>

          <button
            onClick={verifyIntegrity}
            disabled={verifying}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 rounded-xl py-3 text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-60"
          >

            {verifying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}

            {verifying
              ? 'Verifying Integrity...'
              : 'Verify SHA-256 Integrity'}

          </button>

          {integrity && (
            <div
              className={`mt-3 rounded-xl p-3 text-xs font-bold ${
                integrity.integrity_valid
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {integrity.integrity_valid
                ? 'Integrity verified — evidence hash matches.'
                : integrity.error ||
                  'Integrity verification failed.'}
            </div>
          )}

        </div>

        {/* Threat Indicators */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <ShieldAlert className="w-4 h-4 mr-2 text-slate-400" />

            Investigation Findings

          </h2>

          {indicators.length > 0 ? (
            <ul className="space-y-2">

              {indicators.map((indicator, index) => (
                <li
                  key={index}
                  className="text-xs text-slate-700 flex items-start"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 shrink-0" />

                  <span>
                    {indicator}
                  </span>
                </li>
              ))}

            </ul>
          ) : (
            <p className="text-xs text-slate-500">
              No additional findings were recorded.
            </p>
          )}

        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">

          <h2 className="flex items-center text-sm font-bold text-slate-900 mb-4">

            <MapPin className="w-4 h-4 mr-2 text-slate-400" />

            Network / Location

          </h2>

          <div className="space-y-3">

            <InfoRow
              label="IP Address"
              value={getValue(
                report.ip,
                report.ip_address,
                iocs.ip
              )}
            />

            <InfoRow
              label="Location"
              value={getValue(
                report.location,
                report.geolocation?.location,
                report.geolocation?.country
              )}
            />

            <InfoRow
              label="Domain"
              value={getValue(
                domains[0],
                report.domain
              )}
            />

          </div>

        </div>

        {/* Back / Locker */}
        <div className="space-y-3 mb-8">

          <button
            onClick={() => navigate('/evi-locker')}
            className="w-full bg-[#312e81] hover:bg-[#1e1b4b] text-white font-bold rounded-xl py-4 transition-colors"
          >
            Back to Evidence Locker
          </button>

          <button
            onClick={() => navigate('/inbox')}
            className="w-full bg-white hover:bg-slate-50 text-[#312e81] border border-[#c7d2fe] font-bold rounded-xl py-4 transition-colors flex justify-center items-center gap-2"
          >
            <Mail className="w-4 h-4" />

            Open Gmail Inbox
          </button>

        </div>

      </div>
    </div>
  );
}

function AuthBadge({ label, value }) {
  const normalized = String(value || '').toLowerCase();

  const passed =
    normalized === 'pass' ||
    normalized === 'passed' ||
    normalized === 'true';

  return (
    <div
      className={`rounded-xl p-3 text-center ${
        passed
          ? 'bg-emerald-50'
          : 'bg-slate-50'
      }`}
    >

      <p className="text-[10px] text-slate-500 mb-1">
        {label}
      </p>

      <p
        className={`text-xs font-black ${
          passed
            ? 'text-emerald-600'
            : 'text-slate-700'
        }`}
      >
        {getAuthText(value)}
      </p>

    </div>
  );
}

function getAuthText(value) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return 'N/A';
  }

  return String(value).toUpperCase();
}

function IocSection({ title, items }) {
  return (
    <div className="mb-4 last:mb-0">

      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          {title}
        </p>

        <span className="text-[10px] font-black text-slate-400">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="space-y-2">

          {items.slice(0, 10).map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="bg-slate-50 rounded-lg p-2.5 text-[10px] text-slate-700 break-all font-medium"
            >
              {item}
            </div>
          ))}

        </div>
      ) : (
        <p className="text-[10px] text-slate-400">
          None detected
        </p>
      )}

    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 font-medium mb-0.5">
        {label}
      </p>

      <p
        className={`text-xs font-bold text-slate-800 break-all ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function getValue(...values) {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      return value;
    }
  }

  return 'Not available';
}
