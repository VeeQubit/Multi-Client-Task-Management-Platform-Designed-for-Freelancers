import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, loginDemoUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('Graphic Designer & Illustrator');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

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
      onClose();
    } else {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      register(name, email, profession);
      onClose();
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top green accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#25D366]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Multi-Client Freelancer Task Workspace
          </p>
        </div>

        {/* 1-Click Demo Evaluation Banner */}
        {mode !== 'forgot' && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#128C7E] text-white">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Quick Demo Login
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Sample clients &amp; projects
                </div>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#128C7E] hover:bg-[#075E54] rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>1-Click Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Tab switch */}
        {mode !== 'forgot' ? (
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-4 text-xs font-bold">
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

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Reset Sent notification */}
        {resetSent && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              <span>Reset Link Sent!</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              We sent reset instructions to <strong>{email}</strong>.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
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
                Freelance Profession / Specialty
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
              Email Address
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
                  Password
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
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs md:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] hover:from-emerald-700 hover:to-[#075E54] text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>
              {mode === 'forgot'
                ? 'Send Reset Link'
                : mode === 'login'
                ? 'Sign In to Workspace'
                : 'Create Free Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
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
              Remember password? Sign In
            </button>
          ) : (
            <span>By signing in, you agree to Me Plus Terms of Service</span>
          )}
        </div>
      </div>
    </div>
  );
};
