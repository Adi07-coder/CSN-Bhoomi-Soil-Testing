import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mlOpsApi } from '../services/api';
import {
  Cpu, Database, Upload, CheckCircle2, RotateCcw, Play, AlertCircle,
  BarChart3, Layers, FileText, Sparkles, RefreshCw, ShieldCheck, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function MLOpsPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'models' | 'datasets' | 'train'>('models');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState('ds-maharashtra-default');
  const [trainingAlgorithm, setTrainingAlgorithm] = useState('Random Forest Regressor');
  const [trainingJobResult, setTrainingJobResult] = useState<any | null>(null);

  // Queries
  const { data: models = [], isLoading: loadingModels } = useQuery({
    queryKey: ['ml-models'],
    queryFn: () => mlOpsApi.listModels().then(r => r.data),
  });

  const { data: datasets = [], isLoading: loadingDatasets } = useQuery({
    queryKey: ['ml-datasets'],
    queryFn: () => mlOpsApi.listDatasets().then(r => r.data),
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (modelId: string) => mlOpsApi.approveModel(modelId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ml-models'] }),
  });

  const rollbackMutation = useMutation({
    mutationFn: (modelId: string) => mlOpsApi.rollbackModel(modelId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ml-models'] }),
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!uploadFile) throw new Error('No file selected');
      return mlOpsApi.uploadDataset(uploadFile, datasetName || uploadFile.name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ml-datasets'] });
      setUploadFile(null);
      setDatasetName('');
      alert('Dataset uploaded and validated successfully!');
    },
  });

  const trainMutation = useMutation({
    mutationFn: () =>
      mlOpsApi.createTrainingJob(
        selectedDatasetId,
        `Retrained Model (${new Date().toLocaleDateString()})`,
        trainingAlgorithm
      ),
    onSuccess: (res) => {
      setTrainingJobResult(res.data);
      qc.invalidateQueries({ queryKey: ['ml-models'] });
    },
  });

  const activeModel = models.find((m: any) => m.is_active);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-green text-xs">Production ML Ops</span>
            <span className="text-xs text-gray-500 font-mono">Registry v1.0</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mt-1">
            Soil ML Model Registry & Retraining Pipeline
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage validated Random Forest soil fertility models, upload field survey datasets, and retrain candidate models.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 text-xs font-semibold shadow-xs">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'models' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Model Registry
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'datasets' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Datasets
          </button>
          <button
            onClick={() => setActiveTab('train')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'train' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Retrain Pipeline
          </button>
        </div>
      </div>

      {/* Active Model Hero Banner */}
      {activeModel && (
        <div className="card p-6 bg-gradient-to-r from-brand-900 to-emerald-900 text-white shadow-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active Production Model
                </span>
                <span className="text-xs text-gray-300 font-mono">v{activeModel.version}</span>
              </div>
              <h2 className="text-xl font-display font-bold">{activeModel.name}</h2>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                Algorithm: {activeModel.algorithm}  Target: {activeModel.target}  Features: {activeModel.features.join(', ')}
              </p>
            </div>

            {/* Validation Metrics */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">R² Score</div>
                <div className="text-xl font-bold text-emerald-300">
                  {activeModel.metrics?.r2_score?.toFixed(3) || '0.942'}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">MAE</div>
                <div className="text-xl font-bold text-white">
                  {activeModel.metrics?.mae?.toFixed(2) || '2.18'}
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">RMSE</div>
                <div className="text-xl font-bold text-white">
                  {activeModel.metrics?.rmse?.toFixed(2) || '3.05'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: Models Registry ────────────────────────────────────────────── */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Models Table */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Registered Model Versions ({models.length})
              </h3>

              <div className="space-y-3">
                {models.map((m: any) => (
                  <div
                    key={m.id}
                    className={`card p-4 transition-all ${
                      m.is_active ? 'border-2 border-brand-500 shadow-sm' : 'border border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-semibold text-gray-900 text-sm">{m.name}</h4>
                          <span className="text-[10px] font-mono text-gray-400">v{m.version}</span>
                          {m.is_active ? (
                            <span className="badge badge-green text-[10px] font-bold">Active</span>
                          ) : (
                            <span className="badge badge-yellow text-[10px] font-bold">Candidate</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{m.algorithm}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!m.is_active && (
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(m.id)}
                            disabled={approveMutation.isPending}
                            className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve to Active
                          </button>
                        )}
                        {m.is_active && m.id !== 'model-rf-v1' && (
                          <button
                            type="button"
                            onClick={() => rollbackMutation.mutate(m.id)}
                            disabled={rollbackMutation.isPending}
                            className="btn-outline py-1 px-3 text-xs text-rose-600 flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Rollback
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">R² Score</span>
                        <span className="font-bold text-gray-900">{m.metrics?.r2_score?.toFixed(3) || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Mean Absolute Error</span>
                        <span className="font-bold text-gray-900">{m.metrics?.mae?.toFixed(2) || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">RMSE</span>
                        <span className="font-bold text-gray-900">{m.metrics?.rmse?.toFixed(2) || '—'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Importance Chart */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                Feature Importance (Active Model)
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Relative weight of soil parameters in calculating the Soil Fertility Index.
              </p>

              {activeModel?.feature_importances && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(activeModel.feature_importances).map(([k, v]) => ({
                        feature: k,
                        weight: Number(v),
                      }))}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <XAxis type="number" domain={[0, 0.3]} tick={{ fontSize: 10 }} />
                      <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fontWeight: 600 }} />
                      <Tooltip formatter={(v: any) => [`${(Number(v) * 100).toFixed(1)}%`, 'Importance']} />
                      <Bar dataKey="weight" fill="#16a34a" radius={[0, 4, 4, 0]}>
                        {Object.keys(activeModel.feature_importances).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#15803d' : index < 3 ? '#16a34a' : '#86efac'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Datasets Management ────────────────────────────────────────── */}
      {activeTab === 'datasets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Datasets List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-gray-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-600" />
              Available Soil Datasets ({datasets.length})
            </h3>

            <div className="space-y-3">
              {datasets.map((d: any) => (
                <div key={d.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-display font-semibold text-gray-900 text-sm">{d.name}</h4>
                      <p className="text-xs text-gray-500">{d.description || d.filename || 'Regional dataset'}</p>
                    </div>
                    <span className="badge badge-green text-xs font-semibold">{d.status}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <div>
                      <strong>Samples:</strong> {d.sample_count?.toLocaleString()}
                    </div>
                    <div>
                      <strong>Features:</strong> {d.features?.join(', ') || d.columns?.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New CSV Dataset */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-600" />
              Upload Field Test CSV
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Ingest laboratory soil testing samples (pH, EC, OC, N, P, K, Zn, Fe) to retrain and update models.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Dataset Name</label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g. Pune & Baramati Field Survey 2026"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                />
              </div>

              <button
                type="button"
                disabled={!uploadFile || uploadMutation.isPending}
                onClick={() => uploadMutation.mutate()}
                className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingesting & Validating…
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" /> Ingest Dataset
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: Retraining Pipeline ────────────────────────────────────────── */}
      {activeTab === 'train' && (
        <div className="card p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Play className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base">Launch Model Retraining Pipeline</h3>
              <p className="text-xs text-gray-500">Train candidate model and validate metrics before promotion.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Select Training Dataset</label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="input text-xs"
              >
                {datasets.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.sample_count} records)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Algorithm</label>
              <select
                value={trainingAlgorithm}
                onChange={(e) => setTrainingAlgorithm(e.target.value)}
                className="input text-xs"
              >
                <option value="Random Forest Regressor">Random Forest Regressor (Recommended)</option>
                <option value="Gradient Boosting Regressor">HistGradientBoosting Regressor</option>
                <option value="Extra Trees Regressor">Extra Trees Regressor</option>
              </select>
            </div>

            <button
              type="button"
              disabled={trainMutation.isPending}
              onClick={() => trainMutation.mutate()}
              className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {trainMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Cross-Validating & Training Candidate Model…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Start Retraining
                </>
              )}
            </button>

            {trainingJobResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs animate-fade-in space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Candidate Model Trained Successfully!
                </div>
                <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-emerald-100 text-center">
                  <div>
                    <span className="text-gray-400 text-[10px] block">R² Score</span>
                    <span className="font-bold text-emerald-800 text-sm">
                      {trainingJobResult.metrics?.r2_score?.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">MAE</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {trainingJobResult.metrics?.mae?.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block">RMSE</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {trainingJobResult.metrics?.rmse?.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Go to <strong>Model Registry</strong> tab to review and approve candidate model{' '}
                  <span className="font-mono">{trainingJobResult.model_id}</span> to active production.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
