import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../common/Logo';
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  FolderKanban,
  Clock,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowLeft,
  KeyRound,
  Check,
  AlertCircle,
  PenTool,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, forgotPassword, resetPassword, loginDemoUser } = useApp();
  const { actualTheme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('Graphic Designer & Illustrator');
  const [customProfession, setCustomProfession] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password 2-step flow state
  const [forgotStep, setForgotStep] = useState<'email' | 'reset' | 'success'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const professionsList = [
    'Graphic Designer & Illustrator',
    'UI/UX & Product Designer',
    'Content Writer & Copywriter',
    'Photographer & Videographer',
    'Digital Marketing Specialist',
    'Virtual Assistant & Project Coordinator',
    'Business Consultant & Strategist',
    'Software & Web Developer',
    'Accountant & Bookkeeper',
    'Translator & Voice Artist',
    'General Freelancer',
    'Other (Specify your own)',
  ];

  const resetAllFormStates = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotStep('email');
    setIsLoading(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (!res.success && res.error) {
      setError(res.error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and confirm your password.');
      return;
    }

    const isOther = profession === 'Other (Specify your own)';
    if (isOther && !customProfession.trim()) {
      setError('Please specify your custom freelance profession.');
      return;
    }

    const finalProfession = isOther ? customProfession.trim() : profession;

    setIsLoading(true);
    const res = await register(name, email, password, finalProfession);
    setIsLoading(false);

    if (!res.success && res.error) {
      setError(res.error);
    }
  };

  const handleForgotStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    const res = await forgotPassword(email);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'No registered account found with this email.');
      return;
    }

    setForgotStep('reset');
  };

  const handleForgotStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match. Please make sure both fields match.');
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(email, newPassword);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to update password.');
      return;
    }

    setForgotStep('success');
    setSuccessMessage(res.message || 'Your password has been successfully updated! You can now sign in.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative overflow-hidden">
      {/* Decorative Ambient Background Gradients & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left ambient emerald glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400/15 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        {/* Center-right ambient teal glow */}
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-teal-400/15 dark:bg-[#128C7E]/10 rounded-full blur-3xl" />
        {/* Bottom-left ambient green glow */}
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-[#25D366]/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Subtle geometric dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#128C7E_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] dark:opacity-[0.07]" />
      </div>

      {/* Top Simple Navigation Header */}
      <header className="w-full h-16 border-b border-slate-200/80 dark:border-slate-800/80 px-6 lg:px-12 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <Logo size="md" />

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 shadow-2xs cursor-pointer"
            title={`Switch to ${actualTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {actualTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline text-xs font-semibold">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => resetAllFormStates(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {mode === 'login'
              ? 'New to Me Plus? Create Account'
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero & Feature Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Workspace Status Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Multi-Client Freelancer Workspace</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Centralized Task Management for <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] bg-clip-text text-transparent">Freelancers</span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Manage multiple clients seamlessly. Never miss deadlines with automatic reminders, visual Kanban boards, live time tracking, and instant invoicing.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-200 flex items-start gap-3 group backdrop-blur-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    Multi-Client Workspace
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Custom rates, client tags &amp; billing history
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700/60 transition-all duration-200 flex items-start gap-3 group backdrop-blur-xs">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    Deadline Radar
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Automated reminders &amp; urgent alerts
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-200 flex items-start gap-3 group backdrop-blur-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    3 Task Layouts
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Kanban drag &amp; drop, Calendar &amp; List
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all duration-200 flex items-start gap-3 group backdrop-blur-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    Me Plus AI Copilot
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    Conversational AI for advice, emails &amp; planning
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/70 dark:border-emerald-800/50 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">Built for Freelancers:</span> Designed for maximum focus, zero clutter, and fast multi-client context switching.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Form Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {/* Soft decorative glow behind card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#25D366]/20 rounded-[34px] blur-xl opacity-70 pointer-events-none" />

            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-950/10 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 flex flex-col relative overflow-hidden">
              {/* WhatsApp Green Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#25D366]" />

              {/* 1-Click Demo Banner (only in login/register mode) */}
              {mode !== 'forgot' && (
                <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#128C7E] text-white shadow-xs">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Explore Demo Account
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pre-populated sample clients
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={loginDemoUser}
                    type="button"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#128C7E] hover:bg-[#075E54] rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>1-Click Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Tab Switcher: Sign In / Register (only when not in forgot mode) */}
              {mode !== 'forgot' ? (
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => resetAllFormStates('login')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      mode === 'login'
                        ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => resetAllFormStates('register')}
                    className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                      mode === 'register'
                        ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => resetAllFormStates('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              )}

              {/* Form Title & Subtitle */}
              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {mode === 'forgot' ? (
                    <>
                      <KeyRound className="w-5 h-5 text-emerald-600" />
                      <span>
                        {forgotStep === 'email'
                          ? 'Reset Password'
                          : forgotStep === 'reset'
                          ? 'Set New Password'
                          : 'Password Reset Successful'}
                      </span>
                    </>
                  ) : mode === 'login' ? (
                    'Sign In to Workspace'
                  ) : (
                    'Create Free Account'
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {mode === 'forgot'
                    ? forgotStep === 'email'
                      ? 'Enter your registered email address to verify your account'
                      : forgotStep === 'reset'
                      ? 'Enter your new secure password and confirm it below'
                      : 'Your password has been changed. You can now log in.'
                    : mode === 'login'
                    ? 'Enter your registered email and password to access your dashboard'
                    : 'Fill in your details to create your freelancer account'}
                </p>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/80 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Success Alert Box */}
              {successMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    <span>Success</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-normal">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* --- 1. SIGN IN FORM --- */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => resetAllFormStates('forgot')}
                        className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Signing In...' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* --- 2. CREATE ACCOUNT FORM --- */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Freelance Profession *
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={profession}
                        onChange={e => setProfession(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
                        disabled={isLoading}
                      >
                        {professionsList.map(p => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Custom Profession Input when 'Other' is selected */}
                  {profession === 'Other (Specify your own)' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Specify Your Profession *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customProfession}
                          onChange={e => setCustomProfession(e.target.value)}
                          placeholder="e.g. 3D Animator, Voiceover Artist, SEO Specialist"
                          className="w-full px-3 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                          required
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Create Password * (min. 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-rose-400 focus:ring-rose-400'
                            : confirmPassword && confirmPassword === password
                            ? 'border-emerald-400 focus:ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                        }`}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword === password && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Creating Account...' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* --- 3. FORGOT / RESET PASSWORD FLOW --- */}
              {mode === 'forgot' && (
                <div>
                  {/* Step 1: Check Registered Email */}
                  {forgotStep === 'email' && (
                    <form onSubmit={handleForgotStep1Submit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Registered Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="alex.rivera@gmail.com"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                            disabled={isLoading}
                            autoFocus
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <span>{isLoading ? 'Verifying Account...' : 'Verify Email & Proceed'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Step 2: Set New Password & Confirm */}
                  {forgotStep === 'reset' && (
                    <form onSubmit={handleForgotStep2Submit} className="space-y-3.5">
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                        <div>
                          Verified Account: <strong>{email}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForgotStep('email')}
                          className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 underline cursor-pointer"
                        >
                          Change
                        </button>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          New Password * (min. 6 chars)
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                            disabled={isLoading}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              confirmNewPassword && confirmNewPassword !== newPassword
                                ? 'border-rose-400 focus:ring-rose-400'
                                : confirmNewPassword && confirmNewPassword === newPassword
                                ? 'border-emerald-400 focus:ring-emerald-500'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                            }`}
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirmNewPassword && confirmNewPassword === newPassword && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Passwords match
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <span>{isLoading ? 'Updating Password...' : 'Save New Password & Continue'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Step 3: Success View */}
                  {forgotStep === 'success' && (
                    <div className="space-y-4 text-center py-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#25D366] flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Password Updated Successfully!
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          You can now sign in to your workspace using your new password.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setPassword('');
                          setError('');
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Sign In with New Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Terms / Back footer */}
              <div className="mt-5 text-center text-[11px] text-slate-400">
                {mode === 'forgot' ? (
                  <button
                    type="button"
                    onClick={() => resetAllFormStates('login')}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Remember your password? Sign in here
                  </button>
                ) : (
                  <span>By continuing, you agree to Me Plus Terms of Service</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-slate-200/80 dark:border-slate-800/80 px-6 text-center text-xs text-slate-400 bg-white/50 dark:bg-slate-900/50 relative z-10">
        <span>&copy; 2026 Me Plus Freelancer Platform &bull; Professional Multi-Client Task Management</span>
      </footer>
    </div>
  );
};
