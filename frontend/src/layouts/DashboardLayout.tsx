import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import LanguageSlider from '../components/LanguageSlider';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Landmark,
  Microscope,
  Lightbulb,
  FileText,
  User,
  LogOut,
  Leaf,
  ChevronRight,
  FlaskConical,
  Sprout,
  HelpCircle,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Compass,
  Layers,
  Bell
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    to: string;
    icon: React.ComponentType<any>;
    label: string;
    badge?: string;
  }[];
}

export default function DashboardLayout() {
  const { t, language, isDualMode } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Help modal state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const helpTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Notification popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  // Close notifications on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Body scroll lock & Escape key handling when help modal is open
  useEffect(() => {
    if (showHelpModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowHelpModal(false);
          helpTriggerRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showHelpModal]);

  const navSections: NavSection[] = [
    {
      title: t('nav.mainMenu', 'Main Menu'),
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard', 'Dashboard') },
        { to: '/farms', icon: Landmark, label: t('nav.farms', 'My Farms') },
        { to: '/soil', icon: Microscope, label: t('nav.soil', 'Soil Health') },
        { to: '/recommendations', icon: Lightbulb, label: t('nav.recommendations', 'Crop Planning') },
        { to: '/satellite', icon: Layers, label: t('nav.satellite', 'Satellite Map') },
        { to: '/reports', icon: FileText, label: t('nav.reports', 'My Reports') },
      ],
    },
    {
      title: t('nav.aiAgents', 'AI Farm Assistants'),
      items: [
        {
          to: '/agents/soil-analysis',
          icon: FlaskConical,
          label: t('nav.soilAnalysisAgent', 'Soil Analysis Assistant'),
          badge: 'ML',
        },
        {
          to: '/agents/farming-assistant',
          icon: Sprout,
          label: t('nav.farmingAssistant', 'Farming Assistant'),
          badge: 'AI',
        },
      ],
    },
    {
      title: t('nav.account', 'Account'),
      items: [
        { to: '/profile', icon: User, label: t('nav.profile', 'My Profile') },
      ],
    },
  ];

  // Derive current page title for breadcrumb
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/agents/soil-analysis')) return t('nav.soilAnalysisAgent', 'Soil Analysis Assistant');
    if (path.includes('/agents/farming-assistant') || path.includes('/agents/planting-advisor')) {
      return t('nav.farmingAssistant', 'Farming Assistant');
    }
    if (path.includes('/farms')) return t('nav.farms', 'My Farms');
    if (path.includes('/soil')) return t('nav.soil', 'Soil Health');
    if (path.includes('/recommendations')) return t('nav.recommendations', 'Crop Planning');
    if (path.includes('/satellite')) return t('nav.satellite', 'Satellite Map');
    if (path.includes('/reports')) return t('nav.reports', 'My Reports');
    if (path.includes('/profile')) return t('nav.profile', 'My Profile');
    if (path.includes('/ml-ops')) return t('nav.systemDiagnostics', 'System Diagnostics');
    return t('nav.dashboard', 'Dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF5] text-[#172B1A] overflow-x-hidden font-sans">
      {/* Sidenav (Desktop & Mobile) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#DCE5DD]
          flex flex-col transition-all duration-300 ease-in-out
          lg:static
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'lg:-ml-72 lg:opacity-0 lg:pointer-events-none' : 'lg:ml-0 lg:opacity-100'}
        `}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#DCE5DD] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center shadow-sm text-white">
              <Leaf className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <p className="font-display font-bold text-gray-900 text-base leading-tight">CSN Bhoomi</p>
              <p className="text-[11px] text-[#166534] font-medium leading-tight">
                {t('Satellite Soil Report', 'Satellite Soil Report')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSidebarCollapsed(true);
              setSidebarOpen(false);
            }}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            title={t('nav.hideSidenav', 'Hide Menu')}
            aria-label="Hide Navigation"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Sections */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                {section.title}
              </div>

              {section.items.map(({ to, icon: Icon, label, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#DCFCE7] text-[#14532D] font-semibold shadow-xs'
                        : 'text-gray-600 hover:bg-stone-100 hover:text-gray-900'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0 text-[#166534]" />
                    <span className="truncate">{label}</span>
                  </div>

                  {badge ? (
                    <span className="text-[10px] bg-[#166534]/10 text-[#166534] font-bold px-2 py-0.5 rounded-md">
                      {badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Quick Help Link in Sidebar */}
          <div className="pt-2 border-t border-gray-100 px-3">
            <button
              ref={helpTriggerRef}
              onClick={() => setShowHelpModal(true)}
              className="flex items-center gap-3 w-full py-2 text-xs text-gray-500 hover:text-[#166534] font-medium cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>{t('nav.helpSupport', 'Help & Support')}</span>
            </button>

            {/* Subtle Advanced Diagnostics Link for Developers */}
            <NavLink
              to="/ml-ops"
              className={({ isActive }) =>
                `flex items-center gap-2 mt-1 py-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors ${
                  isActive ? 'text-brand-700 font-semibold' : ''
                }`
              }
              title="System Diagnostics"
            >
              <Cpu className="w-3.5 h-3.5 opacity-70" />
              <span>{t('nav.systemDiagnostics', 'System Diagnostics')}</span>
            </NavLink>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-[#DCE5DD] bg-stone-50/60 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
              {(user?.full_name || user?.email || 'F')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {user?.full_name || t('profile.farmerAccount', 'Farmer Account')}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
            <NavLink
              to="/profile"
              className="btn btn-ghost btn-sm flex-1 text-xs text-gray-700 hover:bg-white"
              onClick={() => setSidebarOpen(false)}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('nav.profile', 'My Profile')}</span>
            </NavLink>

            <button
              onClick={logout}
              className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 text-xs cursor-pointer"
              title={t('nav.signOut', 'Sign Out')}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#DCE5DD] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Collapse/Expand Toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              title={sidebarCollapsed ? t('nav.showMenu', 'Show Menu') : t('nav.hideMenu', 'Hide Menu')}
              aria-label="Toggle Navigation"
            >
              {sidebarCollapsed ? (
                <>
                  <PanelLeftOpen className="w-5 h-5 text-[#166534]" />
                  <span className="text-xs font-semibold hidden md:inline text-[#166534]">
                    {t('nav.showMenu', 'Show Menu')}
                  </span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-5 h-5 text-gray-600" />
                  <span className="text-xs font-semibold hidden md:inline text-gray-600">
                    {t('nav.hideMenu', 'Hide Menu')}
                  </span>
                </>
              )}
            </button>

            {/* Top Head Logo & Brand */}
            <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'flex' : 'lg:hidden'}`}>
              <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center shadow-xs text-white flex-shrink-0">
                <Leaf className="w-4 h-4 text-[#22C55E]" />
              </div>
              <span className="font-display font-bold text-gray-900 text-sm whitespace-nowrap">
                CSN Bhoomi
              </span>
            </div>

            {/* Breadcrumb / Page Title */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-gray-400">CSN Bhoomi</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-800">{getCurrentPageTitle()}</span>
            </div>
          </div>

          {/* Right Header Utilities: Agent Denominations (ML & AI), Notifications, Language & Help */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Soil Analysis Agent [ML] Badge */}
            <NavLink
              to="/agents/soil-analysis"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50/50 hover:border-emerald-300 hover:text-emerald-900'
                }`
              }
              title={t('nav.soilAnalysisAgent', 'Soil Analysis Assistant')}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#166534] flex-shrink-0" />
              <span className="hidden xl:inline text-gray-800">{t('nav.soilAnalysisAgent', 'Soil Analysis Assistant')}</span>
              <span className="hidden md:inline xl:hidden text-gray-800">{t('nav.soilAnalysisAgent', 'Soil Analysis Assistant')}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ML
              </span>
            </NavLink>

            {/* Farming Assistant [AI] Badge */}
            <NavLink
              to="/agents/farming-assistant"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs ${
                  isActive
                    ? 'bg-teal-50 border-teal-400 text-teal-950 ring-2 ring-teal-500/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-teal-50/50 hover:border-teal-300 hover:text-teal-900'
                }`
              }
              title={t('nav.farmingAssistant', 'Farming Assistant')}
            >
              <Sprout className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="hidden xl:inline text-gray-800">{t('nav.farmingAssistant', 'Farming Assistant')}</span>
              <span className="hidden md:inline xl:hidden text-gray-800">{t('nav.farmingAssistant', 'Farming Assistant')}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-300">
                AI
              </span>
            </NavLink>

            {/* Notifications Bell with Popover */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl border text-gray-600 transition-colors shadow-2xs cursor-pointer ${
                  showNotifications ? 'bg-emerald-50 border-emerald-400 text-[#166534]' : 'border-gray-200 hover:bg-stone-50'
                }`}
                title={t('status.intelligenceStatus', 'Platform Status')}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-gray-700" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 animate-slide-up space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#166534]" />
                      <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                        {t('status.intelligenceStatus', 'Platform Status')}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {t('notifications.allSystemsActive', 'All Systems Active')}
                    </span>
                  </div>

                  {/* Agent Technology Designation Breakdown */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        ML
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-emerald-950">
                            {t('nav.soilAnalysisAgent', 'Soil Analysis Assistant')}
                          </p>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                            ML
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-900/80 mt-0.5">
                          {t('status.soilAgentDesc', 'Location-based soil estimation model for 12 soil properties using calibrated Maharashtra soil datasets.')}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        AI
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-teal-950">
                            {t('nav.farmingAssistant', 'Farming Assistant')}
                          </p>
                          <span className="text-[10px] font-semibold text-teal-700 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                            AI
                          </span>
                        </div>
                        <p className="text-[11px] text-teal-900/80 mt-0.5">
                          {t('status.farmingAgentDesc', 'AI farming advisor with ICAR fertilizer guidelines and crop recommendations.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Alert */}
                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                    <span>{t('notifications.satelliteUpdated', 'Satellite maps updated today')}</span>
                    <span className="text-gray-400">{t('notifications.today', 'Today')}</span>
                  </div>
                </div>
              )}
            </div>

            <LanguageSlider />

            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-stone-50 text-gray-600 flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
              title={t('nav.helpSupport', 'Help & Support')}
            >
              <HelpCircle className="w-4 h-4 text-[#166534]" />
              <span className="hidden md:inline">{t('nav.helpSupport', 'Help & Support')}</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Farmer Help & Support Modal via React Portal */}
      {showHelpModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-support-title"
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[calc(100dvh-2rem)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 id="help-support-title" className="font-bold text-gray-900 text-base">
                      {t('help.title', 'CSN Bhoomi Help & Support')}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t('help.subtitle', 'Simple guide to using your agricultural platform')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-600 flex-1 overflow-y-auto pr-1">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-950 block text-sm">
                    1. {t('help.step1Title', 'Map Your Farm')}
                  </span>
                  <p>{t('help.step1Desc', 'Go to "My Farms", click "Add New Farm", locate your village or survey number, and draw your field boundary.')}</p>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                  <span className="font-bold text-blue-950 block text-sm">
                    2. {t('help.step2Title', 'Check Your Soil (Assistant 1)')}
                  </span>
                  <p>{t('help.step2Desc', 'Click "Soil Health" in the menu or on your farm card. View estimated N, P, K, pH, and organic carbon with ICAR ratings.')}</p>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
                  <span className="font-bold text-teal-950 block text-sm">
                    3. {t('help.step3Title', 'Get Planting Advice (Assistant 2)')}
                  </span>
                  <p>{t('help.step3Desc', 'Click "Farming Assistant" to discover which crops best suit your soil and season, along with fertilizer bag schedules.')}</p>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <span className="font-bold text-purple-950 block text-sm">
                    4. {t('help.step4Title', 'Download Farm Reports')}
                  </span>
                  <p>{t('help.step4Desc', 'Go to "My Reports" to generate and download printable PDF reports with field maps and nutrient tables.')}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end flex-shrink-0 border-t border-gray-100">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="btn btn-primary text-xs px-5 py-2"
                >
                  {t('actions.gotIt', 'Got It, Thanks')}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
