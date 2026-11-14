import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi, farmsApi, reportsApi } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { useLanguage, Language } from '../context/LanguageContext';
import BilingualText from '../components/BilingualText';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Globe,
  Check, Save, LogOut, Info, Landmark, FileText, FlaskConical,
  AlignLeft
} from 'lucide-react';

const MH_DISTRICTS = [
  'Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana',
  'Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna',
  'Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar',
  'Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri',
  'Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal',
];

const LANGUAGE_OPTIONS: { value: Language; label: string; nativeLabel: string }[] = [
  { value: 'en', label: 'English', nativeLabel: 'English' },
  { value: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी (Hindi)' },
  { value: 'mr', label: 'Marathi', nativeLabel: 'मराठी (Marathi)' },
];

const SUBTEXT_MODE_OPTIONS = [
  { value: 'none', label: 'Off — Single language only' },
  { value: 'hi', label: 'Show हिन्दी (Hindi) subtext' },
  { value: 'mr', label: 'Show मराठी (Marathi) subtext' },
  { value: 'en', label: 'Show English subtext' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const {
    language: ctxLanguage,
    setLanguage: ctxSetLanguage,
    isDualMode,
    setIsDualMode,
    subtextLang,
    setSubtextLang,
    t,
  } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [state, setState] = useState(user?.state || 'Maharashtra');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: farmsData } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list(),
  });
  const { data: reportsData } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list(),
  });

  const farmCount = farmsData?.data?.items?.length || farmsData?.data?.length || 0;
  const reportCount = reportsData?.data?.items?.length || reportsData?.data?.length || 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await authApi.updateMe({ full_name: fullName, phone, state, district });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = (val: Language) => {
    ctxSetLanguage(val);
    // Auto-correct subtextLang if it conflicts
    if (isDualMode && subtextLang === val) {
      if (val === 'en') setSubtextLang('hi');
      else setSubtextLang('en');
    }
  };

  const currentSubtextValue = isDualMode ? (subtextLang || 'hi') : 'none';
  const handleSubtextChange = (val: string) => {
    if (val === 'none') {
      setIsDualMode(false);
    } else {
      setIsDualMode(true);
      setSubtextLang(val as Language);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">
          <BilingualText en="Farmer Account & Preferences" />
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          <BilingualText en="Manage your personal details, regional agricultural defaults, and language preferences." />
        </p>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-gray-900">{farmCount}</div>
            <div className="text-xs text-gray-500">
              <BilingualText en="Registered Farms" />
            </div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-gray-900">
              <BilingualText en="Active" />
            </div>
            <div className="text-xs text-gray-500">
              <BilingualText en="Soil Testing Profile" />
            </div>
          </div>
        </div>

        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-display font-bold text-gray-900">{reportCount}</div>
            <div className="text-xs text-gray-500">
              <BilingualText en="Advisory Reports" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
              {user?.full_name ? user.full_name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-gray-900">
                {user?.full_name || t('Farmer Profile', 'Farmer Profile')}
              </h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <span className="badge badge-green text-xs">
            <BilingualText en="Verified Farmer" />
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <BilingualText en="Profile details saved successfully." />
          </div>
        )}

        {saveError && (
          <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <BilingualText en="Full Name" />
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="input text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <BilingualText en="Email Address" />
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <BilingualText en="Mobile Number (WhatsApp SMS updates)" />
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
                className="input text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <BilingualText en="State" />
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                <BilingualText en="District" />
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input text-sm"
              >
                {MH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <BilingualText en="Sign Out from CSN Bhoomi" />
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary text-xs flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <BilingualText en={isSaving ? 'Saving Changes…' : 'Save Changes'} />
            </button>
          </div>
        </form>
      </div>

      {/* Language & Accessibility Settings Card */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              <BilingualText en="Language & Display Settings" />
            </h3>
            <p className="text-xs text-gray-500">
              <BilingualText en="Choose your preferred interface language and bilingual subtext mode." />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Interface Language */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              <BilingualText en="Interface Language" />
            </label>
            <div className="flex flex-col gap-2">
              {LANGUAGE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    ctxLanguage === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-gray-200 hover:border-brand-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="interface-language"
                    value={opt.value}
                    checked={ctxLanguage === opt.value}
                    onChange={() => handleLanguageChange(opt.value)}
                    className="accent-brand-600"
                  />
                  <span className="text-sm font-medium">{opt.nativeLabel}</span>
                  {ctxLanguage === opt.value && (
                    <Check className="w-4 h-4 text-brand-600 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Bilingual Subtext Mode */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              <span className="flex items-center gap-1.5">
                <AlignLeft className="w-3 h-3" />
                <BilingualText en="Bilingual Subtext Mode" />
              </span>
            </label>
            <p className="text-[11px] text-gray-500 mb-3">
              <BilingualText en="Show a secondary language translation as small subtext below every line of text." />
            </p>
            <div className="flex flex-col gap-2">
              {SUBTEXT_MODE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    currentSubtextValue === opt.value
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="subtext-mode"
                    value={opt.value}
                    checked={currentSubtextValue === opt.value}
                    onChange={() => handleSubtextChange(opt.value)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                  {currentSubtextValue === opt.value && (
                    <Check className="w-4 h-4 text-indigo-600 ml-auto" />
                  )}
                </label>
              ))}
            </div>

            {isDualMode && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-[11px] text-indigo-800 font-medium">
                  ✓ Bilingual mode is active. Every text in the app will show{' '}
                  <strong>{ctxLanguage.toUpperCase()}</strong> as primary with{' '}
                  <strong>{(subtextLang || 'hi').toUpperCase()}</strong> subtext.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data & Security Notice */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-gray-800">
            <BilingualText en="Geospatial Privacy & Data Sovereignty" />
          </div>
          <p className="mt-0.5">
            <BilingualText en="Your land cadastral references, soil testing lab results, and crop history are securely protected. CSN Bhoomi complies with Indian digital agricultural data governance norms." />
          </p>
        </div>
      </div>
    </div>
  );
}
