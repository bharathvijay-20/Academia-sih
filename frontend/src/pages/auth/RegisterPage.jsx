import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { 
  GraduationCap, 
  Building2, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Clock, 
  ShieldCheck, 
  Loader2
} from 'lucide-react';

export const RegisterPage = () => {
  const { sendRegistrationOtp, verifyRegistrationOtp, completeRegistration, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();

  // Wizard Steps: 1 (Role) -> 2 (Email/Name) -> 3 (OTP Verification) -> 4 (Password) -> 5 (Profile)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  // OTP state (6 digit array)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Password state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-specific Profile state
  const [profileData, setProfileData] = useState({
    // Student
    college: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    graduation_year: '2027',
    cgpa: '8.5',
    career_goal: 'Software Systems Engineer',
    phone: '',
    location: '',
    // Industry Recruiter
    company_name: '',
    designation: 'Technical Recruiter',
    industry_domain: 'Full Stack Development',
    company_size: '100–500 Employees',
    headquarters: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Resend OTP Cooldown Timer
  useEffect(() => {
    let timer;
    if (currentStep === 3 && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, cooldown]);

  // Handle Role Selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep(2);
    setErrorMessage('');
  };

  // Step 2: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await sendRegistrationOtp(email, selectedRole, name);
      setSuccessMessage(`Verification code sent to ${email}. Please check your inbox.`);
      setCurrentStep(3);
      setCooldown(60);
      setCanResend(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Handle 6-Digit OTP Input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Only keep 1 digit
    setOtpDigits(newDigits);

    // Auto advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await verifyRegistrationOtp(email, enteredOtp);
      setSuccessMessage('Email verified successfully! Please create your password.');
      setCurrentStep(4);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage('');
    setIsLoading(true);
    try {
      await sendRegistrationOtp(email, selectedRole, name);
      setCooldown(60);
      setCanResend(false);
      setSuccessMessage('A fresh verification code has been sent to your email.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Validate Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(5);
  };

  // Step 5: Complete Final Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const fullProfile = {
        name,
        ...profileData
      };

      const newUser = await completeRegistration({
        email,
        password,
        role: selectedRole,
        profileData: fullProfile
      });

      const targetDashboard = getRoleDashboardPath(newUser.role);
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfigs = [
    { 
      id: 'STUDENT', 
      title: 'Student Account', 
      subtitle: 'Skill Passport, Assessments & Verified Job Matching', 
      icon: GraduationCap, 
      color: 'bg-indigo-600'
    },
    { 
      id: 'INDUSTRY_RECRUITER', 
      title: 'Recruiter Account', 
      subtitle: 'Candidate Discovery, Verified Skills & Job Postings', 
      icon: Building2, 
      color: 'bg-cyan-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-2">
        <Link to="/login" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">ACADEMIA</span>
        </Link>
        <h1 className="text-xl font-semibold text-slate-200 mt-1">
          Create New Account
        </h1>
        <p className="text-xs text-slate-400">
          Step {currentStep} of 5: {
            currentStep === 1 ? 'Select Account Role' :
            currentStep === 2 ? 'Email Verification' :
            currentStep === 3 ? 'Enter Email OTP' :
            currentStep === 4 ? 'Set Password' : 'Role Profile Setup'
          }
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-8 px-6 sm:px-8 shadow-xl space-y-6">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* STEP 1: ROLE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <h2 className="font-semibold text-sm text-white">Select Your Account Type</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose your platform role to get started</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleConfigs.map(r => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-slate-950 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${r.color} text-white shadow`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xs text-white">{r.title}</h3>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{r.subtitle}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        Select {r.title.split(' ')[0]} ➔
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: EMAIL & NAME */}
          {currentStep === 2 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Role: {selectedRole === 'STUDENT' ? 'Student' : 'Recruiter'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Official Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@university.edu / recruiter@company.com"
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">A 6-digit verification code will be dispatched to this email address via SMTP.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Send Email Verification Code</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 6-DIGIT OTP VERIFICATION */}
          {currentStep === 3 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-sm text-white">Enter 6-Digit Verification Code</h2>
                <p className="text-xs text-slate-400">
                  A verification code has been dispatched to <strong className="text-slate-200">{email}</strong>
                </p>
              </div>

              {/* 6 OTP Box Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => otpInputRefs.current[idx] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-12 sm:h-12 text-center font-mono font-bold text-lg text-white rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Did not receive code?'}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                  className={`font-medium transition-colors ${
                    canResend ? 'text-indigo-400 hover:text-indigo-300 cursor-pointer underline' : 'text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Resend OTP
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length < 6}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Verify Code & Continue</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: PASSWORD CREATION */}
          {currentStep === 4 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <h2 className="font-semibold text-sm text-white">Create Account Password</h2>
                <p className="text-xs text-slate-400">Choose a secure password (minimum 8 characters)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full bg-slate-950 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors"
                >
                  <span>Continue to Profile Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: ROLE-SPECIFIC PROFILE SETUP */}
          {currentStep === 5 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="text-center pb-1">
                <h2 className="font-semibold text-sm text-white">Complete {selectedRole === 'STUDENT' ? 'Student' : 'Recruiter'} Profile</h2>
                <p className="text-xs text-slate-400">Fill in your professional information to initialize your isolated dashboard</p>
              </div>

              {selectedRole === 'STUDENT' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">College / University</label>
                      <input
                        type="text"
                        required
                        value={profileData.college}
                        onChange={e => setProfileData({ ...profileData, college: e.target.value })}
                        placeholder="e.g. Apex Institute of Technology"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                      <input
                        type="text"
                        required
                        value={profileData.department}
                        onChange={e => setProfileData({ ...profileData, department: e.target.value })}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Current Year</label>
                      <input
                        type="text"
                        value={profileData.year}
                        onChange={e => setProfileData({ ...profileData, year: e.target.value })}
                        placeholder="3rd Year"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        value={profileData.graduation_year}
                        onChange={e => setProfileData({ ...profileData, graduation_year: e.target.value })}
                        placeholder="2027"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        value={profileData.cgpa}
                        onChange={e => setProfileData({ ...profileData, cgpa: e.target.value })}
                        placeholder="8.5"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Target Career Goal</label>
                    <input
                      type="text"
                      required
                      value={profileData.career_goal}
                      onChange={e => setProfileData({ ...profileData, career_goal: e.target.value })}
                      placeholder="e.g. Backend Systems & Cloud Engineer"
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'INDUSTRY_RECRUITER' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        required
                        value={profileData.company_name}
                        onChange={e => setProfileData({ ...profileData, company_name: e.target.value })}
                        placeholder="e.g. Apex Digital Labs"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Your Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={profileData.designation}
                        onChange={e => setProfileData({ ...profileData, designation: e.target.value })}
                        placeholder="e.g. Technical Recruiter"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Technical Domain</label>
                      <input
                        type="text"
                        value={profileData.industry_domain}
                        onChange={e => setProfileData({ ...profileData, industry_domain: e.target.value })}
                        placeholder="e.g. Full Stack Development"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Headquarters</label>
                      <input
                        type="text"
                        value={profileData.headquarters}
                        onChange={e => setProfileData({ ...profileData, headquarters: e.target.value })}
                        placeholder="e.g. Bangalore, India"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Complete Account Creation</span>
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center pt-1 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
