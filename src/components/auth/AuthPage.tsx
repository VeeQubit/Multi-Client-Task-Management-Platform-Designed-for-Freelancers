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
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, loginDemoUser } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('Graphic Designer & Illustrator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

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
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (mode === 'login') {
      login(email);
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      register(name, email, profession);
    }
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
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
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
              setResetSent(false);
            }}
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
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
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
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
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
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setResetSent(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              )}

              {/* Form Title */}
              <div className="mb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {mode === 'forgot' ? (
                    <>
                      <KeyRound className="w-5 h-5 text-emerald-600" />
                      <span>Reset Password</span>
                    </>
                  ) : mode === 'login' ? (
                    'Sign In to Workspace'
                  ) : (
                    'Create Free Account'
                  )}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {mode === 'forgot'
                    ? 'Enter your email address and we will send you a password reset link'
                    : mode === 'login'
                    ? 'Enter your credentials to access your client dashboard'
                    : 'Start managing your freelance clients and tasks in one place'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Reset Sent Success Alert */}
              {resetSent && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    <span>Password Reset Link Sent!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    We sent instructions to <strong>{email}</strong>. Please check your inbox or spam folder.
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'register' && (
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
                      />
                    </div>
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Freelance Profession
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={profession}
                        onChange={e => setProfession(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                      >
                        {professionsList.map(p => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
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
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password *
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setError('');
                            setResetSent(false);
                          }}
                          className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {mode === 'forgot'
                      ? 'Send Password Reset Link'
                      : mode === 'login'
                      ? 'Sign In to Workspace'
                      : 'Create Free Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Terms / Back footer */}
              <div className="mt-5 text-center text-[11px] text-slate-400">
                {mode === 'forgot' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setResetSent(false);
                    }}
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
