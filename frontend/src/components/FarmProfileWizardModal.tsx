import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { farmsApi, soilApi } from '../services/api';
import type { Farm, FarmProfile } from '../types';
import {
  Sprout,
  Droplets,
  RotateCcw,
  Target,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface FarmProfileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  onSuccess?: () => void;
}

const SUPPORTED_CROPS = [
  { value: 'Sugarcane', label: 'Sugarcane (ऊस)', desc: '12–18 mo. perennial cash crop' },
  { value: 'Wheat', label: 'Wheat (गहू)', desc: 'Rabi cereal grain' },
  { value: 'Soybean', label: 'Soybean (सोयाबीन)', desc: 'Kharif oilseed & legume' },
  { value: 'Cotton', label: 'Cotton (कापूस)', desc: 'Kharif fiber cash crop' },
  { value: 'Onion', label: 'Onion (कांदा)', desc: 'High-value bulb crop' },
  { value: 'Gram', label: 'Gram / Chickpea (हरभरा)', desc: 'Rabi pulse & nitrogen fixer' },
  { value: 'Paddy', label: 'Paddy / Rice (भात)', desc: 'Water-intensive Kharif cereal' },
  { value: 'Maize', label: 'Maize (मका)', desc: 'Fast-growing cereal & fodder' },
  { value: 'Pomegranate', label: 'Pomegranate (डाळिंब)', desc: 'Horticultural orchard crop' },
  { value: 'Banana', label: 'Banana (केळी)', desc: 'High-nutrient perennial fruit' },
  { value: 'Turmeric', label: 'Turmeric (हळद)', desc: 'High-value rhizome spice' },
];

const SEASONS = [
  { value: 'Kharif', label: 'Kharif (Monsoon)', desc: 'June – October' },
  { value: 'Rabi', label: 'Rabi (Winter)', desc: 'October – March' },
  { value: 'Summer', label: 'Summer / Zaid', desc: 'March – June' },
];

const FARMING_OBJECTIVES = [
  { value: 'Reduce cultivation costs', label: 'Reduce cultivation costs', desc: 'Cut down on unnecessary fertilizer inputs and optimize spray costs' },
  { value: 'Improve soil health', label: 'Improve soil health', desc: 'Rebuild organic carbon, correct acidity/salinity, and foster micro-flora' },
  { value: 'Use water more efficiently', label: 'Use water more efficiently', desc: 'Maximize crop-per-drop with precision irrigation guidance' },
  { value: 'Find suitable crops', label: 'Find suitable crops', desc: 'Discover the most viable crops calibrated to this specific soil parcel' },
  { value: 'Balance yield potential and input costs', label: 'Balance yield potential & input costs', desc: 'Achieve sustainable maximum profitability' },
  { value: 'Improve expected market return', label: 'Improve expected market return', desc: 'Align crop timing with peak APMC Mandi price windows' },
];

