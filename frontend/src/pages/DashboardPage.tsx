import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { farmsApi, reportsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useActiveFarm } from '../context/FarmContext';
import type { Farm, Report } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Landmark,
  FileText,
  Plus,
  ArrowRight,
  Leaf,
  MapPin,
  Calendar,
  FlaskConical,
  Sprout,
  Compass,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  Download,
  Clock
} from 'lucide-react';

const SEASON_COLOURS: Record<string, string> = {
  Kharif: 'bg-emerald-100 text-emerald-800',
  Rabi:   'bg-blue-100 text-blue-800',
  Summer: 'bg-amber-100 text-amber-800',
  Annual: 'bg-purple-100 text-purple-800',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setSelectedFarmId, lastSoilAnalysis } = useActiveFarm();

  const { data: farmsData = [], isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list().then(r => r.data),
    enabled: !!user,
  });

  const farms: Farm[] = Array.isArray(farmsData) 
    ? farmsData 
    : (farmsData?.items || farmsData?.data || []);

  const { data: reportsData = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list().then(r => r.data),
    enabled: !!user,
  });

  const reports: Report[] = Array.isArray(reportsData)
    ? reportsData
    : (reportsData?.items || reportsData?.data || []);

  // Compute real totals
  const totalAcres = farms.reduce((s, f) => s + (f.area_acres || 0), 0);
  const totalHectares = totalAcres * 0.404686;
  const farmsWithBoundary = farms.filter(f => f.boundary_geojson).length;

  // Determine current greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 
    ? t('greetings.morning', 'Good morning') 
    : hour < 17 
    ? t('greetings.afternoon', 'Good afternoon') 
    : t('greetings.evening', 'Good evening');

  const farmerName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || t('greetings.farmer', 'Farmer');

  // Next recommended action logic
  const topFarm = farms.length > 0 ? farms[0] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* ── Page Header & Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5DD] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            {greeting}, {farmerName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t('greetings.farmOverview', 'Here is your farmland and soil health overview.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/farms"
            className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('actions.addFarm', 'Add New Farm')}</span>
          </Link>
        </div>
      </div>

      {/* ── Practical Farm Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Farms */}
        <div className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#166534] mb-3">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              {farmsLoading ? '...' : farms.length}
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">
              {t('Registered Farms', 'Registered Farms')}
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
            {farmsWithBoundary} {t('fields with saved boundary', 'fields with saved boundary')}
          </div>
        </div>

        {/* Total Land Area */}
        <div className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              {farmsLoading ? '...' : totalAcres.toFixed(1)}
              <span className="text-sm font-normal text-gray-500 ml-1">Acres</span>
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">
              {t('Total Land Area', 'Total Land Area')}
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
            {totalHectares.toFixed(1)} {t('Hectares across all fields', 'Hectares across all fields')}
          </div>
        </div>

        {/* Soil Health Analysis Agent */}
        <div className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mb-3">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              {lastSoilAnalysis ? `${Math.round(lastSoilAnalysis.fertility_index || 78)}/100` : 'Ready'}
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">
              {t('Soil Analysis Status', 'Soil Analysis Status')}
            </div>
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-3 pt-2 border-t border-gray-100">
            <Link to="/agents/soil-analysis" className="hover:underline flex items-center gap-1">
              <span>{t('Open Soil Analysis', 'Open Soil Analysis')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Available Reports */}
        <div className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              {reportsLoading ? '...' : reports.length}
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">
              {t('Reports Available', 'Reports Available')}
            </div>
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-3 pt-2 border-t border-gray-100">
            <Link to="/reports" className="hover:underline flex items-center gap-1">
              <span>{t('Download PDF Reports', 'Download PDF Reports')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Next Recommended Action Card ── */}
      {topFarm ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-[#22C55E]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#166534]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                {t('dashboard.nextAction', 'Next Recommended Step')}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {t('Analyze Soil or Get Planting Guidance for', 'Analyze Soil or Get Planting Guidance for')} {topFarm.name}
            </h3>
            <p className="text-xs text-gray-600 max-w-xl">
              {t(
                'Explore estimated soil fertility, primary nutrients (N, P, K), and suitable seasonal crops with 50kg fertilizer bag schedules.',
                'Explore estimated soil fertility, primary nutrients (N, P, K), and suitable seasonal crops with 50kg fertilizer bag schedules.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedFarmId(topFarm.id);
                navigate(`/agents/soil-analysis?farmId=${topFarm.id}`);
              }}
              className="btn btn-secondary text-xs px-4 py-2.5 rounded-xl font-semibold border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#166534]" />
              <span>{t('Analyze My Soil', 'Analyze My Soil')}</span>
            </button>

            <button
              onClick={() => {
                setSelectedFarmId(topFarm.id);
                navigate(`/agents/planting-advisor?farmId=${topFarm.id}`);
              }}
              className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{t('Get Planting Advice', 'Get Planting Advice')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#DCE5DD] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {t('Start by adding your first farm.', 'Start by adding your first farm.')}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {t(
              'Register your farm parcel, mark your boundary on the map, and get automated acreage and soil intelligence.',
              'Register your farm parcel, mark your boundary on the map, and get automated acreage and soil intelligence.'
            )}
          </p>
          <div className="pt-1">
            <Link to="/farms" className="btn btn-primary bg-[#166534] text-xs px-5 py-2.5 rounded-xl shadow-xs">
              + {t('Add New Farm Now', 'Add New Farm Now')}
            </Link>
          </div>
        </div>
      )}

      {/* ── Two AI Agriculture Agents Quick Launcher ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#166534]" />
            <span>{t('AI Agriculture Agents', 'AI Agriculture Agents')}</span>
          </h2>
          <span className="text-xs text-gray-400">
            {t('Two specialized tools connected to your farms', 'Two specialized tools connected to your farms')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent 1 Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5DD] shadow-xs flex items-center justify-between gap-4 hover:border-emerald-300 transition-all">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  Agent 1
                </span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 truncate">
                  {t('Soil Analysis', 'Soil Analysis')}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {t('Soil fertility score, N-P-K, pH, and ICAR nutrient diagnostic ratings.', 'Soil fertility score, N-P-K, pH, and ICAR nutrient diagnostic ratings.')}
                </p>
              </div>
            </div>

            <Link
              to="/agents/soil-analysis"
              className="btn btn-secondary border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-xs px-3.5 py-2 rounded-xl flex-shrink-0 font-semibold"
            >
              <span>{t('Open', 'Open')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Agent 2 Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCE5DD] shadow-xs flex items-center justify-between gap-4 hover:border-teal-300 transition-all">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                  Agent 2
                </span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 truncate">
                  {t('Planting Advisor', 'Planting Advisor')}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {t('Suitable seasonal crops and fertilizer dosage in standard 50kg bags.', 'Suitable seasonal crops and fertilizer dosage in standard 50kg bags.')}
                </p>
              </div>
            </div>

            <Link
              to="/agents/planting-advisor"
              className="btn btn-secondary border-teal-300 text-teal-900 hover:bg-teal-50 text-xs px-3.5 py-2 rounded-xl flex-shrink-0 font-semibold"
            >
              <span>{t('Open', 'Open')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Registered Farms Section ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#166534]" />
            <span>{t('Your Registered Farms', 'Your Registered Farms')}</span>
          </h2>
          <Link to="/farms" className="text-xs text-[#166534] font-semibold hover:underline">
            {t('View All Farms →', 'View All Farms →')}
          </Link>
        </div>

        {farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farms.slice(0, 6).map((farm) => {
              const acres = farm.area_acres || 0;
              const hasBoundary = !!farm.boundary_geojson;

              return (
                <div
                  key={farm.id}
                  className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between hover:shadow-card-hover transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-[#166534]">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">
                            {farm.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {farm.village ? `${farm.village}, ` : ''}{farm.district || 'Maharashtra'}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasBoundary ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {hasBoundary ? t('Mapped', 'Mapped') : t('Unmapped', 'Unmapped')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-gray-400 block">{t('Area', 'Area')}</span>
                        <strong className="text-gray-800 text-xs">
                          {acres > 0 ? `${acres.toFixed(2)} Acres` : '—'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">{t('Location', 'Location')}</span>
                        <span className="text-gray-800 text-xs truncate block">
                          {farm.district || 'Maharashtra'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this farm */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFarmId(farm.id);
                        navigate(`/agents/soil-analysis?farmId=${farm.id}`);
                      }}
                      className="btn btn-secondary text-xs flex-1 py-1.5 rounded-lg border-emerald-300 text-emerald-900 hover:bg-emerald-50 justify-center"
                      title={t('Analyze My Soil', 'Analyze My Soil')}
                    >
                      <FlaskConical className="w-3 h-3 text-[#166534]" />
                      <span>{t('Soil', 'Soil')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedFarmId(farm.id);
                        navigate(`/agents/planting-advisor?farmId=${farm.id}`);
                      }}
                      className="btn btn-secondary text-xs flex-1 py-1.5 rounded-lg border-teal-300 text-teal-900 hover:bg-teal-50 justify-center"
                      title={t('Get Planting Advice', 'Get Planting Advice')}
                    >
                      <Sprout className="w-3 h-3 text-teal-700" />
                      <span>{t('Advice', 'Advice')}</span>
                    </button>

                    <Link
                      to={`/farms/${farm.id}`}
                      className="btn btn-ghost text-xs p-1.5 rounded-lg text-gray-500 hover:bg-stone-100"
                      title={t('View Farm Details', 'View Farm Details')}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-white border border-gray-200 rounded-2xl text-xs text-gray-500">
            {t('No farms registered yet. Click "Add New Farm" above to map your first field.', 'No farms registered yet. Click "Add New Farm" above to map your first field.')}
          </div>
        )}
      </div>

      {/* ── Recent Farm Reports ── always visible ── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#166534]" />
            <span>{t('Recent Farm Reports', 'Recent Farm Reports')}</span>
          </h2>
          <Link to="/reports" className="text-xs text-[#166534] font-semibold hover:underline flex items-center gap-1">
            {t('View All Reports →', 'View All Reports →')}
          </Link>
        </div>

        {reports.length === 0 ? (
          /* ── No Reports Empty State ── */
          <div className="bg-white border border-dashed border-[#DCE5DD] rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-300 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {t('No reports generated yet', 'No reports generated yet')}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('Generate your first advisory dossier from the Reports page.', 'Generate your first advisory dossier from the Reports page.')}
              </p>
            </div>
            <Link
              to="/reports"
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl border-purple-200 text-purple-900 hover:bg-purple-50 inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('Generate First Report', 'Generate First Report')}
            </Link>
          </div>
        ) : (
          /* ── Report History Cards ── */
          <div className="bg-white border border-[#DCE5DD] rounded-2xl overflow-hidden shadow-xs">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-3 px-5 py-2.5 bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <span>Report</span>
              <span>Farm</span>
              <span>Season</span>
              <span>Generated</span>
              <span>Action</span>
            </div>

            <div className="divide-y divide-gray-50">
              {[...reports]
                .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
                .slice(0, 5)
                .map((rep) => {
                  const repFarm = farms.find(f => f.id === rep.farm_id);
                  const seasonCls = SEASON_COLOURS[rep.season || ''] || 'bg-gray-100 text-gray-700';
                  return (
                    <div
                      key={rep.id}
                      className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] items-start sm:items-center gap-2 sm:gap-3 px-5 py-3.5 hover:bg-stone-50/60 transition-colors"
                    >
                      {/* Title */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {rep.title || t('Soil Intelligence Dossier', 'Soil Intelligence Dossier')}
                          </p>
                          {/* Mobile only: farm + date */}
                          <p className="sm:hidden text-[10px] text-gray-400 mt-0.5">
                            {repFarm?.name || '—'} · {rep.season || 'Annual'} · {rep.generated_at ? format(new Date(rep.generated_at), 'dd MMM yyyy') : 'Recent'}
                          </p>
                          {/* Source badge */}
                          {rep.contains_demo_data ? (
                            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mt-0.5">
                              <AlertCircle className="w-2 h-2" /> Demo
                            </span>
                          ) : (
                            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                              <CheckCircle2 className="w-2 h-2" /> Production
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Farm */}
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 max-w-[120px] truncate">
                        <Landmark className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{repFarm?.name || '—'}</span>
                      </div>

                      {/* Season */}
                      <div className="hidden sm:block">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${seasonCls}`}>
                          {rep.season || 'Annual'}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] text-gray-500 whitespace-nowrap">
                          {rep.generated_at ? format(new Date(rep.generated_at), 'dd MMM yyyy') : 'Recent'}
                        </p>
                        <p className="text-[9px] text-gray-400 whitespace-nowrap flex items-center gap-0.5 justify-end">
                          <Clock className="w-2 h-2" />
                          {rep.generated_at ? formatDistanceToNow(new Date(rep.generated_at), { addSuffix: true }) : ''}
                        </p>
                      </div>

                      {/* Action */}
                      <Link
                        to="/reports"
                        className="btn btn-secondary text-xs px-3 py-1.5 rounded-lg border-purple-200 text-purple-900 hover:bg-purple-50 flex-shrink-0 flex items-center gap-1"
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span className="hidden sm:inline">{t('View', 'View')}</span>
                      </Link>
                    </div>
                  );
                })}
            </div>

            {reports.length > 5 && (
              <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Showing 5 of {reports.length} total reports
                </span>
                <Link to="/reports" className="text-xs text-[#166534] font-semibold hover:underline">
                  View all {reports.length} reports →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
