// ── Shared TypeScript types for CSN Bhoomi ──────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  state: string | null;
  district: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  owner_name: string | null;
  land_record_ref: string | null;
  state: string;
  district: string | null;
  taluka: string | null;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
  boundary_geojson: string | null;
  area_sqm: number | null;
  area_hectares: number | null;
  area_acres: number | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SoilMeasurement {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  source: string;
  method: string | null;
  confidence: number | null;
}

export interface SoilSample {
  id: string;
  farm_id: string;
  sample_label: string | null;
  sample_date: string | null;
  laboratory_name: string | null;
  source: string;
  verification_status: string;
  depth_cm: number | null;
  is_demo: boolean;
  created_at: string;
  measurements: SoilMeasurement[];
}

export interface SatelliteAnalysis {
  id: string;
  farm_id: string;
  status: string;
  is_demo: boolean;
  date_from: string | null;
  date_to: string | null;
  acquisition_date: string | null;
  valid_pixel_pct: number | null;
  cloud_cover_pct: number | null;
  ndvi_mean: number | null;
  ndvi_min: number | null;
  ndvi_max: number | null;
  ndvi_std: number | null;
  extra_indices: Record<string, number> | null;
  created_at: string;
}

export interface Report {
  id: string;
  farm_id: string;
  title: string;
  season: string | null;
  year: number | null;
  contains_demo_data: boolean;
  generated_at: string;
}

export interface CropRecommendation {
  crop: string;
  botanical_name: string;
  suitability_score: number;
  season: string;
  notes: string;
  reasons: string[];
  warnings: string[];
  irrigation_requirement: string;
}

export interface FertilizerRecommendation {
  status: string;
  crop: string;
  season: string;
  area_ha: number;
  recommended_per_ha: {
    N_kg: number;
    P2O5_kg: number;
    K2O_kg: number;
    units: string;
  };
  recommended_total_farm: {
    N_kg: number;
    P2O5_kg: number;
    K2O_kg: number;
  };
  application_stages: Array<{
    stage: string;
    N_kg: number;
    P2O5_kg: number;
    K2O_kg: number;
    N_total_farm: number;
    P2O5_total_farm: number;
    K2O_total_farm: number;
  }>;
  source: string;
  agronomic_note: string;
  disclaimer: string;
}

export interface ApiError {
  detail: string;
}

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'demo' | 'no_imagery';

export interface AdminLocationHierarchy {
  state: string;
  district: string | null;
  taluka: string | null;
  village: string | null;
  postcode: string | null;
  country: string;
  formatted?: string;
  confidence?: string;
  provider?: string;
}

export interface SelectedFieldData {
  geojson: string; // Valid GeoJSON polygon string
  points: [number, number][]; // Array of [lat, lon]
  pointCount: number;
  isFinalized: boolean;
  isValid: boolean;
  validationError?: string | null;
  areaSqm: number;
  areaAcres: number;
  areaHectares: number;
  perimeterMeters: number;
  centroid: [number, number]; // [lat, lon]
  adminLocation: AdminLocationHierarchy;
  isResolvingAdmin: boolean;
  adminResolutionFailed?: boolean;
  resolutionTimestamp: number;
}

export interface FarmProfile {
  id?: string;
  farm_id: string;
  owner_id?: string;
  target_crop?: string | null;
  season?: string | null;
  sowing_date?: string | null;
  sowing_month?: string | null;
  crop_duration_days?: number | null;
  farming_type?: string | null;
  irrigation_method?: string | null;
  water_availability?: string | null;
  water_source?: string | null;
  previous_crop?: string | null;
  crop_rotation_history?: string | null;
  fertilizers_applied?: string | null;
  fertilizer_used_previously?: string | null;
  organic_manure_applied?: string | null;
  manure_quantity_tons_acre?: number | null;
  fym_manure_tons_per_acre?: number | null;
  soil_amendments?: string | null;
  farming_objective?: string | null;
  has_lab_report?: boolean;
  lab_name?: string | null;
  sample_date?: string | null;
  report_date?: string | null;
  sample_ref?: string | null;
  lab_sample_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SoilHealthCardParameter {
  name: string;
  key: string;
  value: number | null;
  unit: string;
  status?: string;
  rating?: string;
  benchmark: string;
  source?: string;
  source_classification?: string;
  source_reference?: string;
  interpretation?: string;
  action?: string;
}

