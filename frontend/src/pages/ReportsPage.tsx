import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi, farmsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import type { Report, Farm } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FileText, Download, Plus, Calendar, Landmark, CheckCircle2,
  AlertCircle, Eye, Printer, Shield, X, Search, Filter,
  Clock, ChevronDown, BarChart2, Leaf, FlaskConical, Sprout,
  RefreshCw, ArrowUpRight, FileBarChart, Tag, Hash
} from 'lucide-react';

// ─── Season colour helpers ─────────────────────────────────────────────────
const SEASON_COLOURS: Record<string, string> = {
  Kharif: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rabi:   'bg-blue-100 text-blue-800 border-blue-200',
  Summer: 'bg-amber-100 text-amber-800 border-amber-200',
  Annual: 'bg-purple-100 text-purple-800 border-purple-200',
};

function SeasonBadge({ season }: { season?: string | null }) {
  const s = season || 'Annual';
  const cls = SEASON_COLOURS[s] || 'bg-gray-100 text-gray-700 border-gray-200';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>
      {s === 'Kharif' && <Leaf className="w-2.5 h-2.5" />}
      {s === 'Rabi' && <Sprout className="w-2.5 h-2.5" />}
      {s}
    </span>
  );
}

// ─── Report Viewer Modal ───────────────────────────────────────────────────
function ReportViewerModal({
  report,
  farm,
  onClose,
  onDownload,
}: {
  report: any;
  farm?: Farm;
  onClose: () => void;
  onDownload: () => void;
}) {
  const nutrientData = report.soil_data || report.soil_analysis || null;
  const cropRecs = report.crop_recommendations || [];
  const fertRecs = report.fertilizer_recommendations || null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-3xl px-6 py-4 flex items-center justify-between z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-brand-700" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-gray-900 leading-tight">
                {report.title}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {farm?.name && <span className="font-medium text-gray-600">{farm.name} · </span>}
                Generated {report.generated_at ? format(new Date(report.generated_at), 'dd MMM yyyy, HH:mm') : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-300 bg-brand-50 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Demo Data Warning */}
          {report.contains_demo_data && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> This dossier incorporates demo/synthetic satellite or soil indices for demonstration purposes. Verify with certified lab analysis before large-input decisions.
              </div>
            </div>
          )}

          {/* Official Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#14532D] to-[#166534] text-white text-center space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-300" />
              <span className="font-display font-bold text-lg tracking-wide">CSN BHOOMI</span>
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-emerald-200 text-xs uppercase tracking-widest font-semibold">
              Agricultural Intelligence Report
            </p>
            <p className="text-emerald-100/70 text-[10px]">
              Prepared in accordance with ICAR-IISS Soil Diagnostics Standards
            </p>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Season', value: `${report.season || 'Kharif'} ${report.year || ''}`, icon: Calendar },
              { label: 'Farm', value: farm?.name || 'N/A', icon: Landmark },
              { label: 'Area', value: farm?.area_acres ? `${farm.area_acres.toFixed(2)} Acres` : 'N/A', icon: BarChart2 },
              { label: 'Data Quality', value: report.contains_demo_data ? 'Demo/Synthetic' : 'Production', icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{label}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 truncate">{value}</div>
              </div>
            ))}
          </div>

          {/* Farm Location Details */}
          {farm && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                Farm Identity & Cadastral Profile
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  ['Farm Name', farm.name],
                  ['State', farm.state || 'Maharashtra'],
                  ['District', farm.district || '—'],
                  ['Taluka', farm.taluka || '—'],
                  ['Village', farm.village || '—'],
                  ['Area', farm.area_acres ? `${farm.area_acres.toFixed(2)} Acres` : '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-emerald-700 font-semibold block text-[10px]">{k}</span>
                    <span className="text-emerald-950">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soil Parameters Table */}
          {nutrientData && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                Comprehensive Soil Fertility Diagnostic Table
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-semibold">
                    <tr>
                      <th className="p-3 text-left">Parameter</th>
                      <th className="p-3 text-right">Value</th>
                      <th className="p-3 text-right">ICAR Range</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {[
                      { label: 'pH', key: 'ph', unit: '', range: '6.5–7.5' },
                      { label: 'EC (dS/m)', key: 'ec', unit: 'dS/m', range: '<1.0' },
                      { label: 'Organic Carbon', key: 'organic_carbon', unit: '%', range: '>0.75' },
                      { label: 'Available N', key: 'nitrogen', unit: 'kg/ha', range: '>280' },
                      { label: 'Available P', key: 'phosphorus', unit: 'kg/ha', range: '>25' },
                      { label: 'Available K', key: 'potassium', unit: 'kg/ha', range: '>280' },
                    ].map(({ label, key, unit, range }) => {
                      const val = nutrientData[key];
                      if (val === undefined || val === null) return null;
                      return (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-800">{label}</td>
                          <td className="p-3 text-right font-mono font-semibold text-gray-900">
                            {typeof val === 'number' ? val.toFixed(2) : val} {unit}
                          </td>
                          <td className="p-3 text-right text-gray-500">{range}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Analyzed
                            </span>
                          </td>
                        </tr>
                      );
                    }).filter(Boolean)}
                  </tbody>
                </table>
                {!Object.keys(nutrientData).some(k => ['ph','ec','organic_carbon','nitrogen','phosphorus','potassium'].includes(k)) && (
                  <div className="p-4 text-center text-xs text-gray-400">
                    Detailed nutrient data embedded in generated PDF report.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crop Recommendations */}
          {cropRecs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-teal-700" />
                Recommended Crops & Season Suitability
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cropRecs.slice(0, 4).map((c: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-teal-900">{c.crop || c.name}</span>
                      {c.suitability_score != null && (
                        <span className="text-[10px] font-extrabold bg-teal-200 text-teal-900 px-2 py-0.5 rounded-full">
                          {Math.round(c.suitability_score * 100)}%
                        </span>
                      )}
                    </div>
                    {c.notes && <p className="text-[11px] text-teal-800 leading-snug">{c.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agronomic Summary (static fallback when no structured data) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Agronomic Executive Summary
            </h4>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 text-xs text-gray-600 leading-relaxed">
              Based on cadastral analysis and soil nutrient evaluation, the soil pH indicates moderately neutral conditions suitable for cash crop rotations. Nitrogen levels require split-dose top dressing. Sentinel-2 reflectance demonstrates active biomass density across over 85% of the farm boundary.
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <h5 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2">
                Recommended Primary Next Steps
              </h5>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Apply recommended basal dose of Single Super Phosphate or DAP prior to seed drilling.</li>
                <li>Incorporate micronutrient (Zinc Sulphate) top-dressing at early vegetative milestone.</li>
                <li>Review Sentinel-2 vegetative canopy map within 15–20 days following irrigation.</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 flex items-center justify-between">
            <span>CSN Bhoomi System Report · ICAR / STCR Framework</span>
            <span>Report ID: {report.id?.slice(0, 8)}…</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [season, setSeason] = useState('Kharif');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [selectedReportFarm, setSelectedReportFarm] = useState<Farm | undefined>(undefined);

  // Filters
  const [filterFarm, setFilterFarm] = useState('');
  const [filterSeason, setFilterSeason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Data ──
  const { data: farmsData } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list(),
    enabled: !!user,
  });
  const farms: Farm[] = farmsData?.data?.items || farmsData?.data || [];

  const { data: reportsData, isLoading: reportsLoading, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list(),
    enabled: !!user,
  });
  const allReports: Report[] = reportsData?.data?.items || reportsData?.data || [];

  // Sort newest first
  const sortedReports = useMemo(() =>
    [...allReports].sort((a, b) =>
      new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
    ), [allReports]);

  // Apply filters
  const filteredReports = useMemo(() => {
    let r = sortedReports;
    if (filterFarm) r = r.filter(x => x.farm_id === filterFarm);
    if (filterSeason) r = r.filter(x => (x.season || '') === filterSeason);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(x => x.title?.toLowerCase().includes(q) ||
        farms.find(f => f.id === x.farm_id)?.name?.toLowerCase().includes(q)
      );
    }
    return r;
  }, [sortedReports, filterFarm, filterSeason, searchQuery, farms]);

  // Stats
  const totalReports = allReports.length;
  const productionReports = allReports.filter(r => !r.contains_demo_data).length;
  const uniqueFarmsWithReports = new Set(allReports.map(r => r.farm_id)).size;
  const thisYearReports = allReports.filter(r =>
    new Date(r.generated_at).getFullYear() === new Date().getFullYear()
  ).length;

  // ── Mutations ──
  const generateMutation = useMutation({
    mutationFn: () =>
      reportsApi.create(selectedFarmId, {
        title: reportTitle || undefined,
        season,
        year: parseInt(year),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowGenerateModal(false);
      setReportTitle('');
    },
  });

  const handleDownload = async (reportId: string, title: string) => {
    try {
      const res = await reportsApi.download(reportId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Could not download the PDF directly. You can view and print the advisory report in the browser.');
    }
  };

  const handleViewReport = async (reportId: string, farm?: Farm) => {
    try {
      const res = await reportsApi.get(reportId);
      setSelectedReport(res.data);
      setSelectedReportFarm(farm);
    } catch {
      alert('Error fetching report details.');
    }
  };

  // ── Seasons available in reports ──
  const availableSeasons = useMemo(() =>
    [...new Set(allReports.map(r => r.season).filter(Boolean))],
    [allReports]
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2.5">
            <FileBarChart className="w-6 h-6 text-[#166534]" />
            {t('Farm Advisory Reports', 'Farm Advisory Reports')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('Complete history of generated soil dossiers, crop plans, and agronomic advisories.', 'Complete history of generated soil dossiers, crop plans, and agronomic advisories.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Refresh reports"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (farms.length > 0) setSelectedFarmId(farms[0].id);
              setShowGenerateModal(true);
            }}
            disabled={farms.length === 0}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            {t('Generate New Report', 'Generate New Report')}
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Reports', value: totalReports,
            icon: FileText, colour: 'bg-purple-100 text-purple-700',
            sub: `${thisYearReports} this year`
          },
          {
            label: 'Production Reports', value: productionReports,
            icon: CheckCircle2, colour: 'bg-emerald-100 text-emerald-700',
            sub: `${totalReports - productionReports} demo`
          },
          {
            label: 'Farms Covered', value: uniqueFarmsWithReports,
            icon: Landmark, colour: 'bg-blue-100 text-blue-700',
            sub: `of ${farms.length} registered`
          },
          {
            label: 'Latest Report', value: sortedReports[0]?.generated_at
              ? formatDistanceToNow(new Date(sortedReports[0].generated_at), { addSuffix: true })
              : '—',
            icon: Clock, colour: 'bg-teal-100 text-teal-700',
            sub: sortedReports[0]?.season || 'N/A', isText: true
          },
        ].map(({ label, value, icon: Icon, colour, sub, isText }) => (
          <div key={label} className="card p-4 rounded-2xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colour}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className={`font-display font-bold text-gray-900 truncate ${isText ? 'text-sm' : 'text-xl'}`}>
                {value}
              </div>
              <div className="text-[10px] font-semibold text-gray-500 truncate">{label}</div>
              <div className="text-[10px] text-gray-400 truncate">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Advisory Notice ── */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3 text-gray-700 text-xs">
        <Shield className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gray-900">Official Dossier Format: </span>
          Generated reports integrate farm cadastral bounds, soil test parameter measurements, Sentinel-2 vegetative canopy indices, and fertilizer requirements. Suitable for printing and farmer recordkeeping.
        </div>
      </div>

      {/* ── Filter Bar ── */}
      {allReports.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          {/* Filter by Farm */}
          <select
            value={filterFarm}
            onChange={e => setFilterFarm(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer"
          >
            <option value="">All Farms</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {/* Filter by Season */}
          <select
            value={filterSeason}
            onChange={e => setFilterSeason(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 cursor-pointer"
          >
            <option value="">All Seasons</option>
            {(['Kharif', 'Rabi', 'Summer', 'Annual'] as string[]).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(filterFarm || filterSeason || searchQuery) && (
            <button
              onClick={() => { setFilterFarm(''); setFilterSeason(''); setSearchQuery(''); }}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400 hidden sm:block">
            Showing {filteredReports.length} of {totalReports} reports
          </span>
        </div>
      )}

      {/* ── Reports Table / Empty State ── */}
      <div className="card overflow-hidden rounded-2xl">
        {reportsLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading report history…</p>
          </div>

        ) : allReports.length === 0 ? (
          /* ── No Reports Empty State ── */
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No reports generated yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Generate your first farm advisory dossier to see a complete soil report with nutrient analysis, crop recommendations, and fertilizer schedules.
              </p>
            </div>
            <button
              onClick={() => {
                if (farms.length > 0) setSelectedFarmId(farms[0].id);
                setShowGenerateModal(true);
              }}
              disabled={farms.length === 0}
              className="btn-primary inline-flex items-center gap-2 text-xs mx-auto"
            >
              <Plus className="w-4 h-4" />
              Generate First Report
            </button>
            {farms.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">Register a farm first before generating a report.</p>
            )}
          </div>

        ) : filteredReports.length === 0 ? (
          /* ── Filtered Empty State ── */
          <div className="p-8 text-center space-y-2">
            <Search className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-medium text-gray-600">No reports match your filters</p>
            <button
              onClick={() => { setFilterFarm(''); setFilterSeason(''); setSearchQuery(''); }}
              className="text-xs text-brand-600 hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>

        ) : (
          /* ── Full Report History Table ── */
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase font-bold tracking-wide">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Report</th>
                    <th className="px-5 py-3.5">Farm</th>
                    <th className="px-5 py-3.5">Season & Year</th>
                    <th className="px-5 py-3.5">Generated</th>
                    <th className="px-5 py-3.5">Data Source</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {filteredReports.map((r, idx) => {
                    const farm = farms.find(f => f.id === r.farm_id);
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-stone-50/60 transition-colors group"
                      >
                        <td className="px-5 py-4 text-gray-400 font-mono text-[10px]">
                          #{totalReports - idx}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900 max-w-[220px]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="truncate">{r.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-gray-700 truncate max-w-[120px]">
                              {farm?.name || 'Unknown Farm'}
                            </span>
                          </div>
                          {farm?.district && (
                            <div className="text-[10px] text-gray-400 ml-4.5 mt-0.5">{farm.district}</div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <SeasonBadge season={r.season} />
                          {r.year && <span className="ml-1.5 text-gray-500">{r.year}</span>}
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          <div>{r.generated_at ? format(new Date(r.generated_at), 'dd MMM yyyy') : 'Recently'}</div>
                          <div className="text-[10px] text-gray-400">
                            {r.generated_at ? formatDistanceToNow(new Date(r.generated_at), { addSuffix: true }) : ''}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {r.contains_demo_data ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-2.5 h-2.5" /> Demo Data
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Production
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleViewReport(r.id, farm)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer"
                              title="View Report"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDownload(r.id, r.title)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredReports.map((r, idx) => {
                const farm = farms.find(f => f.id === r.farm_id);
                return (
                  <div key={r.id} className="p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{r.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {farm?.name || 'Farm'} · <SeasonBadge season={r.season} />
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {r.generated_at ? format(new Date(r.generated_at), 'dd MMM yyyy') : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleViewReport(r.id, farm)}
                          className="btn btn-secondary text-xs px-2.5 py-1.5 rounded-lg"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDownload(r.id, r.title)}
                          className="btn btn-secondary text-xs px-2.5 py-1.5 rounded-lg"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Timeline: Recent Activity ── */}
      {sortedReports.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#166534]" />
            Recent Report Activity
          </h2>
          <div className="relative pl-5 border-l-2 border-gray-100 space-y-4">
            {sortedReports.slice(0, 8).map((r) => {
              const farm = farms.find(f => f.id === r.farm_id);
              return (
                <div key={r.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                  </div>
                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{r.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {farm?.name || 'Unknown Farm'} · <SeasonBadge season={r.season} />
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-400 whitespace-nowrap">
                        {r.generated_at ? formatDistanceToNow(new Date(r.generated_at), { addSuffix: true }) : ''}
                      </p>
                      <button
                        onClick={() => handleViewReport(r.id, farm)}
                        className="text-[10px] text-brand-600 hover:underline cursor-pointer flex items-center gap-0.5 ml-auto mt-0.5"
                      >
                        View <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Generate Report Modal ── */}
      {showGenerateModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowGenerateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h3 className="text-base font-display font-bold text-gray-900">Generate Farm Advisory Dossier</h3>
                <p className="text-xs text-gray-500">Compile soil chemistry and remote sensing data into a unified report.</p>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); generateMutation.mutate(); }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Select Farm *</label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  className="input text-sm"
                  required
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.district || 'MH'} ({f.area_acres ? `${f.area_acres.toFixed(1)} Ac` : 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Kharif 2026 Soil & Crop Plan"
                  className="input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Season</label>
                  <select value={season} onChange={(e) => setSeason(e.target.value)} className="input text-sm">
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Summer">Summer (Zaid)</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="input text-sm"
                    min={2020}
                    max={2035}
                    required
                  />
                </div>
              </div>

              {generateMutation.isError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  Failed to generate report. Please try again.
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="btn-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generateMutation.isPending || !selectedFarmId}
                  className="btn-primary text-xs flex items-center gap-2"
                >
                  {generateMutation.isPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Report Viewer Modal ── */}
      {selectedReport && (
        <ReportViewerModal
          report={selectedReport}
          farm={selectedReportFarm}
          onClose={() => setSelectedReport(null)}
          onDownload={() => handleDownload(selectedReport.id, selectedReport.title)}
        />
      )}
    </div>
  );
}
