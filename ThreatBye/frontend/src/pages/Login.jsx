import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock as LockIcon, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate(); // <-- Ye dekhiye, useNavigate yahan component ke theek andar hai
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login successful, routing to dashboard');
      navigate('/dashboard'); // <-- Aur yahan ye smoothly dashboard par le jayega
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm mx-auto flex flex-col">
        
        {/* Brand Section */}
        <div className="text-center mb-10">
          <Logo />
          <h1 className="text-2xl font-bold text-slate-900 mb-1">ThreatBye</h1>
          <p className="text-sm text-slate-500 tracking-wide">Detect. Trace. Protect.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div>
            <div className={`flex items-center border rounded-xl px-4 py-3 bg-white transition-colors focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}>
              <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <div className={`flex items-center border rounded-xl px-4 py-3 bg-white transition-colors focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}>
              <LockIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base [&::-ms-reveal]:hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button type="button" className="text-sm font-medium text-indigo-700 hover:text-indigo-800 transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white font-medium rounded-xl py-3.5 transition-colors mt-2"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-8">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-4 mb-8">
          <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-medium text-slate-800 text-sm">Google</span>
          </button>
          
          <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05 1.8-3.08 1.8-1.09 0-1.44-.65-2.67-.65-1.25 0-1.64.65-2.7.65-1.02 0-2.14-.88-3.15-1.85C3.33 18.2 1.68 14.15 2.76 11.2c.53-1.46 1.48-2.6 2.74-3.32 1.16-.67 2.44-.73 3.48-.28 1.06.45 1.74 1.12 2.72 1.12.96 0 1.78-.77 2.97-1.2 1.34-.48 2.65-.25 3.63.35 1.48 1.05 2.22 2.45 2.27 2.5-.96.65-1.63 1.76-1.57 2.97.08 1.47 1.07 2.54 2.14 3.12-.2.62-.48 1.25-.8 1.85l-3.29 3.96zm-2.45-12.3c.53-.78.85-1.8.72-2.77-.84.07-1.92.57-2.5 1.25-.48.55-.88 1.54-.72 2.5 1 .1 1.95-.35 2.5-.98z"/>
            </svg>
            <span className="font-medium text-slate-800 text-sm">Apple</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-700 font-medium hover:text-indigo-800 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}