import BottomNav from '../components/BottomNav';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Info,
  Mail,
  CheckCircle2
} from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Unread');
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = () => {
    try {
      const saved = localStorage.getItem('threatbye_history');

      if (!saved) {
        setAlerts([]);
        return;
      }

      const history = JSON.parse(saved);

      if (!Array.isArray(history)) {
        setAlerts([]);
        return;
      }

      const generatedAlerts = history
        .map((item, index) => {
          const risk = String(item.risk || '').toUpperCase();

          let type = 'info';
          let title = 'Email Scan Completed';
          let description = 'The email was analyzed successfully.';

          if (risk === 'HIGH' || risk === 'HIGH RISK') {
            type = 'critical';
            title = 'High Risk Threat Detected';
            description =
              `${item.title || 'Email'} was classified as high risk.`;
          } else if (
            risk === 'MEDIUM' ||
            risk === 'MEDIUM RISK'
          ) {
            type = 'warning';
            title = 'Suspicious Email Detected';
            description =
              `${item.title || 'Email'} requires further investigation.`;
          } else if (
            risk === 'LOW' ||
            risk === 'LOW RISK'
          ) {
            type = 'info';
            title = 'Low Risk Email Analyzed';
            description =
              `${item.title || 'Email'} was analyzed with low risk.`;
          }

          return {
            id: item.id || item.messageId || index,
            messageId: item.messageId || null,
            reportId: item.reportId || null,
            type,
            title,
            description,
            date: item.date || 'Unknown date',
            isUnread: true,
            risk
          };
        })
        .filter(Boolean);

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Alerts loading error:', error);
      setAlerts([]);
    }
  };

  useEffect(() => {
    loadAlerts();

    const handleStorage = () => {
      loadAlerts();
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const tabs = ['All', 'Unread', 'Critical', 'Others'];

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (activeTab === 'All') {
        return true;
      }

      if (activeTab === 'Unread') {
        return alert.isUnread;
      }

      if (activeTab === 'Critical') {
        return alert.type === 'critical';
      }

      if (activeTab === 'Others') {
        return alert.type !== 'critical';
      }

      return true;
    });
  }, [alerts, activeTab]);

  const markAllRead = () => {
    setAlerts((currentAlerts) =>
      currentAlerts.map((alert) => ({
        ...alert,
        isUnread: false
      }))
    );
  };

  const getAlertConfig = (type) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          iconColor: 'text-red-700',
          dotColor: 'bg-red-700',
          Icon: ShieldAlert
        };

      case 'warning':
        return {
          bg: 'bg-orange-50',
          iconColor: 'text-orange-600',
          dotColor: 'bg-orange-600',
          Icon: AlertTriangle
        };

      case 'info':
      default:
        return {
          bg: 'bg-[#f1f5f9]',
          iconColor: 'text-[#1e293b]',
          dotColor: 'bg-[#1e293b]',
          Icon: Info
        };
    }
  };

  const handleAlertClick = (alert) => {
    if (alert.messageId) {
      navigate(`/inbox/${alert.messageId}`);
      return;
    }

    if (alert.reportId) {
      navigate(`/evi-locker/report/${alert.reportId}`);
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
          Alerts
        </h1>

        {alerts.some((alert) => alert.isUnread) ? (
          <button
            onClick={markAllRead}
            className="text-xs font-bold text-[#312e81] hover:text-[#1e1b4b] transition-colors"
          >
            Mark all read
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 flex justify-between border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-3 px-1 relative ${
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

      {/* Alerts */}
      <div className="px-5 flex-1 flex flex-col gap-3">

        {filteredAlerts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h2 className="text-base font-bold text-slate-900 mb-1">
              No alerts
            </h2>

            <p className="text-xs text-slate-500 max-w-xs">
              {alerts.length === 0
                ? 'Analyze an email from Gmail to generate real security alerts.'
                : 'There are no alerts matching this filter.'}
            </p>

            {alerts.length === 0 && (
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
          filteredAlerts.map((alert) => {
            const config = getAlertConfig(alert.type);
            const IconComponent = config.Icon;

            return (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className={`w-full text-left rounded-2xl p-4 flex items-center shadow-[0_1px_5px_rgba(0,0,0,0.02)] relative ${config.bg} hover:scale-[1.01] transition-transform`}
              >

                {/* Icon */}
                <div className="mr-4 flex-shrink-0">
                  <IconComponent
                    className={`w-6 h-6 stroke-[2] ${config.iconColor}`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-6">

                  <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-700 truncate mb-1">
                    {alert.description}
                  </p>

                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {alert.date}
                  </p>

                </div>

                {/* Unread */}
                {alert.isUnread && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div
                      className={`w-2 h-2 rounded-full ${config.dotColor}`}
                    />
                  </div>
                )}

              </button>
            );
          })
        )}

      </div>

      <BottomNav activePage="alerts" />

    </div>
  );
}