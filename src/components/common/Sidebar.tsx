import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  FileText,
  Settings,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    clients,
    projects,
    tasks,
    invoices,
    setIsAiModalOpen,
  } = useApp();

  const activeProjectsCount = projects.filter(p => p.status === 'in-progress').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const urgentTasksCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const activeClientsCount = clients.filter(c => c.status === 'active').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      badge: activeClientsCount > 0 ? activeClientsCount : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: activeProjectsCount > 0 ? activeProjectsCount : null,
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300',
    },
    {
      id: 'tasks',
      label: 'Tasks & Views',
      icon: CheckSquare,
      badge: urgentTasksCount > 0 ? `${urgentTasksCount} urgent` : pendingTasksCount > 0 ? pendingTasksCount : null,
      badgeColor: urgentTasksCount > 0
        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 animate-pulse'
        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    },
    {
      id: 'time',
      label: 'Time Logs',
      icon: Clock,
      badge: null,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
      badge: invoices.filter(i => i.status === 'sent').length > 0
        ? `${invoices.filter(i => i.status === 'sent').length} pending`
        : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Fixed Left Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-0 bottom-0 left-0 z-40 w-64 h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-sm shrink-0 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Section (internally scrollable if needed) */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Main Navigation */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Workspace
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-[#128C7E] text-white shadow-md shadow-emerald-700/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-slate-800/60 hover:text-emerald-800 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick AI Section */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Smart Assistant
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setIsAiModalOpen(true);
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/50 dark:border-emerald-800/40 text-slate-800 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      AI Copilot
                      <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                        Smart
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Chat with AI Advisor
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700/60 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                Weekly Efficiency
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                85% tasks on track
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
