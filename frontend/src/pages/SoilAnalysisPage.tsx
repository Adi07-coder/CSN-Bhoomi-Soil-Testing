import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { farmsApi, soilApi } from '../services/api';

import type { Farm, SoilSample } from '../types';

import {

  FlaskConical, Upload, Plus, AlertCircle,

  Calendar, FileSpreadsheet, Info, Layers, BarChart2

} from 'lucide-react';

import { format } from 'date-fns';



const BENCHMARKS: Record<string, { unit: string; low: number; medium: number; high: number; desc: string }> = {
  pH: { unit: 'pH', low: 6.5, medium: 7.8, high: 8.5, desc: 'Optimal: 6.5 - 7.8 (Neutral-Slightly Alkaline)' },
  EC: { unit: 'dS/m', low: 0.0, medium: 1.0, high: 2.0, desc: 'Normal: < 1.0 dS/m (Non-saline)' },
  OC: { unit: '%', low: 0.50, medium: 0.75, high: 1.2, desc: 'Medium: 0.50 - 0.75% (Ideal > 0.75%)' },
  N: { unit: 'kg/ha', low: 280, medium: 560, high: 700, desc: 'Medium: 280 - 560 kg/ha (Available N)' },
  P: { unit: 'kg/ha', low: 10, medium: 25, high: 40, desc: 'Medium: 10 - 25 kg/ha (Available P2O5)' },
  K: { unit: 'kg/ha', low: 140, medium: 280, high: 450, desc: 'Medium: 140 - 280 kg/ha (Available K2O)' },
  Zn: { unit: 'mg/kg', low: 0.60, medium: 1.20, high: 2.0, desc: 'Adequate: >= 0.60 mg/kg (DTPA Zn)' },
  Fe: { unit: 'mg/kg', low: 4.50, medium: 9.00, high: 15.0, desc: 'Adequate: >= 4.50 mg/kg (DTPA Fe)' },
  Cu: { unit: 'mg/kg', low: 0.20, medium: 1.00, high: 2.0, desc: 'Adequate: >= 0.20 mg/kg (DTPA Cu)' },
  Mn: { unit: 'mg/kg', low: 2.00, medium: 10.00, high: 20.0, desc: 'Adequate: >= 2.00 mg/kg (DTPA Mn)' },
  B: { unit: 'mg/kg', low: 0.50, medium: 1.00, high: 1.5, desc: 'Adequate: >= 0.50 mg/kg (Hot Water B)' },
  S: { unit: 'mg/kg', low: 10.0, medium: 20.0, high: 30.0, desc: 'Adequate: >= 10.0 mg/kg (Available S)' },
};



function getStatusBadge(param: string, value: number) {

  const b = BENCHMARKS[param];

  if (!b) return null;

  if (value < b.low) {

    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">Low</span>;

  } else if (value <= b.medium) {

    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">Optimal</span>;

  } else {

    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">High</span>;

  }

}



