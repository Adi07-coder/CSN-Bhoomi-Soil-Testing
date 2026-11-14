import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { farmsApi, reportsApi } from '../services/api';
import type { Farm, Report, SelectedFieldData } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Landmark,
  MapPin,
  Trash2,
  Pencil,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Info,
  Map as MapIcon,
  Layers,
  ShieldCheck,
  FlaskConical,
  Sprout,
  Compass,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useActiveFarm } from '../context/FarmContext';
import InteractiveFieldMap from '../components/InteractiveFieldMap';
import FarmProfileWizardModal from '../components/FarmProfileWizardModal';

const farmSchema = z.object({
  name: z.string().trim().min(1, 'Farm Name / Land Name is required'),
  owner_name: z.string().trim().min(1, 'Farmer / Owner Name is required'),
  land_record_ref: z.string().optional(),
  notes: z.string().optional(),
});

type FarmForm = z.infer<typeof farmSchema>;

const MH_DISTRICTS = [
  'Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana',
  'Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna',
  'Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar',
  'Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri',
  'Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal',
];

function FarmCard({
  farm,
  onEdit,
  onDelete,
  onSelectSoil,
  onSelectAdvice,
  onOpenProfile,
}: {
  farm: Farm;
  onEdit: (f: Farm) => void;
  onDelete: (id: string) => void;
  onSelectSoil: (f: Farm) => void;
  onSelectAdvice: (f: Farm) => void;
  onOpenProfile?: (f: Farm) => void;
}) {
  const { t } = useLanguage();
  const acres = farm.area_acres || 0;
  const ha = acres * 0.404686;
  const hasBoundary = !!farm.boundary_geojson;

  return (
    <div className="card bg-white border border-[#DCE5DD] shadow-xs p-5 rounded-2xl flex flex-col justify-between hover:shadow-card-hover transition-all">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-[#166534]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base leading-tight">
                {farm.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {farm.village ? `${farm.village}, ` : ''}{farm.district || 'Pune'}, {farm.state || 'Maharashtra'}
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            hasBoundary ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-gray-100 text-gray-600'
          }`}>
            {hasBoundary ? t('Boundary Mapped', 'Boundary Mapped') : t('Unmapped', 'Unmapped')}
          </span>
        </div>

        {/* Area & Details Box */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl mb-4 text-xs">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">{t('Field Area', 'Field Area')}</span>
            <strong className="text-gray-900 text-sm">
              {acres > 0 ? `${acres.toFixed(2)} Acres` : '—'}
            </strong>
            {acres > 0 && (
              <span className="text-[10px] text-gray-500 block">({ha.toFixed(2)} Hectares)</span>
            )}
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block font-medium">{t('7/12 Land Record', '7/12 Land Record')}</span>
            <span className="text-gray-800 text-xs font-semibold block truncate">
              {farm.land_record_ref || '—'}
            </span>
            <span className="text-[10px] text-gray-400 block">
              {farm.owner_name ? `Owner: ${farm.owner_name}` : 'Registered Field'}
            </span>
          </div>

          {farm.latitude && farm.longitude && (
            <div className="col-span-2 pt-1 border-t border-gray-200/60 text-[11px] text-gray-500 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3 h-3 text-[#166534]" />
              <span>{farm.latitude.toFixed(4)}°N, {farm.longitude.toFixed(4)}°E</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions: Direct Link to the Two AI Agents */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSelectSoil(farm)}
            className="btn btn-secondary text-xs py-2 rounded-xl border-emerald-300 text-emerald-900 hover:bg-emerald-50 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#166534]" />
            <span>{t('Analyze Soil', 'Analyze Soil')}</span>
          </button>

          <button
            onClick={() => onSelectAdvice(farm)}
            className="btn btn-secondary text-xs py-2 rounded-xl border-teal-300 text-teal-900 hover:bg-teal-50 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
          >
            <Sprout className="w-3.5 h-3.5 text-teal-700" />
            <span>{t('Farming Assistant', 'Farming Assistant')}</span>
          </button>
        </div>

        {onOpenProfile && (
          <button
            onClick={() => onOpenProfile(farm)}
            className="w-full btn btn-secondary text-xs py-2 rounded-xl border-amber-300 bg-amber-50/70 text-amber-900 hover:bg-amber-100 flex items-center justify-center gap-1.5 font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('Crop & Soil Profile', 'Crop & Soil Profile')}</span>
          </button>
        )}

        <div className="flex items-center justify-between pt-1">
          <Link
            to={`/farms/${farm.id}`}
            className="text-xs text-[#166534] hover:underline font-semibold flex items-center gap-1"
          >
            <span>{t('Open Full Farm Details', 'Open Full Farm Details')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(farm)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-stone-100 hover:text-gray-900 cursor-pointer"
              title={t('Edit Farm', 'Edit Farm')}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(farm.id)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
              title={t('Delete Farm', 'Delete Farm')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setSelectedFarmId } = useActiveFarm();

  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editFarm, setEditFarm] = useState<Farm | null>(null);
  const [savedFarmNotice, setSavedFarmNotice] = useState<Farm | null>(null);
  const [profileWizardFarm, setProfileWizardFarm] = useState<Farm | null>(null);

  // Authoritative Selected Field State from InteractiveFieldMap
  const [selectedField, setSelectedField] = useState<SelectedFieldData | null>(null);
  const [mappedBoundaryGeojson, setMappedBoundaryGeojson] = useState<string | null>(null);
  const [mapNoticeMessage, setMapNoticeMessage] = useState<string | null>(null);
  const [selectedRegisteredFarmId, setSelectedRegisteredFarmId] = useState<string>('');

  // Track trigger element for accessible focus return
  const triggerRef = useRef<HTMLElement | null>(null);

  // Lock body scroll and handle Escape key for modals
  useEffect(() => {
    if (!showForm && !savedFarmNotice) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showForm) {
          setShowForm(false);
          triggerRef.current?.focus();
        }
        if (savedFarmNotice) setSavedFarmNotice(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showForm, savedFarmNotice]);

  const { data: farmsData = [], isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list().then(r => r.data),
  });

  const farms: Farm[] = Array.isArray(farmsData)
    ? farmsData
    : (farmsData?.items || farmsData?.data || []);

  const selectedFarmObj = selectedRegisteredFarmId
    ? farms.find((f) => f.id === selectedRegisteredFarmId) || null
    : null;

  const handleQuickSelectRegisteredFarm = (farmId: string) => {
    setSelectedRegisteredFarmId(farmId);
    if (!farmId) return;
    const farm = farms.find((f) => f.id === farmId);
    if (!farm) return;
    if (farm.boundary_geojson) {
      setMappedBoundaryGeojson(farm.boundary_geojson);
      setMapNoticeMessage(null);
    }
  };

  const { data: reportsData = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list().then(r => r.data),
  });

  const reports: Report[] = Array.isArray(reportsData)
    ? reportsData
    : (reportsData?.items || reportsData?.data || []);

  const totalAcres = farms.reduce((s, f) => s + (f.area_acres || 0), 0);
  const totalHectares = totalAcres * 0.404686;
  const fieldsMapped = farms.filter(f => f.boundary_geojson).length;

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FarmForm>({
    resolver: zodResolver(farmSchema),
    defaultValues: { name: '', owner_name: '', land_record_ref: '', notes: '' },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => farmsApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
      reset();
      setSelectedField(null);
      setMappedBoundaryGeojson(null);
      setMapNoticeMessage(null);
      triggerRef.current?.focus();
      if (res?.data) {
        setSelectedFarmId(res.data.id);
        setSavedFarmNotice(res.data);
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || err.message || t('Failed to register farm. Please try again.', 'Failed to register farm. Please try again.'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => farmsApi.update(id, data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['farms'] });
      setShowForm(false);
      reset();
      setEditFarm(null);
      triggerRef.current?.focus();
      if (res?.data) {
        setSavedFarmNotice(res.data);
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.detail || err.message || t('Failed to update farm record.', 'Failed to update farm record.'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => farmsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['farms'] }),
  });

  const handleEdit = (farm: Farm, e?: React.MouseEvent) => {
    if (e) triggerRef.current = e.currentTarget as HTMLElement;
    setEditFarm(farm);
    setValue('name', farm.name);
    setValue('owner_name', farm.owner_name || '');
    setValue('land_record_ref', farm.land_record_ref || '');
    setValue('notes', farm.notes || '');
    setMappedBoundaryGeojson(farm.boundary_geojson);
    setShowForm(true);
  };

  const handleOpenAddModal = (e?: React.MouseEvent) => {
    if (e) triggerRef.current = e.currentTarget as HTMLElement;
    setEditFarm(null);

    // BLOCK REGISTRATION IF NO VALID FIELD SELECTED ON MAP
    if (!selectedField || !selectedField.isValid || !selectedField.isFinalized) {
      setActiveTab('map');
      setMapNoticeMessage(
        t(
          'Select your field on the map to begin farm registration. Draw your field boundary (3 to 20 points) and click "Finish Polygon" first.',
          'Select your field on the map to begin farm registration. Draw your field boundary (3 to 20 points) and click "Finish Polygon" first.'
        )
      );
      return;
    }

    setMapNoticeMessage(null);
    reset({
      name: '',
      owner_name: '',
      land_record_ref: '',
      notes: '',
    });
    setShowForm(true);
  };

  const onSubmit = async (data: FarmForm) => {
    if (editFarm) {
      const payload = {
        name: data.name.trim(),
        owner_name: data.owner_name.trim(),
        land_record_ref: data.land_record_ref?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      };
      await updateMutation.mutateAsync({ id: editFarm.id, data: payload });
      return;
    }

    if (!selectedField || !selectedField.isValid || !selectedField.isFinalized || !selectedField.geojson) {
      alert(t('A valid field boundary selected on the map is mandatory for farm registration.', 'A valid field boundary selected on the map is mandatory for farm registration.'));
      return;
    }

    const payload = {
      name: data.name.trim(),
      owner_name: data.owner_name.trim(),
      land_record_ref: data.land_record_ref?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      state: selectedField.adminLocation.state || 'Maharashtra',
      district: selectedField.adminLocation.district || undefined,
      taluka: selectedField.adminLocation.taluka || undefined,
      village: selectedField.adminLocation.village || undefined,
      latitude: selectedField.centroid[0],
      longitude: selectedField.centroid[1],
      boundary_geojson: selectedField.geojson,
    };

    await createMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* ── Section A: Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5DD] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
            {t('My Farms', 'My Farms')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            {t(
              'Manage your fields, check their size, and explore soil and planting information.',
              'Manage your fields, check their size, and explore soil and planting information.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('map')}
            className={`btn text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-emerald-100 text-emerald-950 font-semibold'
                : 'bg-white border border-[#DCE5DD] text-gray-700 hover:bg-stone-50'
            }`}
          >
            <MapIcon className="w-4 h-4 text-[#166534]" />
            <span>{t('Map Workspace', 'Map Workspace')}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add New Farm', 'Add New Farm')}</span>
          </button>
        </div>
      </div>

      {/* ── Summary Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#DCE5DD] rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
            {t('Total Farms', 'Total Farms')}
          </span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">
            {isLoading ? '...' : farms.length}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {t('Active registered farm records', 'Active registered farm records')}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DCE5DD] rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
            {t('Total Land Area', 'Total Land Area')}
          </span>
          <span className="text-2xl font-bold text-gray-900 mt-1 block">
            {totalAcres.toFixed(1)} <span className="text-xs font-normal text-gray-500">Acres</span>
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {totalHectares.toFixed(1)} Hectares total
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DCE5DD] rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
            {t('Fields Analyzed', 'Fields Analyzed')}
          </span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">
            {fieldsMapped}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {t('Boundary demarcated parcels', 'Boundary demarcated parcels')}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#DCE5DD] rounded-2xl shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 block uppercase tracking-wider">
            {t('Reports Available', 'Reports Available')}
          </span>
          <span className="text-2xl font-bold text-purple-800 mt-1 block">
            {reports.length}
          </span>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {t('Printable 2-page farm dossiers', 'Printable 2-page farm dossiers')}
          </span>
        </div>
      </div>

      {/* ── View Navigation Tabs ── */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'border-[#166534] text-[#166534]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {t('My Saved Fields', 'My Saved Fields')} ({farms.length})
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'map'
              ? 'border-[#166534] text-[#166534]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t('Field Boundary & Map Workspace', 'Field Boundary & Map Workspace')}</span>
          {selectedField && selectedField.areaAcres > 0 && (
            <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {selectedField.areaAcres.toFixed(2)} ac
            </span>
          )}
        </button>
      </div>

      {/* ── TAB 1: SAVED FARMS DIRECTORY ── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card animate-pulse-soft h-48 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : farms.length === 0 ? (
            /* Empty State */
            <div className="card text-center py-16 bg-white border border-[#DCE5DD] rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-[#166534]">
                <Landmark className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-gray-900 text-lg">
                {t('No farms registered yet', 'No farms registered yet')}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {t(
                  'Select your field on the map to begin farm registration. Draw your field boundary to calculate authoritative area and register.',
                  'Select your field on the map to begin farm registration. Draw your field boundary to calculate authoritative area and register.'
                )}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('map')}
                  className="btn btn-primary bg-[#166534] text-xs px-6 py-2.5 rounded-xl shadow-xs"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>{t('Open Map & Draw Field', 'Open Map & Draw Field')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  onEdit={handleEdit}
                  onDelete={(id) => {
                    if (window.confirm(t('Are you sure you want to delete this farm?', 'Are you sure you want to delete this farm?'))) {
                      deleteMutation.mutate(id);
                    }
                  }}
                  onSelectSoil={(f) => {
                    setSelectedFarmId(f.id);
                    navigate(`/agents/soil-analysis?farmId=${f.id}`);
                  }}
                  onSelectAdvice={(f) => {
                    setSelectedFarmId(f.id);
                    navigate(`/agents/farming-assistant?farmId=${f.id}`);
                  }}
                  onOpenProfile={(f) => setProfileWizardFarm(f)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: INTERACTIVE MAP & GUIDED WORKFLOW ── */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          {/* Active Guidance or Incomplete Selection Notice */}
          {mapNoticeMessage && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-center gap-2.5 shadow-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="font-medium">{mapNoticeMessage}</span>
            </div>
          )}

          {/* ── Registered Farm Selection Dropdown & Redo Analysis Bar ── */}
          {farms.length > 0 && (
            <div className="p-3.5 bg-white border border-[#DCE5DD] rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#166534] border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <label htmlFor="farms-page-quick-select" className="text-xs font-bold text-gray-900 block truncate">
                    {t('Select Registered Farm:', 'Select Registered Farm:')}
                  </label>
                  <span className="text-[11px] text-gray-500 hidden sm:inline">
                    {t('Select from registered farm list to view boundary or redo analysis', 'Select from registered farm list to view boundary or redo analysis')}
                  </span>
                </div>
                <select
                  id="farms-page-quick-select"
                  value={selectedRegisteredFarmId}
                  onChange={(e) => handleQuickSelectRegisteredFarm(e.target.value)}
                  className="input input-sm py-1.5 px-3 font-semibold text-xs text-gray-900 border-gray-300 focus:ring-emerald-500 rounded-xl max-w-xs flex-1 cursor-pointer"
                >
                  <option value="">{t('-- Select a Registered Farm --', '-- Select a Registered Farm --')}</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {f.area_acres ? `(${f.area_acres.toFixed(2)} Ac)` : ''} · {f.district || 'Maharashtra'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFarmObj && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => navigate(`/agents/soil-analysis?farmId=${selectedFarmObj.id}`)}
                    className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>{t('Redo Soil Analysis (ML)', 'Redo Soil Analysis (ML)')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/agents/farming-assistant?farmId=${selectedFarmObj.id}`)}
                    className="btn btn-secondary text-brand-700 border-brand-300 hover:bg-brand-50 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
                  >
                    <Sprout className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('Plan Crops (AI)', 'Plan Crops (AI)')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/farms/${selectedFarmObj.id}`)}
                    className="btn btn-ghost text-xs text-gray-600 hover:bg-stone-100 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap"
                  >
                    {t('View Details', 'View Details')} →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Workflow Status Banner */}
          {!selectedField || !selectedField.isFinalized ? (
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-[#166534] flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">
                    {t('Select your field on the map to begin farm registration', 'Select your field on the map to begin farm registration')}:
                  </span>{' '}
                  <span className="text-gray-600">
                    {t(
                      '1. Search location → 2. Click corners to draw field boundary (3-20 points) → 3. Click "Finish Polygon" → 4. Save & Register Farm.',
                      '1. Search location → 2. Click corners to draw field boundary (3-20 points) → 3. Click "Finish Polygon" → 4. Save & Register Farm.'
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-white/80 border border-emerald-300 px-3 py-1 rounded-xl whitespace-nowrap">
                  {t('Awaiting Boundary', 'Awaiting Boundary')}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-sm">
                    {t('Field Boundary Verified & Ready to Register', 'Field Boundary Verified & Ready to Register')}:
                  </span>{' '}
                  <div className="text-gray-600 mt-0.5">
                    <strong>{selectedField.areaAcres.toFixed(2)} Acres</strong> ({selectedField.areaHectares.toFixed(2)} Ha / {Math.round(selectedField.areaSqm).toLocaleString()} m²)
                    {selectedField.adminLocation.village && ` · ${selectedField.adminLocation.village}`}
                    {selectedField.adminLocation.district && `, ${selectedField.adminLocation.district}`}
                    {` · ${selectedField.pointCount} points`}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs px-5 py-2.5 rounded-xl whitespace-nowrap shadow-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Save & Register Farm', 'Save & Register Farm')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <InteractiveFieldMap
            onSelectedFieldChange={(field) => {
              setSelectedField(field);
              if (field) {
                setMappedBoundaryGeojson(field.geojson);
                setMapNoticeMessage(null);
              } else {
                setMappedBoundaryGeojson(null);
              }
            }}
            onOpenRegisterModal={handleOpenAddModal}
            initialGeojson={mappedBoundaryGeojson}
          />
        </div>
      )}

      {/* ── Farm Registration / Edit Modal rendered via React Portal ── */}
      {showForm && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => {
            setShowForm(false);
            triggerRef.current?.focus();
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="farm-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[min(92vh,780px)] overflow-hidden animate-slide-up"
          >
            {/* 1. Fixed Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="farm-modal-title" className="font-bold text-gray-900 text-base leading-tight">
                    {editFarm ? t('Edit Farm Details', 'Edit Farm Details') : t('Save & Register Farm', 'Save & Register Farm')}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {editFarm
                      ? t('Update your farm name or land record reference', 'Update your farm name or land record reference')
                      : t('Your field boundary is ready. Confirm your farm details.', 'Your field boundary is ready. Confirm your farm details.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  triggerRef.current?.focus();
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label={t('Close Dialog', 'Close Dialog')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Scrollable Form Body */}
            <form
              id="farm-registration-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            >
              {/* Mandatory Manual Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-semibold text-gray-700">
                    {t('Farmer / Owner Name', 'Farmer / Owner Name')} *
                  </label>
                  <input
                    {...register('owner_name')}
                    placeholder="e.g. Ramesh Patil"
                    className={`input text-sm ${errors.owner_name ? 'input-error' : ''}`}
                    autoFocus
                  />
                  {errors.owner_name && <p className="form-error text-xs text-red-600 mt-1">{errors.owner_name.message}</p>}
                </div>

                <div>
                  <label className="label text-xs font-semibold text-gray-700">
                    {t('Farm Name / Land Name', 'Farm Name / Land Name')} *
                  </label>
                  <input
                    {...register('name')}
                    placeholder="e.g. Balaji Farm / Survey 42 Parcel"
                    className={`input text-sm ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && <p className="form-error text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>
              </div>

              {/* Optional Manual Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-semibold text-gray-700">
                    {t('7/12 Land Record Ref (Gat / Survey No)', '7/12 Land Record Ref (Gat / Survey No)')}
                  </label>
                  <input
                    {...register('land_record_ref')}
                    placeholder="e.g. Gat 142/2 (Optional)"
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-semibold text-gray-700">
                    {t('Field Notes', 'Field Notes')}
                  </label>
                  <input
                    {...register('notes')}
                    placeholder="e.g. Near village canal, black cotton soil"
                    className="input text-sm"
                  />
                </div>
              </div>

              {/* Automatically Derived Information: Read-Only Compact Cards */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                  {t('Automatically Derived Field Information (Read-Only)', 'Automatically Derived Field Information (Read-Only)')}
                </span>

                {/* 1. Administrative Location Card */}
                <div className="p-3.5 bg-stone-50 border border-gray-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-gray-700 pb-1 border-b border-gray-200/60">
                    <span className="flex items-center gap-1.5 text-[#166534]">
                      <MapPin className="w-3.5 h-3.5" />
                      {t('Administrative Location', 'Administrative Location')}
                    </span>
                    {selectedField?.isResolvingAdmin && (
                      <span className="text-[10px] text-amber-700 font-normal">
                        {t('Identifying your field location...', 'Identifying your field location...')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-400 block">{t('State', 'State')}</span>
                      <strong className="text-gray-800">{selectedField?.adminLocation?.state || editFarm?.state || 'Maharashtra'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{t('District', 'District')}</span>
                      <strong className="text-gray-800">{selectedField?.adminLocation?.district || editFarm?.district || t('Not available', 'Not available')}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{t('Taluka / Tehsil', 'Taluka / Tehsil')}</span>
                      <strong className="text-gray-800">{selectedField?.adminLocation?.taluka || editFarm?.taluka || t('Not available', 'Not available')}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{t('Village / Locality', 'Village / Locality')}</span>
                      <strong className="text-gray-800">{selectedField?.adminLocation?.village || editFarm?.village || t('Not available', 'Not available')}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{t('PIN Code', 'PIN Code')}</span>
                      <strong className="text-gray-800 font-mono">{selectedField?.adminLocation?.postcode || t('Not available', 'Not available')}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">{t('Center Coordinates', 'Center Coordinates')}</span>
                      <strong className="text-gray-800 font-mono text-[10px]">
                        {selectedField?.centroid
                          ? `${selectedField.centroid[0].toFixed(4)}°N, ${selectedField.centroid[1].toFixed(4)}°E`
                          : (editFarm?.latitude && editFarm?.longitude ? `${editFarm.latitude.toFixed(4)}°N, ${editFarm.longitude.toFixed(4)}°E` : '—')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2. Geodesic Measurements Card */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-950 pb-1 border-b border-emerald-200/60">
                    <span className="flex items-center gap-1.5 text-[#166534]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t('Field Measurements (Geodesic WGS-84)', 'Field Measurements (Geodesic WGS-84)')}
                    </span>
                    <span className="badge bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                      {selectedField?.isValid ? t('Boundary Verified', 'Boundary Verified') : (editFarm?.boundary_geojson ? t('Saved Boundary', 'Saved Boundary') : t('Unverified', 'Unverified'))}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-500 block">{t('Area in Acres', 'Area in Acres')}</span>
                      <strong className="text-[#166534] text-sm block">
                        {(selectedField?.areaAcres || editFarm?.area_acres || 0).toFixed(2)} ac
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">{t('Area in Hectares', 'Area in Hectares')}</span>
                      <strong className="text-gray-800 text-sm block">
                        {(selectedField?.areaHectares || editFarm?.area_hectares || 0).toFixed(2)} ha
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">{t('Square Metres', 'Square Metres')}</span>
                      <strong className="text-gray-800 block">
                        {Math.round(selectedField?.areaSqm || editFarm?.area_sqm || 0).toLocaleString()} m²
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">{t('Perimeter / Points', 'Perimeter / Points')}</span>
                      <strong className="text-gray-800 block">
                        {selectedField?.perimeterMeters ? `${selectedField.perimeterMeters.toLocaleString()} m (${selectedField.pointCount} pts)` : '—'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* 3. Fixed Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-stone-50/70 rounded-b-3xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  triggerRef.current?.focus();
                }}
                className="btn btn-ghost text-xs px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {t('Cancel', 'Cancel')}
              </button>

              <button
                type="submit"
                form="farm-registration-form"
                disabled={isSubmitting || (!editFarm && (!selectedField || !selectedField.isValid || !selectedField.isFinalized))}
                className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs px-6 py-2.5 rounded-xl shadow-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isSubmitting
                  ? t('Saving your farm...', 'Saving your farm...')
                  : (editFarm ? t('Update Farm Record', 'Update Farm Record') : t('Save Farm Record', 'Save Farm Record'))}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Post-Save Success & Handover Notice rendered via React Portal ── */}
      {savedFarmNotice && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSavedFarmNotice(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-farm-notice-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 text-center max-h-[calc(100dvh-2rem)] overflow-y-auto animate-slide-up"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 id="saved-farm-notice-title" className="text-lg font-bold text-gray-900">
                {t('Farm registered successfully.', 'Farm registered successfully.')}
              </h3>
              <p className="text-xs text-gray-500">
                <strong>{savedFarmNotice.name}</strong> · {savedFarmNotice.area_acres?.toFixed(2) || '0.00'} Acres verified
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const farmToConfigure = savedFarmNotice;
                  setSavedFarmNotice(null);
                  setProfileWizardFarm(farmToConfigure);
                }}
                className="btn btn-primary bg-emerald-700 hover:bg-emerald-800 text-white text-xs w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{t('Complete Farm Profile (Crop, Water, Lab Report)', 'Complete Farm Profile (Crop, Water, Lab Report)')}</span>
              </button>

              <button
                onClick={() => {
                  navigate(`/farms/${savedFarmNotice.id}`);
                }}
                className="btn btn-secondary border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-xs w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-[#166534]" />
                <span>{t('View My Farm', 'View My Farm')}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFarmId(savedFarmNotice.id);
                  navigate(`/agents/soil-analysis?farmId=${savedFarmNotice.id}`);
                }}
                className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{t('Analyze My Soil (Agent 1)', 'Analyze My Soil (Agent 1)')}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFarmId(savedFarmNotice.id);
                  navigate(`/agents/farming-assistant?farmId=${savedFarmNotice.id}`);
                }}
                className="btn btn-secondary border-teal-300 text-teal-900 hover:bg-teal-50 text-xs w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-teal-700" />
                <span>{t('Farming Assistant (Agent 2)', 'Farming Assistant (Agent 2)')}</span>
              </button>

              <button
                onClick={() => setSavedFarmNotice(null)}
                className="btn btn-ghost text-xs w-full text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                {t('Stay on My Farms', 'Stay on My Farms')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Farm Profile Wizard Modal ── */}
      <FarmProfileWizardModal
        farm={profileWizardFarm}
        isOpen={!!profileWizardFarm}
        onClose={() => setProfileWizardFarm(null)}
      />
    </div>
  );
}
