import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { farmsApi, soilApi } from '../services/api';
import type { Farm, SoilSample, FarmProfile } from '../types';
import {
  MapPin,
  Ruler,
  Landmark,
  Microscope,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Download,
  FlaskConical,
  Sprout,
  Droplets,
  Calendar,
  CheckCircle2,
  FileText,
  Target,
  Pencil
} from 'lucide-react';
import { format } from 'date-fns';
import InteractiveFieldMap from '../components/InteractiveFieldMap';
import FarmProfileWizardModal from '../components/FarmProfileWizardModal';
import { generateSoilReportPdf } from '../utils/generateSoilReportPdf';
import { useLanguage } from '../context/LanguageContext';

export default function FarmDetailPage() {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { data: farm, isLoading: farmLoading, refetch: refetchFarm } = useQuery<Farm>({
    queryKey: ['farm', farmId],
    queryFn: () => farmsApi.get(farmId!).then(r => r.data),
    enabled: !!farmId,
  });

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery<FarmProfile | null>({
    queryKey: ['farm-profile', farmId],
    queryFn: () =>
      farmsApi
        .getProfile(farmId!)
        .then(r => r.data)
        .catch(() => null),
    enabled: !!farmId,
  });

  const { data: samples = [] } = useQuery<SoilSample[]>({
    queryKey: ['soil-samples', farmId],
    queryFn: () => soilApi.getSamplesForFarm(farmId!).then(r => r.data),
    enabled: !!farmId,
  });

  const handleDownloadPdf = async () => {
    if (!farm) return;
    setIsGeneratingPdf(true);
    try {
      generateSoilReportPdf({
        farm,
        farmProfile: profile,
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Could not generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (farmLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!farm) {
    return <div className="card text-center py-12 text-gray-500">Farm not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12 font-sans">
      {/* ── Navigation and Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5DD] pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/farms"
            className="p-2 rounded-xl border border-gray-200 hover:bg-stone-100 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{farm.name}</h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                farm.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {farm.status}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {farm.village ? `${farm.village}, ` : ''}{farm.taluka ? `${farm.taluka}, ` : ''}{farm.district || 'Pune'}, {farm.state || 'Maharashtra'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="btn btn-secondary border-amber-300 bg-amber-50/70 text-amber-950 hover:bg-amber-100 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{profile ? 'Edit Farm Profile' : 'Complete Profile'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn btn-secondary border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>

          <button
            onClick={() => navigate(`/agents/soil-analysis?farmId=${farm.id}`)}
            className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Analyze Soil</span>
          </button>

          <button
            onClick={() => navigate(`/agents/farming-assistant?farmId=${farm.id}`)}
            className="btn btn-secondary border-teal-300 text-teal-900 hover:bg-teal-50 text-xs px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Sprout className="w-4 h-4 text-teal-700" />
            <span>Farming Assistant</span>
          </button>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-gray-900 text-base">Field Geometry & Location</h2>
                <p className="text-xs text-gray-500">Authoritative boundary from polygon coordinates</p>
              </div>
              {!farm.boundary_geojson ? (
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> No boundary drawn
                </span>
              ) : (
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authoritative Boundary
                </span>
              )}
            </div>
            <InteractiveFieldMap
              initialGeojson={farm.boundary_geojson}
              initialCenter={farm.latitude && farm.longitude ? [farm.latitude, farm.longitude] : undefined}
            />
          </div>

          {/* ── Agricultural Profile Card ── */}
          <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-gray-900 text-base">Agricultural Profile & Crop Context</h2>
                  <p className="text-xs text-gray-500">Used by Soil Model & Gemini Advisor for calibrated recommendations</p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border-amber-300 text-amber-900 hover:bg-amber-50 flex items-center gap-1 font-semibold"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{profile ? 'Edit' : 'Set Up'}</span>
              </button>
            </div>

            {profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200/60">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Target Crop & Timing</span>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Crop:</span>
                    <strong className="text-gray-900">{profile.target_crop || '—'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Season:</span>
                    <span className="text-gray-800 capitalize">{profile.season || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sowing Month:</span>
                    <span className="text-gray-800">{profile.sowing_month || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="text-gray-800">{profile.crop_duration_days ? `${profile.crop_duration_days} days` : '—'}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200/60">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Water & Irrigation</span>
                  <div className="flex justify-between">
                    <span className="text-gray-500">System:</span>
                    <strong className="text-gray-900 capitalize">{profile.farming_type || '—'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method:</span>
                    <span className="text-gray-800 capitalize">{profile.irrigation_method?.replace('_', ' ') || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Availability:</span>
                    <span className="text-gray-800 capitalize">{profile.water_availability?.replace('_', ' ') || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Water Source:</span>
                    <span className="text-gray-800 capitalize">{profile.water_source?.replace('_', ' ') || '—'}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200/60">
                  <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">Previous Practices</span>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Previous Crop:</span>
                    <strong className="text-gray-900">{profile.previous_crop || '—'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Crop Rotation:</span>
                    <span className="text-gray-800">{profile.crop_rotation_history || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">FYM Manure:</span>
                    <span className="text-gray-800">{profile.fym_manure_tons_per_acre ? `${profile.fym_manure_tons_per_acre} tons/acre` : 'None applied'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fertilizers:</span>
                    <span className="text-gray-800 truncate max-w-[140px]">{profile.fertilizer_used_previously || '—'}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200/60">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Objective & Lab Report</span>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primary Goal:</span>
                    <strong className="text-gray-900 truncate max-w-[140px]">{profile.farming_objective?.replace(/_/g, ' ') || '—'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Soil Lab Card:</span>
                    <span className={`font-semibold ${profile.has_lab_report ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {profile.has_lab_report ? '✓ Laboratory Card On File' : 'No Lab Data (Model Estimates Used)'}
                    </span>
                  </div>
                  {profile.lab_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Testing Lab:</span>
                      <span className="text-gray-800">{profile.lab_name}</span>
                    </div>
                  )}
                  {profile.lab_sample_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sample ID:</span>
                      <span className="text-gray-800 font-mono">{profile.lab_sample_id}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
                <Target className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-900">Farm Profile Not Completed</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Adding your target crop, season, and irrigation details enables tailored fertilizer schedules and crop advisories.
                </p>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="mt-3 btn btn-primary bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complete Farm Profile Now</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details & Area Column */}
        <div className="space-y-4">
          <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-3">Farm Registration Details</h2>
            <dl className="space-y-2.5">
              {[
                { label: 'Farmer / Owner', value: farm.owner_name || '—' },
                { label: 'State', value: farm.state || 'Maharashtra' },
                { label: 'District', value: farm.district || '—' },
                { label: 'Taluka', value: farm.taluka || '—' },
                { label: 'Village', value: farm.village || '—' },
                { label: '7/12 Land Record', value: farm.land_record_ref || '—' },
                { label: 'Registered On', value: format(new Date(farm.created_at), 'dd MMM yyyy') },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-2 text-xs border-b border-gray-100 pb-1.5 last:border-0 last:pb-0">
                  <dt className="text-gray-500 font-medium flex-shrink-0">{label}</dt>
                  <dd className="text-gray-900 font-semibold text-right truncate max-w-[160px]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
            <h2 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#166534]" />
              <span>Authoritative Field Area</span>
            </h2>
            {farm.area_sqm ? (
              <div className="space-y-2 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <div className="text-2xl font-display font-bold text-[#166534]">
                  {farm.area_acres?.toFixed(2)} <span className="text-sm font-normal text-gray-600">Acres</span>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {farm.area_hectares?.toFixed(3)} Hectares
                </div>
                <div className="text-xs text-gray-400 font-mono">{farm.area_sqm.toLocaleString()} m² (sq meters)</div>
                <p className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-200/60">
                  Calculated automatically from geodetic polygon boundary.
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Draw a boundary on the map to calculate area.</p>
            )}
          </div>

          {farm.latitude && farm.longitude && (
            <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
              <h2 className="font-display font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#166534]" />
                <span>GPS Coordinates</span>
              </h2>
              <p className="text-xs text-gray-600 font-mono">
                {farm.latitude.toFixed(6)}°N, {farm.longitude.toFixed(6)}°E
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Soil Samples & Lab Cards ── */}
      <div className="card bg-white border border-[#DCE5DD] p-5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-[#166534]" />
            <h2 className="font-display font-bold text-gray-900 text-base">
              Soil Test Records ({samples.length})
            </h2>
          </div>
          <button
            onClick={() => navigate(`/agents/soil-analysis?farmId=${farm.id}`)}
            className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border-emerald-300 text-emerald-900 hover:bg-emerald-50 font-semibold"
          >
            Run Soil AI Analysis
          </button>
        </div>
        {samples.length === 0 ? (
          <div className="text-center py-8">
            <Microscope className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-600">No laboratory samples recorded yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              You can run satellite AI estimation or input Soil Health Card parameters in the Soil Analysis agent.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                  <th className="pb-2">Sample Label</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Data Source</th>
                  <th className="pb-2">Parameters</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {samples.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="py-2.5 font-semibold text-gray-900">{s.sample_label || '—'}</td>
                    <td className="py-2.5 text-gray-500">{s.sample_date || '—'}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                        {s.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5">{s.measurements.length} measured</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.verification_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800'
                          : s.verification_status === 'rejected'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {s.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Farm Profile Wizard Modal ── */}
      <FarmProfileWizardModal
        farm={farm}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          refetchProfile();
          refetchFarm();
        }}
      />
    </div>
  );
}