export default function FarmProfileWizardModal({
  isOpen,
  onClose,
  farm,
  onSuccess,
}: FarmProfileWizardModalProps) {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  // Step A: Crop and Season
  const [targetCrop, setTargetCrop] = useState<string>('Sugarcane');
  const [season, setSeason] = useState<string>('Kharif');
  const [sowingDate, setSowingDate] = useState<string>('');
  const [cropDurationDays, setCropDurationDays] = useState<number>(120);

  // Step B: Water and Irrigation
  const [farmingType, setFarmingType] = useState<string>('Irrigated');
  const [irrigationMethod, setIrrigationMethod] = useState<string>('Drip Irrigation');
  const [waterAvailability, setWaterAvailability] = useState<string>('High');
  const [waterSource, setWaterSource] = useState<string>('Borewell');

  // Step C: Previous Farming Practices
  const [previousCrop, setPreviousCrop] = useState<string>('Soybean');
  const [cropRotationHistory, setCropRotationHistory] = useState<string>('Legume followed by cereal');
  const [fertilizersApplied, setFertilizersApplied] = useState<string>('Urea & DAP (approx. 1 bag/acre)');
  const [organicManureApplied, setOrganicManureApplied] = useState<string>('Farm Yard Manure (FYM)');
  const [manureQuantityTonsAcre, setManureQuantityTonsAcre] = useState<number>(2.5);
  const [soilAmendments, setSoilAmendments] = useState<string>('None');

  // Step D: Farming Objective
  const [farmingObjective, setFarmingObjective] = useState<string>('Balance yield potential and input costs');

  // Step E: Existing Soil Laboratory Report
  const [hasLabReport, setHasLabReport] = useState<boolean>(false);
  const [labName, setLabName] = useState<string>('');
  const [sampleDate, setSampleDate] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>('');
  const [sampleRef, setSampleRef] = useState<string>('');

  // Lab numerical values (optional manual entry)
  const [labPh, setLabPh] = useState<string>('');
  const [labEc, setLabEc] = useState<string>('');
  const [labOc, setLabOc] = useState<string>('');
  const [labN, setLabN] = useState<string>('');
  const [labP, setLabP] = useState<string>('');
  const [labK, setLabK] = useState<string>('');
  const [labS, setLabS] = useState<string>('');
  const [labZn, setLabZn] = useState<string>('');
  const [labFe, setLabFe] = useState<string>('');

  // Load existing profile on open
  useEffect(() => {
    if (isOpen && farm?.id) {
      setCurrentStep(1);
      setSaveSuccess(false);
      setErrorMessage(null);
      farmsApi
        .getProfile(farm.id)
        .then((res) => {
          const p: FarmProfile = res.data;
          if (p) {
            if (p.target_crop) setTargetCrop(p.target_crop);
            if (p.season) setSeason(p.season);
            if (p.sowing_date) setSowingDate(p.sowing_date);
            if (p.crop_duration_days) setCropDurationDays(p.crop_duration_days);
            if (p.farming_type) setFarmingType(p.farming_type);
            if (p.irrigation_method) setIrrigationMethod(p.irrigation_method);
            if (p.water_availability) setWaterAvailability(p.water_availability);
            if (p.water_source) setWaterSource(p.water_source);
            if (p.previous_crop) setPreviousCrop(p.previous_crop);
            if (p.crop_rotation_history) setCropRotationHistory(p.crop_rotation_history);
            if (p.fertilizers_applied) setFertilizersApplied(p.fertilizers_applied);
            if (p.organic_manure_applied) setOrganicManureApplied(p.organic_manure_applied);
            if (p.manure_quantity_tons_acre !== undefined && p.manure_quantity_tons_acre !== null) {
              setManureQuantityTonsAcre(p.manure_quantity_tons_acre);
            }
            if (p.soil_amendments) setSoilAmendments(p.soil_amendments);
            if (p.farming_objective) setFarmingObjective(p.farming_objective);
            if (p.has_lab_report) setHasLabReport(p.has_lab_report);
            if (p.lab_name) setLabName(p.lab_name);
            if (p.sample_date) setSampleDate(p.sample_date);
            if (p.report_date) setReportDate(p.report_date);
            if (p.sample_ref) setSampleRef(p.sample_ref);
          }
        })
        .catch(() => {
          // Defaults are already set
        });
    }
  }, [isOpen, farm?.id]);

  if (!isOpen || !farm) return null;

  const handleSaveAndFinish = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Save Farm Agricultural Profile
      await farmsApi.updateProfile(farm.id, {
        target_crop: targetCrop,
        season,
        sowing_date: sowingDate || null,
        crop_duration_days: cropDurationDays ? Number(cropDurationDays) : null,
        farming_type: farmingType,
        irrigation_method: irrigationMethod,
        water_availability: waterAvailability,
        water_source: waterSource,
        previous_crop: previousCrop || 'Not recorded',
        crop_rotation_history: cropRotationHistory || 'Not recorded',
        fertilizers_applied: fertilizersApplied || 'Not recorded',
        organic_manure_applied: organicManureApplied || 'Not recorded',
        manure_quantity_tons_acre: manureQuantityTonsAcre ? Number(manureQuantityTonsAcre) : null,
        soil_amendments: soilAmendments || 'None',
        farming_objective: farmingObjective,
        has_lab_report: hasLabReport,
        lab_name: hasLabReport ? labName || null : null,
        sample_date: hasLabReport ? sampleDate || null : null,
        report_date: hasLabReport ? reportDate || null : null,
        sample_ref: hasLabReport ? sampleRef || null : null,
      });

      // 2. If lab values entered, also save as SoilSample with SoilMeasurement rows
      if (hasLabReport && (labPh || labN || labP || labK || labOc || labEc || labZn)) {
        const measurements: Array<{ parameter: string; value: number; unit: string; method?: string }> = [];
        if (labPh) measurements.push({ parameter: 'pH', value: parseFloat(labPh), unit: 'pH', method: 'Potentiometric' });
        if (labEc) measurements.push({ parameter: 'EC', value: parseFloat(labEc), unit: 'dS/m', method: 'Conductivity meter' });
        if (labOc) measurements.push({ parameter: 'OC', value: parseFloat(labOc), unit: '%', method: 'Walkley-Black' });
        if (labN) measurements.push({ parameter: 'N', value: parseFloat(labN), unit: 'kg/ha', method: 'Alkaline permanganate' });
        if (labP) measurements.push({ parameter: 'P', value: parseFloat(labP), unit: 'kg/ha', method: 'Olsen colorimetric' });
        if (labK) measurements.push({ parameter: 'K', value: parseFloat(labK), unit: 'kg/ha', method: 'Flame photometry' });
        if (labS) measurements.push({ parameter: 'S', value: parseFloat(labS), unit: 'mg/kg', method: 'Turbidimetric' });
        if (labZn) measurements.push({ parameter: 'Zn', value: parseFloat(labZn), unit: 'mg/kg', method: 'DTPA extraction' });
        if (labFe) measurements.push({ parameter: 'Fe', value: parseFloat(labFe), unit: 'mg/kg', method: 'DTPA extraction' });

        if (measurements.length > 0) {
          await soilApi.createSample({
            farm_id: farm.id,
            sample_label: sampleRef ? `Lab Sample #${sampleRef}` : `Laboratory Soil Test (${sampleDate || 'Recent'})`,
            sample_date: sampleDate || new Date().toISOString().split('T')[0],
            laboratory_name: labName || 'Certified Soil Testing Laboratory',
            laboratory_ref: sampleRef || null,
            source: 'laboratory',
            depth_cm: 15.0,
            notes: `Entered via Farm Profile setup. Verified laboratory ground truth.`,
            measurements,
          });
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.detail || 'Failed to save farm profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Crop & Season', icon: Sprout },
    { num: 2, title: 'Water & Irrigation', icon: Droplets },
    { num: 3, title: 'Previous Practices', icon: RotateCcw },
    { num: 4, title: 'Farming Objective', icon: Target },
    { num: 5, title: 'Soil Lab Report', icon: FileCheck2 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {t('Optional Agricultural Setup', 'Optional Agricultural Setup')}
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold mt-1 text-white">
            {t('Complete Your Farm Profile', 'Complete Your Farm Profile')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {farm.name} — {farm.village ? `${farm.village}, ` : ''}{farm.district || 'Maharashtra'} ({farm.area_acres?.toFixed(2)} Acres)
          </p>

          {/* Stepper bar */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isPast = s.num < currentStep;
              const isCurr = s.num === currentStep;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setCurrentStep(s.num)}
                  className="flex flex-col items-center gap-1.5 text-center flex-1 cursor-pointer transition-opacity"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                      isCurr
                        ? 'bg-white text-emerald-800 ring-4 ring-white/30 scale-110'
                        : isPast
                        ? 'bg-emerald-300 text-emerald-950'
                        : 'bg-white/20 text-white/70'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:block ${
                      isCurr ? 'font-bold text-white' : 'text-white/70'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Farm profile saved successfully!</p>
                <p className="text-xs text-emerald-700">Your agricultural setup is updated for soil and planting advice.</p>
              </div>
            </div>
          )}

          {/* STEP 1: Crop & Season */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Target Crop for this Parcel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUPPORTED_CROPS.map((c) => (
                    <div
                      key={c.value}
                      onClick={() => setTargetCrop(c.value)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        targetCrop === c.value
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500'
                          : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-xs text-gray-900">{c.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Intended Growing Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  >
                    {SEASONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label} ({s.desc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Expected Sowing / Planting Date
                  </label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Leave blank if sowing date is undecided</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Water & Irrigation */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Farming Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Irrigated', 'Rain-fed'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFarmingType(type)}
                        className={`p-2.5 text-xs font-semibold rounded-xl border transition-all ${
                          farmingType === type
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type === 'Irrigated' ? 'Irrigated (बागायती)' : 'Rain-fed (जिरायती)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Water Availability
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Low', 'Moderate', 'High'].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setWaterAvailability(lvl)}
                        className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                          waterAvailability === lvl
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Irrigation Method
                  </label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  >
                    <option value="Drip Irrigation">Drip Irrigation (ठिबक सिंचन)</option>
                    <option value="Sprinkler Irrigation">Sprinkler Irrigation (तुषार सिंचन)</option>
                    <option value="Flood / Furrow Irrigation">Flood / Furrow Irrigation (पाटपाणी)</option>
                    <option value="Rain-fed Only">Rain-fed Only (पावसावर आधारित)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Water Source
                  </label>
                  <select
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  >
                    <option value="Borewell">Borewell (बोअरवेल)</option>
                    <option value="Open Well">Open Well (विहीर)</option>
                    <option value="Canal">Government Canal (कालवा)</option>
                    <option value="River / Stream">River / Stream (नदी / ओढा)</option>
                    <option value="Farm Pond">Farm Pond / Shettale (शेततळे)</option>
                    <option value="Rainwater">Rainwater Harvesting / Natural Rain</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
                <span>Water availability directly fine-tunes ICAR crop water balance and fertilizer split applications.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Previous Farming Practices */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Previous Crop on this Land
                  </label>
                  <input
                    type="text"
                    value={previousCrop}
                    onChange={(e) => setPreviousCrop(e.target.value)}
                    placeholder="e.g. Soybean, Gram, Fallow, Cotton"
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Helps evaluate biological nitrogen carryover</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Fertilizers Recently Applied
                  </label>
                  <input
                    type="text"
                    value={fertilizersApplied}
                    onChange={(e) => setFertilizersApplied(e.target.value)}
                    placeholder="e.g. 1 bag Urea, 1 bag DAP, or 'None'"
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Enter "I don't know" or "None" if unrecorded</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Organic Manure Applied
                  </label>
                  <select
                    value={organicManureApplied}
                    onChange={(e) => setOrganicManureApplied(e.target.value)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  >
                    <option value="Farm Yard Manure (FYM)">Farm Yard Manure / Cow Dung (शेणखत)</option>
                    <option value="Vermicompost">Vermicompost (गांडूळ खत)</option>
                    <option value="Pressmud">Pressmud / Sugarcane Compost (मळी खत)</option>
                    <option value="Green Manure (Dhaincha/Sunhemp)">Green Manure / ताग-धैंचा</option>
                    <option value="None / Not recorded">None / Not recorded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Approx. Manure (Tons / Acre)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={manureQuantityTonsAcre}
                    onChange={(e) => setManureQuantityTonsAcre(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Recent Soil Amendments (Lime, Gypsum, etc.)
                </label>
                <select
                  value={soilAmendments}
                  onChange={(e) => setSoilAmendments(e.target.value)}
                  className="w-full text-xs rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 bg-white border"
                >
                  <option value="None">None applied</option>
                  <option value="Agricultural Gypsum">Agricultural Gypsum (for sodic/alkali soil reclaiming)</option>
                  <option value="Agricultural Lime">Agricultural Lime (for acid soil pH correction)</option>
                  <option value="Biochar / Bio-fertilizer">Biochar / Bio-fertilizers (Rhizobium/PSB)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Farming Objective */}
          {currentStep === 4 && (
            <div className="space-y-3 animate-fade-in">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                What is your primary agricultural goal for this parcel?
              </label>
              <div className="space-y-2">
                {FARMING_OBJECTIVES.map((obj) => (
                  <div
                    key={obj.value}
                    onClick={() => setFarmingObjective(obj.value)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      farmingObjective === obj.value
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={farmingObjective === obj.value}
                      onChange={() => setFarmingObjective(obj.value)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-semibold text-xs text-gray-900">{obj.label}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{obj.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Existing Soil Laboratory Report */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Do you have a physical Soil Testing Laboratory report?
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      If yes, enter your measured laboratory values. If no, you can skip and use our calibrated AI satellite soil model.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasLabReport(!hasLabReport)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      hasLabReport
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {hasLabReport ? 'Yes, I have a lab report' : 'No / Skip this step'}
                  </button>
                </div>
              </div>

              {hasLabReport && (
                <div className="space-y-4 border border-gray-200 p-4 rounded-xl bg-gray-50/50 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Laboratory Name
                      </label>
                      <input
                        type="text"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        placeholder="e.g. MPKV STL, Pune / KVK Baramati"
                        className="w-full text-xs rounded-lg border-gray-300 p-2 bg-white border"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Sample / Test Date
                      </label>
                      <input
                        type="date"
                        value={sampleDate}
                        onChange={(e) => setSampleDate(e.target.value)}
                        className="w-full text-xs rounded-lg border-gray-300 p-2 bg-white border"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Sample Ref / Serial No.
                      </label>
                      <input
                        type="text"
                        value={sampleRef}
                        onChange={(e) => setSampleRef(e.target.value)}
                        placeholder="e.g. MH/2026/STL/482"
                        className="w-full text-xs rounded-lg border-gray-300 p-2 bg-white border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2">
                      Enter Measured Laboratory Analyte Values (Leave blank if unmeasured)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Soil Reaction (pH)</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 7.4"
                          value={labPh}
                          onChange={(e) => setLabPh(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">EC (dS/m)</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 0.45"
                          value={labEc}
                          onChange={(e) => setLabEc(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Organic Carbon (%)</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 0.65"
                          value={labOc}
                          onChange={(e) => setLabOc(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Available N (kg/ha)</span>
                        <input
                          type="number"
                          step="1"
                          placeholder="e.g. 260"
                          value={labN}
                          onChange={(e) => setLabN(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Available P (kg/ha)</span>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 18.5"
                          value={labP}
                          onChange={(e) => setLabP(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Available K (kg/ha)</span>
                        <input
                          type="number"
                          step="1"
                          placeholder="e.g. 320"
                          value={labK}
                          onChange={(e) => setLabK(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">Available S (mg/kg)</span>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 14.5"
                          value={labS}
                          onChange={(e) => setLabS(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">DTPA Zinc (mg/kg)</span>
                        <input
                          type="number"
                          step="0.05"
                          placeholder="e.g. 0.75"
                          value={labZn}
                          onChange={(e) => setLabZn(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-medium">DTPA Iron (mg/kg)</span>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 6.2"
                          value={labFe}
                          onChange={(e) => setLabFe(e.target.value)}
                          className="w-full text-xs rounded-lg border-gray-300 p-1.5 bg-white border mt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="btn btn-secondary btn-sm flex items-center gap-1"
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                className="btn btn-primary btn-sm flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndFinish}
                disabled={isLoading}
                className="btn btn-primary btn-sm flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Farm Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
