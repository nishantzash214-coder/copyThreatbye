
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Bell, FileText, HelpCircle, Info,
  LogOut, ChevronRight, X, Camera
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Ye photo ko save rakhne aur input ko control karne ke liye hai
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Ye function tab chalega jab user device se photo select kar lega
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Fake frontend preview ke liye ek temporary link banana
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };
  const menuItems = [
    { icon: User, label: 'Account Information', route: '/profile/account' },
    { icon: Shield, label: 'Security Settings', route: '/profile/security' },
    { icon: Bell, label: 'Notification Settings', route: '/profile/notifications' },
    { icon: FileText, label: 'Privacy Policy', route: '/profile/privacy' },
    { icon: HelpCircle, label: 'Help & Support', route: '/profile/help' },
    { icon: Info, label: 'About ThreatBye', route: '/profile/about' },
  ];

  const handleLogout = () => {
    // Frontend demo logout
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-20">
      <div className="p-5 pt-8 bg-white border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 text-center">Profile</h1>
      </div>

      <div className="p-5 flex flex-col items-center mt-4 mb-6">
        <div className="relative mb-3">
          {/* Clickable Profile Picture Container */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-24 bg-[#e0e7ff] rounded-full flex items-center justify-center shadow-sm border-4 border-white cursor-pointer overflow-hidden relative group"
          >
            {/* Agar photo upload hui hai toh photo dikhao, warna default icon */}
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#312e81]" />
            )}

            {/* Hover/Tap karne par Camera icon wala overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Hidden Input File */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Mahendra Khatri</h2>
        {/* <p className="text-sm text-slate-500">Premium Member</p> */}
      </div>

      <div className="px-5 flex-1 flex flex-col gap-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
              <item.icon className="w-5 h-5 text-slate-700" />
            </div>
            <span className="flex-1 text-left text-sm font-bold text-slate-800">{item.label}</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        ))}

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center p-4 bg-red-50 rounded-2xl border border-red-100 mt-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="flex-1 text-left text-sm font-bold text-red-600">Logout</span>
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Logout</h3>
              <button onClick={() => setShowLogoutModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-2">Are you sure you want to logout?</p>
            <p className="text-xs text-slate-500 mb-6">You will need to login again to access your account.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activePage="profile" />
    </div>
  );
}