export default function SoilAnalysisPage() {

  const queryClient = useQueryClient();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);

  const [importFile, setImportFile] = useState<File | null>(null);

  const [importError, setImportError] = useState<string | null>(null);



  // Form states

  const [sampleDate, setSampleDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [labName, setLabName] = useState('');

  const [sampleLabel, setSampleLabel] = useState('');

  const [depthCm, setDepthCm] = useState('15');

  const [params, setParams] = useState<Record<string, string>>({

    pH: '7.2',

    EC: '0.45',

    OC: '0.62',

    N: '240',

    P: '18',

    K: '310',

    Zn: '0.85',

    Fe: '6.5',

  });



  const { data: farmsData, isLoading: farmsLoading } = useQuery({

    queryKey: ['farms'],

    queryFn: () => farmsApi.list(),

  });

  const farms: Farm[] = farmsData?.data?.items || farmsData?.data || [];



  const activeFarmId = selectedFarmId || (farms.length > 0 ? farms[0].id : '');



  const { data: samplesData, isLoading: samplesLoading } = useQuery({

    queryKey: ['soil-samples', activeFarmId],

    queryFn: () => soilApi.getSamplesForFarm(activeFarmId),

    enabled: !!activeFarmId,

  });

  const samples: SoilSample[] = samplesData?.data?.items || samplesData?.data || [];



  const createMutation = useMutation({

    mutationFn: (payload: object) => soilApi.createSample(payload),

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['soil-samples', activeFarmId] });

      setShowAddModal(false);

    },

  });



  const importMutation = useMutation({

    mutationFn: ({ farmId, file }: { farmId: string; file: File }) => soilApi.importCsv(farmId, file),

    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['soil-samples', activeFarmId] });

      setShowImportModal(false);

      setImportFile(null);

    },

    onError: (err: any) => {

      setImportError(err.response?.data?.detail || 'CSV import failed. Check file format.');

    },

  });



  const handleSaveSample = (e: React.FormEvent) => {

    e.preventDefault();

    if (!activeFarmId) return;



    const measurements = Object.entries(params)

      .filter(([_, val]) => val.trim() !== '')

      .map(([param, val]) => ({

        parameter: param,

        value: parseFloat(val),

        unit: BENCHMARKS[param]?.unit || '',

        source: 'lab_report',

      }));



    createMutation.mutate({

      farm_id: activeFarmId,

      sample_label: sampleLabel || `Sample ${format(new Date(sampleDate), 'MMM yyyy')}`,

      sample_date: sampleDate,

      laboratory_name: labName || 'District Soil Testing Lab',

      depth_cm: depthCm ? parseFloat(depthCm) : 15,

      measurements,

    });

  };



  const handleImportSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!activeFarmId || !importFile) return;

    setImportError(null);

    importMutation.mutate({ farmId: activeFarmId, file: importFile });

  };



  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-display font-bold text-gray-900">Soil Health & Lab Testing</h1>

          <p className="text-sm text-gray-500 mt-1">

            Track chemical, physical, and macronutrient properties verified by soil testing laboratories.

          </p>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button

            onClick={() => setShowImportModal(true)}

            disabled={!activeFarmId}

            className="btn-outline flex items-center gap-2"

          >

            <Upload className="w-4 h-4" />

            Import CSV

          </button>

          <button

            onClick={() => setShowAddModal(true)}

            disabled={!activeFarmId}

            className="btn-primary flex items-center gap-2"

          >

            <Plus className="w-4 h-4" />

            Add Test Record

          </button>

        </div>

      </div>



      {/* Advisory Notice */}

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">

        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />

        <div>

          <span className="font-semibold">Agricultural Advisory Note:</span> Soil nutrient levels directly govern crop yield potential and fertilizer response. Test results imported or logged here are cross-matched against ICAR STCR equations. Test samples should be renewed every 2 to 3 agricultural seasons.

        </div>

      </div>

      {/* Dedicated Agent 1 Launcher Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-brand-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Dedicated AI Agriculture Agent: Soil Analysis</h3>
            <p className="text-xs text-gray-600">Want an instant automated soil estimate for your field polygon before lab results arrive?</p>
          </div>
        </div>
        <a
          href={`/agents/soil-analysis${activeFarmId ? `?farmId=${activeFarmId}` : ''}`}
          className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs px-4 py-2 rounded-xl whitespace-nowrap self-start sm:self-auto"
        >
          Open Soil Analysis Agent →
        </a>
      </div>



      {/* Farm Selection Bar */}

      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3 w-full sm:w-auto">

          <label htmlFor="farm-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">

            Active Farm:

          </label>

          <select

            id="farm-select"

            value={activeFarmId}

            onChange={(e) => setSelectedFarmId(e.target.value)}

            className="input max-w-xs"

            disabled={farmsLoading || farms.length === 0}

          >

            {farms.length === 0 && <option value="">No farms found. Create a farm first.</option>}

            {farms.map((f) => (

              <option key={f.id} value={f.id}>

                {f.name} ({f.village || f.district || 'Maharashtra'})

              </option>

            ))}

          </select>

        </div>

        <div className="text-xs text-gray-500 font-medium">

          Showing records for {farms.find((f) => f.id === activeFarmId)?.name || 'Selected Farm'}

        </div>

      </div>



      {/* Benchmark Reference Grid */}

      <div className="card p-5">

        <h2 className="text-base font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">

          <BarChart2 className="w-4 h-4 text-brand-600" />

          Standard Soil Fertility Benchmarks (ICAR / Maharashtra Standards)

        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">

          {Object.entries(BENCHMARKS).map(([key, val]) => (

            <div key={key} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-center">

              <div className="text-xs font-bold text-gray-800">{key}</div>

              <div className="text-[11px] text-gray-500">{val.unit}</div>

              <div className="text-[10px] text-brand-700 font-medium mt-1">{val.desc}</div>

            </div>

          ))}

        </div>

      </div>



      {/* Samples List */}

      <div className="space-y-4">

        <h2 className="text-lg font-display font-semibold text-gray-900 flex items-center gap-2">

          <Layers className="w-5 h-5 text-brand-600" />

          Soil Samples & Nutrient Profiles

        </h2>



        {samplesLoading ? (

          <div className="card p-12 text-center text-gray-500">Loading soil measurements…</div>

        ) : samples.length === 0 ? (

          <div className="card p-12 text-center">

            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <h3 className="text-base font-medium text-gray-900">No soil samples logged yet</h3>

            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-4">

              Add your soil testing laboratory certificate parameters or import a CSV to unlock tailored fertilizer dosage calculations.

            </p>

            <button

              onClick={() => setShowAddModal(true)}

              className="btn-primary inline-flex items-center gap-2"

            >

              <Plus className="w-4 h-4" />

              Add First Soil Sample

            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {samples.map((sample) => (

              <div key={sample.id} className="card p-5 border-l-4 border-l-brand-600">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">

                      <FlaskConical className="w-5 h-5 text-brand-700" />

                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-900">

                        {sample.sample_label || 'Soil Sample'}

                      </h3>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">

                        <Calendar className="w-3.5 h-3.5" />

                        <span>Date: {sample.sample_date ? format(new Date(sample.sample_date), 'dd MMM yyyy') : 'N/A'}</span>

                        <span></span>

                        <span>Lab: {sample.laboratory_name || 'Standard Lab'}</span>

                        {sample.depth_cm && (

                          <>

                            <span></span>

                            <span>Depth: {sample.depth_cm} cm</span>

                          </>

                        )}

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    {sample.is_demo && (

                      <span className="badge badge-amber text-xs">Demo Dataset</span>

                    )}

                    <span className="badge badge-green text-xs">

                      {sample.verification_status || 'Verified'}

                    </span>

                  </div>

                </div>



                {/* Measurements Grid */}

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">

                  {sample.measurements && sample.measurements.length > 0 ? (

                    sample.measurements.map((m) => (

                      <div key={m.id || m.parameter} className="p-3 rounded-lg bg-gray-50/70 border border-gray-100">

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">

                          <span className="font-medium text-gray-700">{m.parameter}</span>

                          <span className="text-[10px] text-gray-400">{m.unit}</span>

                        </div>

                        <div className="text-base font-bold text-gray-900 mb-1">

                          {m.value}

                        </div>

                        <div>

                          {getStatusBadge(m.parameter, m.value)}

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="col-span-full text-xs text-gray-400 italic">

                      No individual parameter readings stored for this sample.

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>



      {/* Add Sample Modal */}

      {showAddModal && (

        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">

            <h3 className="text-xl font-display font-bold text-gray-900 mb-1">Record Soil Test Results</h3>

            <p className="text-xs text-gray-500 mb-4">

              Enter parameter values from your official Soil Health Card or lab analysis report.

            </p>



            <form onSubmit={handleSaveSample} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>

                  <label className="text-xs font-semibold text-gray-700">Sample Label</label>

                  <input

                    type="text"

                    value={sampleLabel}

                    onChange={(e) => setSampleLabel(e.target.value)}

                    placeholder="e.g. North Plot Topsoil"

                    className="input text-sm mt-1"

                  />

                </div>

                <div>

                  <label className="text-xs font-semibold text-gray-700">Test Date</label>

                  <input

                    type="date"

                    value={sampleDate}

                    onChange={(e) => setSampleDate(e.target.value)}

                    className="input text-sm mt-1"

                    required

                  />

                </div>

              </div>



              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>

                  <label className="text-xs font-semibold text-gray-700">Laboratory Name</label>

                  <input

                    type="text"

                    value={labName}

                    onChange={(e) => setLabName(e.target.value)}

                    placeholder="e.g. Pune Agricultural Dept Lab"

                    className="input text-sm mt-1"

                  />

                </div>

                <div>

                  <label className="text-xs font-semibold text-gray-700">Sample Depth (cm)</label>

                  <input

                    type="number"

                    value={depthCm}

                    onChange={(e) => setDepthCm(e.target.value)}

                    className="input text-sm mt-1"

                  />

                </div>

              </div>



              <div className="border-t border-gray-100 pt-3">

                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">

                  Chemical & Macronutrient Parameters

                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  {Object.entries(BENCHMARKS).map(([param, meta]) => (

                    <div key={param}>

                      <label className="text-xs font-medium text-gray-700">

                        {param} <span className="text-[10px] text-gray-400">({meta.unit})</span>

                      </label>

                      <input

                        type="number"

                        step="0.01"

                        value={params[param] || ''}

                        onChange={(e) => setParams({ ...params, [param]: e.target.value })}

                        className="input text-sm mt-0.5"

                      />

                    </div>

                  ))}

                </div>

              </div>



              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">

                <button

                  type="button"

                  onClick={() => setShowAddModal(false)}

                  className="btn-outline text-sm"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={createMutation.isPending}

                  className="btn-primary text-sm flex items-center gap-2"

                >

                  {createMutation.isPending ? 'Saving…' : 'Save Soil Sample'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* Import CSV Modal */}

      {showImportModal && (

        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">

            <h3 className="text-lg font-display font-bold text-gray-900 mb-2 flex items-center gap-2">

              <FileSpreadsheet className="w-5 h-5 text-brand-600" />

              Import Soil Data (CSV)

            </h3>

            <p className="text-xs text-gray-500 mb-4">

              Upload a standard Soil Health Card CSV export. Must include headers like <code>parameter, value, unit</code>.

            </p>



            {importError && (

              <div className="p-3 mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">

                <AlertCircle className="w-4 h-4 flex-shrink-0" />

                <span>{importError}</span>

              </div>

            )}



            <form onSubmit={handleImportSubmit} className="space-y-4">

              <input

                type="file"

                accept=".csv"

                onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}

                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"

                required

              />



              <div className="flex justify-end gap-3 pt-3">

                <button

                  type="button"

                  onClick={() => setShowImportModal(false)}

                  className="btn-outline text-xs"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={importMutation.isPending || !importFile}

                  className="btn-primary text-xs"

                >

                  {importMutation.isPending ? 'Uploading…' : 'Upload & Process'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}

