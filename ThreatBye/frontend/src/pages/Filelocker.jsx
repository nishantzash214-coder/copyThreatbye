import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Search, Filter, MoreVertical, 
  Shield, FolderOpen
} from 'lucide-react';

export default function Filelocker() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State to hold uploaded files (starts empty)
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Email Files', 'Attachments', 'Others'];

  // Handle + button click (opens file explorer)
  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map(file => {
        // Get file extension
        const ext = file.name.split('.').pop().toUpperCase();
        
        // Format date and time
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          type: ext.substring(0, 4), // Keep it short (e.g., XLSX)
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          date: `${dateStr} • ${timeStr}`
        };
      });

      // Add new files to the top of the list
      setFiles([...newFiles, ...files]);
    }
  };

  // Helper function for file icon colors based on extension
  const getFileStyle = (type) => {
    switch(type) {
      case 'PDF': return 'bg-red-100 text-red-600';
      case 'EML': return 'bg-blue-100 text-blue-600';
      case 'XLSX':
      case 'XLS':
      case 'CSV': return 'bg-green-100 text-green-600';
      case 'ZIP':
      case 'RAR': return 'bg-purple-100 text-purple-600';
      case 'PNG':
      case 'JPG':
      case 'JPEG': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-slate-200 text-slate-600'; // Default gray
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col pb-6">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Top Header */}
      <div className="flex items-center justify-between p-5 pt-8">
        <button onClick={() => navigate(-1)} className="text-slate-800 p-1 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">
          Filelocker
        </h1>
        <button 
          onClick={handleAddClick}
          className="bg-[#312e81] text-white p-2 rounded-xl shadow-sm hover:bg-[#1e1b4b] active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-4 flex gap-3">
        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-[#312e81] transition-colors">
          <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <button className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 flex space-x-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium whitespace-nowrap pb-2 ${
              activeTab === tab 
                ? 'text-[#312e81] border-b-2 border-[#312e81]' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Files List Area */}
      <div className="px-5 flex-1 flex flex-col gap-3">
        
        {files.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center flex-1 py-10 opacity-70">
            <FolderOpen className="w-16 h-16 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium text-center">Locker is empty</p>
            <p className="text-slate-400 text-sm text-center mt-1">Tap the + icon to secure your files</p>
          </div>
        ) : (
          // Uploaded Files
          files.map((file) => (
            <div key={file.id} className="bg-white rounded-2xl p-4 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
              
              {/* File Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-[11px] mr-4 flex-shrink-0 ${getFileStyle(file.type)}`}>
                {file.type}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-bold text-slate-900 truncate mb-0.5">{file.name}</h3>
                <p className="text-xs text-slate-500 truncate">
                  {file.type} • {file.size}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {file.date}
                </p>
              </div>

              {/* Options */}
              <button className="text-slate-400 p-1 hover:text-slate-700 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))
        )}

      </div>

      {/* Secure Storage Footer */}
      <div className="mx-5 mt-6 bg-[#e0e7ff] rounded-2xl p-4 flex items-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] mb-4">
        <Shield className="w-8 h-8 text-[#312e81] mr-4 flex-shrink-0 stroke-[1.5]" />
        <div>
          <h4 className="text-sm font-bold text-[#312e81]">Secure Storage</h4>
          <p className="text-xs text-[#3730a3] mt-0.5 leading-tight">
            All your files are encrypted and stored securely.
          </p>
        </div>
      </div>

    </div>
  );
}