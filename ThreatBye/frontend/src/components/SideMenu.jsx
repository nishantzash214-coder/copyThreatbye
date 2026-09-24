import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, UploadCloud, Mail, ShieldAlert, BarChart2,
    Clock, FileText, AlertCircle, User, Shield, Sun, Moon, X
} from 'lucide-react';

export default function SideMenu({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();


    // NAYA CODE: Theme state manage karne ke liye
    <div className="flex items-center justify-between px-2 text-slate-600 cursor-not-allowed opacity-70">
        <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold">Theme</span>
        </div>
        <span className="text-[10px] font-bold uppercase">Light Mode</span>
    </div>

    // ... baaki ka purana code (menuItems wagaira)

    const menuItems = [
        { icon: Home, label: 'Dashboard', route: '/dashboard' },
        { icon: UploadCloud, label: 'Upload Mail', route: '/upload' },
        { icon: Mail, label: 'Access to Email', route: '/access-email' }, // Add route if exists
        { icon: ShieldAlert, label: 'Risk Analyzer Score', route: '/risk-score' }, // Add route if exists
        { icon: BarChart2, label: 'Risk Analyzed Dashboard', route: '/risk-dashboard' },
        { icon: Clock, label: 'History', route: '/history' },
        { icon: FileText, label: 'Reports', route: '/reports' },
        { icon: AlertCircle, label: 'Alerts', route: '/alerts' },
        { icon: User, label: 'Profile', route: '/profile' },
    ];

    const handleNavigation = (route) => {
        navigate(route);
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 transition-opacity backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[280px] bg-[#f8f9fc] z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-5 flex items-center justify-between border-b border-slate-200/60 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#312e81] rounded-lg flex items-center justify-center shadow-md">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 text-lg">ThreatBye</span>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-3 py-4 space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.route;
                        return (
                            <button
                                key={index}
                                onClick={() => handleNavigation(item.route)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-colors ${isActive
                                    ? 'bg-[#e0e7ff] text-[#312e81]'
                                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 bg-white mt-auto rounded-t-3xl border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <div className="bg-[#e0e7ff] p-4 rounded-2xl mb-4 border border-[#c7d2fe]">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-[#312e81]" />
                            <span className="text-xs font-bold text-[#312e81]">Stay Protected</span>
                        </div>
                        <p className="text-[10px] text-[#312e81]/80 font-medium">Keep analyzing and stay protected from threats.</p>
                    </div>
                   
                    {/* <div className="flex items-center justify-between px-2 text-slate-600 cursor-not-allowed opacity-70">
                       <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold">Theme</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase">Light Mode</span>
                    </div> */}
                </div>
            </div>
        </>
    );
}
