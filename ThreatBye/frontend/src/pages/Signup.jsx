import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({}); // Changed to object for specific errors

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number logic: allow only numbers, max 10 digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData({ ...formData, phone: numericValue });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Form Validation & Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Phone Validation
    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Strong Password Validation
    // Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 chars, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
    }

    // Confirm Password Validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms Validation
    if (!agreeTerms) {
      newErrors.terms = "Please agree to the Terms & Conditions.";
    }

    // If there are errors, stop submission and show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({}); // Clear errors if everything is perfect
    console.log('Ready for Backend Signup API:', formData);
    alert("Validation Successful! Data ready for API."); // Temporary success message
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-[#f8f9fc]">
      <div className="w-full max-w-sm mx-auto flex flex-col flex-1">
        
        {/* Top Navigation / Back Button */}
        <div className="mb-6 -ml-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-800 hover:text-slate-600 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Create Account</h1>
          <p className="text-sm text-slate-500">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          
          {/* Full Name */}
          <div>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3.5 bg-transparent transition-colors focus-within:border-indigo-900 focus-within:ring-1 focus-within:ring-indigo-900">
              <User className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0 stroke-[1.5]" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3.5 bg-transparent transition-colors focus-within:border-indigo-900 focus-within:ring-1 focus-within:ring-indigo-900">
              <Mail className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0 stroke-[1.5]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div className={`flex items-center border rounded-xl px-4 py-3.5 bg-transparent transition-colors focus-within:border-indigo-900 focus-within:ring-1 focus-within:ring-indigo-900 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}>
              <Phone className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0 stroke-[1.5]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                maxLength="10"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <div className={`flex items-center border rounded-xl px-4 py-3.5 bg-transparent transition-colors focus-within:border-indigo-900 focus-within:ring-1 focus-within:ring-indigo-900 ${errors.password ? 'border-red-500' : 'border-slate-200'}`}>
              <Lock className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0 stroke-[1.5]" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                // [&::-ms-reveal]:hidden hides the default Edge eye icon
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm [&::-ms-reveal]:hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-slate-500 hover:text-slate-700 focus:outline-none p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 leading-tight">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className={`flex items-center border rounded-xl px-4 py-3.5 bg-transparent transition-colors focus-within:border-indigo-900 focus-within:ring-1 focus-within:ring-indigo-900 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'}`}>
              <Lock className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0 stroke-[1.5]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm [&::-ms-reveal]:hidden"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="ml-2 text-slate-500 hover:text-slate-700 focus:outline-none p-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div>
            <div className="flex items-start mt-2 mb-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 rounded bg-white checked:bg-indigo-900 checked:border-indigo-900 focus:ring-2 focus:ring-indigo-900 focus:ring-offset-1 accent-indigo-900"
                />
              </div>
              <label htmlFor="terms" className="ml-3 text-xs text-slate-800 leading-tight font-medium">
                I agree to the Terms & Conditions and <br />
                Privacy Policy
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs ml-7">{errors.terms}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#1e1b4b] hover:bg-[#11102e] active:bg-black text-white font-medium rounded-xl py-4 transition-colors mt-2"
          >
            Sign Up
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pb-4">
          <p className="text-sm text-slate-700 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1e1b4b] font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}