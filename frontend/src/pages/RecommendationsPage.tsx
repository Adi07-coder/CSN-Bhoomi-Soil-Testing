import CropSelectionConfigurationCard from '../components/CropSelectionConfigurationCard';
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { farmsApi, recommendationsApi } from '../services/api';
import type { Farm, CropRecommendation, FertilizerRecommendation } from '../types';
import {
  Lightbulb, Sprout, Layers, Scale, AlertTriangle, CheckCircle2,
  Calendar, ShieldCheck, ArrowRight, HelpCircle, Package, Droplets, Info
} from 'lucide-react';

const CROPS = [
  { id: 'sugarcane', name: 'Sugarcane (ऊस)', season: 'Annual', defaultTarget: 100 },
  { id: 'cotton', name: 'Cotton (कापूस)', season: 'Kharif', defaultTarget: 25 },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', season: 'Kharif', defaultTarget: 25 },
  { id: 'wheat', name: 'Wheat (गहू)', season: 'Rabi', defaultTarget: 40 },
  { id: 'rice', name: 'Paddy / Rice (भात)', season: 'Kharif', defaultTarget: 45 },
  { id: 'onion', name: 'Onion (कांदा)', season: 'Rabi', defaultTarget: 250 },
  { id: 'chickpea', name: 'Chickpea / Gram (हरभरा)', season: 'Rabi', defaultTarget: 20 },
  { id: 'maize', name: 'Maize (मका)', season: 'Kharif', defaultTarget: 60 },
  { id: 'tomato', name: 'Tomato (टोमॅटो)', season: 'Rabi', defaultTarget: 400 },
];

export default function RecommendationsPage() {
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('sugarcane');
  const [targetYield, setTargetYield] = useState<string>('100');
  const [selectedSeason, setSelectedSeason] = useState<string>('Kharif');

  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.list(),
  });
  const farms: Farm[] = farmsData?.data?.items || farmsData?.data || [];
  const activeFarmId = selectedFarmId || (farms.length > 0 ? farms[0].id : '');
  const activeFarm = farms.find((f) => f.id === activeFarmId);

  // Recommendations query
  const { data: fertData, isLoading: fertLoading, refetch: refetchFert } = useQuery({
    queryKey: ['fertilizer-recommendation', activeFarmId, selectedCrop, selectedSeason, targetYield],
    queryFn: () =>
      recommendationsApi.getFertilizerRecommendations(activeFarmId, {
        crop: selectedCrop,
        season: selectedSeason,
        target_yield_t_ha: parseFloat(targetYield) || undefined,
      }),
    enabled: !!activeFarmId,
  });

  const { data: cropData, isLoading: cropLoading } = useQuery({
    queryKey: ['crop-recommendation', activeFarmId],
    queryFn: () => recommendationsApi.getCropRecommendations(activeFarmId),
    enabled: !!activeFarmId,
  });

  const fertRec: FertilizerRecommendation | null = fertData?.data || null;
  const cropList: CropRecommendation[] = cropData?.data?.crops || [];

  // Calculate commercial fertilizer bags (approx 50kg bags)
  const nReq = fertRec?.recommended_per_ha?.N_kg || 120;
  const pReq = fertRec?.recommended_per_ha?.P2O5_kg || 60;
  const kReq = fertRec?.recommended_per_ha?.K2O_kg || 60;
  const farmAcres = activeFarm?.area_acres || (activeFarm?.area_sqm ? Number((activeFarm.area_sqm / 4046.8564224).toFixed(2)) : 0);
  const farmHa = (activeFarm?.area_hectares || (farmAcres * 0.404686)) || 0;

  // Commercial products calculation:
  // DAP (18% N, 46% P2O5)
  const dapKgPerHa = (pReq / 0.46);
  const nFromDap = dapKgPerHa * 0.18;
  // Remainder N from Urea (46% N)
  const remainingN = Math.max(0, nReq - nFromDap);
  const ureaKgPerHa = (remainingN / 0.46);
  // MOP (60% K2O)
  const mopKgPerHa = (kReq / 0.60);

  const totalDapBags = Math.ceil((dapKgPerHa * farmHa) / 50);
  const totalUreaBags = Math.ceil((ureaKgPerHa * farmHa) / 50);
  const totalMopBags = Math.ceil((mopKgPerHa * farmHa) / 50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Crop Planning & Fertilizer Guidance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Practical fertilizer schedules and crop suitability matching calibrated for your fields.
          </p>
        </div>
      </div>

      {/* Advisory Alert */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Agronomic Safety Notice:</span> Recommendations are calculated using standard university fertilizer equations adjusted for soil test nutrient availability. Always combine with organic manures (FYM/compost) and consult your local Taluka Agricultural Officer or Krishi Vigyan Kendra (KVK).
        </div>
      </div>

      {/* Dedicated Farming Assistant Launcher Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">AI Agriculture Agent: Farming Assistant</h3>
            <p className="text-xs text-gray-600">Want interactive season & water guidance, crop rotation checks, and standard 50kg bag calculations?</p>
          </div>
        </div>
        <a
          href={`/agents/farming-assistant${activeFarmId ? `?farmId=${activeFarmId}` : ''}`}
          className="btn btn-primary bg-teal-700 hover:bg-teal-800 text-xs px-4 py-2 rounded-xl whitespace-nowrap self-start sm:self-auto"
        >
          Open Farming Assistant →
        </a>
      </div>

      {/* NEW FEATURE CARD: Crop Selection & Agricultural Configuration */}
      <CropSelectionConfigurationCard
        initialFarmId={activeFarmId}
        farmName={activeFarm?.name || undefined}
        district={activeFarm?.district || undefined}
        areaAcres={farmAcres}
        soilType={(activeFarm as any)?.soil_type}
        onSelectCrop={(crop, season) => {
          const matched = CROPS.find(c => c.name.toLowerCase().includes(crop.toLowerCase()) || crop.toLowerCase().includes(c.id));
          if (matched) setSelectedCrop(matched.id);
          setSelectedSeason(season);
        }}
      />

      {/* Selection Control Panel */}
      <div className="card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="rec-farm-select" className="text-xs font-semibold text-gray-700 block mb-1">
            Selected Farm
          </label>
          <select
            id="rec-farm-select"
            value={activeFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="input text-sm"
            disabled={farmsLoading || farms.length === 0}
          >
            {farms.length === 0 && <option value="">No farms available</option>}
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.area_acres ? `${f.area_acres.toFixed(1)} ac` : 'Farm'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="crop-select" className="text-xs font-semibold text-gray-700 block mb-1">
            Target Crop
          </label>
          <select
            id="crop-select"
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              const found = CROPS.find((c) => c.id === e.target.value);
              if (found) setTargetYield(found.defaultTarget.toString());
            }}
            className="input text-sm"
          >
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="season-select" className="text-xs font-semibold text-gray-700 block mb-1">
            Season
          </label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="input text-sm"
          >
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Summer">Summer (Zaid)</option>
            <option value="Annual">Annual / Adsali</option>
          </select>
        </div>

        <div>
          <label htmlFor="yield-input" className="text-xs font-semibold text-gray-700 block mb-1">
            Target Yield (q/ha or t/ha)
          </label>
          <input
            id="yield-input"
            type="number"
            value={targetYield}
            onChange={(e) => setTargetYield(e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>

      {/* Main Fertilizer Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fertilizer Requirements & Bag Converter */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border-l-4 border-l-brand-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-display font-bold text-gray-900">
                  Fertilizer Dosing Schedule ({CROPS.find((c) => c.id === selectedCrop)?.name})
                </h2>
                <p className="text-xs text-gray-500">
                  Calculated for {farmHa.toFixed(2)} ha ({farmAcres.toFixed(1)} acres) based on farm soil test records.
                </p>
              </div>
              <span className="badge badge-green text-xs">STCR Balanced Formula</span>
            </div>

            {/* N-P-K summary pills */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                <div className="text-xs font-semibold text-blue-700">Nitrogen (N)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(nReq)} <span className="text-xs text-gray-500">kg/ha</span></div>
                <div className="text-[11px] text-gray-500 mt-0.5">Total: {Math.round(nReq * farmHa)} kg</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                <div className="text-xs font-semibold text-amber-700">Phosphorus (P₂O₅)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(pReq)} <span className="text-xs text-gray-500">kg/ha</span></div>
                <div className="text-[11px] text-gray-500 mt-0.5">Total: {Math.round(pReq * farmHa)} kg</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
                <div className="text-xs font-semibold text-purple-700">Potassium (K₂O)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{Math.round(kReq)} <span className="text-xs text-gray-500">kg/ha</span></div>
                <div className="text-[11px] text-gray-500 mt-0.5">Total: {Math.round(kReq * farmHa)} kg</div>
              </div>
            </div>

            {/* Commercial Bags Equivalency */}
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-600" />
              Standard Commercial Bags Required (50 kg bags)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-xs text-gray-500">Urea (46% N)</div>
                <div className="text-xl font-bold text-gray-900 mt-1">{totalUreaBags} Bags</div>
                <div className="text-[11px] text-gray-400 mt-0.5">~{Math.round(ureaKgPerHa * farmHa)} kg total</div>
              </div>

              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-xs text-gray-500">DAP (18-46-0)</div>
                <div className="text-xl font-bold text-gray-900 mt-1">{totalDapBags} Bags</div>
                <div className="text-[11px] text-gray-400 mt-0.5">~{Math.round(dapKgPerHa * farmHa)} kg total</div>
              </div>

              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200">
                <div className="text-xs text-gray-500">MOP (60% K₂O)</div>
                <div className="text-xl font-bold text-gray-900 mt-1">{totalMopBags} Bags</div>
                <div className="text-[11px] text-gray-400 mt-0.5">~{Math.round(mopKgPerHa * farmHa)} kg total</div>
              </div>
            </div>

            {/* Split Application Timing Table */}
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Split Application Timing
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 uppercase font-semibold">
                    <th className="pb-2">Application Stage</th>
                    <th className="pb-2">Timing</th>
                    <th className="pb-2">Nitrogen (N)</th>
                    <th className="pb-2">Phosphate (P)</th>
                    <th className="pb-2">Potash (K)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-900">Basal Dose</td>
                    <td className="py-2.5">At planting / sowing</td>
                    <td className="py-2.5">25% (1/4th)</td>
                    <td className="py-2.5 font-bold text-brand-700">100% (Full dose)</td>
                    <td className="py-2.5">50% (Half)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-900">1st Top Dressing</td>
                    <td className="py-2.5">Active tillering (30-45 DAS)</td>
                    <td className="py-2.5">50% (Half)</td>
                    <td className="py-2.5 text-gray-400">—</td>
                    <td className="py-2.5 text-gray-400">—</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-gray-900">2nd Top Dressing</td>
                    <td className="py-2.5">Panicle / flowering stage</td>
                    <td className="py-2.5">25% (1/4th)</td>
                    <td className="py-2.5 text-gray-400">—</td>
                    <td className="py-2.5">50% (Half)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Organic & Micronutrient Guidelines */}
          <div className="card p-5 bg-emerald-50/50 border border-emerald-100">
            <h3 className="text-sm font-semibold text-emerald-900 mb-2 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Organic Amendment & Micronutrient Supplementation
            </h3>
            <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
              <li>Incorporate well-decomposed Farm Yard Manure (FYM) or compost @ 10-12 tonnes/ha before sowing to elevate organic carbon.</li>
              <li>Apply Zinc Sulphate (ZnSO₄) @ 20-25 kg/ha if DTPA-extractable Zinc is below 0.6 mg/kg. Do not mix directly with DAP.</li>
              <li>For black soils with calcareous tendencies, foliar spray of 0.5% FeSO₄ + 0.1% citric acid helps counter iron chlorosis.</li>
            </ul>
          </div>
        </div>

        {/* Right: Crop Suitability & Alternatives */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-display font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Crop Suitability Ranking
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Ranked suitability based on soil pH, texture, climate and historical district data.
            </p>

            <div className="space-y-3">
              {cropList.length > 0 ? (
                cropList.slice(0, 5).map((c, i) => (
                  <div key={c.crop} className="p-3 rounded-lg border border-gray-100 hover:border-brand-300 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-gray-900 capitalize">{c.crop}</span>
                      <span className="text-xs font-bold text-brand-700">
                        {Math.round(c.suitability_score * 100)}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{c.notes}</p>
                    {c.warnings && c.warnings.length > 0 && (
                      <div className="mt-1 text-[10px] text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{c.warnings[0]}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg border border-brand-200 bg-brand-50/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-900">Sugarcane (Co 86032)</span>
                      <span className="font-bold text-brand-700">92% Match</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Optimal black soil depth and irrigation</div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-900">Soybean (JS 335)</span>
                      <span className="font-bold text-brand-700">86% Match</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">High nitrogen fixation potential</div>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-900">Gram / Chickpea (Digvijay)</span>
                      <span className="font-bold text-brand-700">81% Match</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Ideal for Rabi residual moisture</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-4 bg-gray-50 border border-gray-200 text-xs text-gray-600">
            <h4 className="font-bold text-gray-800 mb-1">Calculation Methodology</h4>
            <p className="text-[11px] leading-relaxed">
              Based on Maharashtra State Agricultural University (MPKV Rahuri / PDKV Akola) targeted yield equations:
            </p>
            <code className="block mt-2 p-2 bg-white rounded border border-gray-200 text-[10px] text-gray-700 font-mono">
              FN = a × T - b × SN<br />
              FP₂O₅ = c × T - d × SP<br />
              FK₂O = e × T - f × SK
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
