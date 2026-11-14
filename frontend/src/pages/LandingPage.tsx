import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSlider from '../components/LanguageSlider';
import { useLanguage } from '../context/LanguageContext';
import {
  Leaf,
  MapPin,
  FlaskConical,
  Sprout,
  FileText,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Compass,
  Package,
  ShieldCheck,
  Droplets,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      title: t('Mark Your Field', 'Mark Your Field'),
      desc: t(
        'Find your field on the interactive satellite map, click corners to outline your boundary, and view your verified field size in acres and hectares.',
        'Find your field on the interactive satellite map, click corners to outline your boundary, and view your verified field size in acres and hectares.'
      ),
      icon: MapPin,
      badge: t('Step 1', 'Step 1'),
    },
    {
      num: '02',
      title: t('Understand Your Soil', 'Understand Your Soil'),
      desc: t(
        'Check your soil fertility score, pH balance, and key nutrients like Nitrogen, Phosphorus, and Potassium using regional agricultural guidelines.',
        'Check your soil fertility score, pH balance, and key nutrients like Nitrogen, Phosphorus, and Potassium using regional agricultural guidelines.'
      ),
      icon: FlaskConical,
      badge: t('Step 2', 'Step 2'),
    },
    {
      num: '03',
      title: t('Plan Your Crops', 'Plan Your Crops'),
      desc: t(
        'Receive suitable crop suggestions for Kharif, Rabi, or Summer seasons with practical fertilizer bag counts (Urea, DAP, Potash) for your field.',
        'Receive suitable crop suggestions for Kharif, Rabi, or Summer seasons with practical fertilizer bag counts (Urea, DAP, Potash) for your field.'
      ),
      icon: Sprout,
      badge: t('Step 3', 'Step 3'),
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: t('Farm Mapping', 'Farm Mapping'),
      desc: t(
        'Easily mark field boundaries on high-resolution satellite basemaps. Automatically calculates geodesic field area in acres and hectares without complicated surveying tools.',
        'Easily mark field boundaries on high-resolution satellite basemaps. Automatically calculates geodesic field area in acres and hectares without complicated surveying tools.'
      ),
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      icon: FlaskConical,
      title: t('Soil Information', 'Soil Information'),
      desc: t(
        'Understand soil reaction (pH), electrical conductivity (EC), organic carbon, and major nutrients (N, P, K) with transparent laboratory or model provenance badges.',
        'Understand soil reaction (pH), electrical conductivity (EC), organic carbon, and major nutrients (N, P, K) with transparent laboratory or model provenance badges.'
      ),
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      icon: Sprout,
      title: t('Crop Planning', 'Crop Planning'),
      desc: t(
        'Explore suitable crops tailored for Maharashtra agro-climatic zones, factoring in water availability, soil type, and previous crop rotation.',
        'Explore suitable crops tailored for Maharashtra agro-climatic zones, factoring in water availability, soil type, and previous crop rotation.'
      ),
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      icon: Droplets,
      title: t('Irrigation Guidance', 'Irrigation Guidance'),
      desc: t(
        'Receive water requirement insights based on whether your field uses drip, canal, or rain-fed irrigation, preventing under-watering or water waste.',
        'Receive water requirement insights based on whether your field uses drip, canal, or rain-fed irrigation, preventing under-watering or water waste.'
      ),
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      icon: Sparkles,
      title: t('AI Farming Assistance', 'AI Farming Assistance'),
      desc: t(
        'Ask questions and receive explainable agronomic guidance that balances target yield potential with input cost savings.',
        'Ask questions and receive explainable agronomic guidance that balances target yield potential with input cost savings.'
      ),
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      icon: FileText,
      title: t('Downloadable Farm Reports', 'Downloadable Farm Reports'),
      desc: t(
        'Download comprehensive official multi-page PDF reports containing verified field boundaries, soil diagnostic cards, and fertilizer bag schedules.',
        'Download comprehensive official multi-page PDF reports containing verified field boundaries, soil diagnostic cards, and fertilizer bag schedules.'
      ),
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  const faqs = [
    {
      q: t('How does CSN Bhoomi estimate soil properties?', 'How does CSN Bhoomi estimate soil properties?'),
      a: t(
        'CSN Bhoomi uses regional soil survey benchmarks from ICAR-IISS and state agricultural universities (such as MPKV Rahuri), combined with satellite field parcel positioning. It provides an educated regional estimate to help guide farming decisions.',
        'CSN Bhoomi uses regional soil survey benchmarks from ICAR-IISS and state agricultural universities (such as MPKV Rahuri), combined with satellite field parcel positioning. It provides an educated regional estimate to help guide farming decisions.'
      ),
    },
    {
      q: t('Does this replace a government-accredited soil laboratory test?', 'Does this replace a government-accredited soil laboratory test?'),
      a: t(
        'No. CSN Bhoomi is a digital decision-support tool. For high-value crops or precision fertilizer application, we always advise submitting physical soil samples to an accredited Krishi Vigyan Kendra (KVK) or soil testing laboratory.',
        'No. CSN Bhoomi is a digital decision-support tool. For high-value crops or precision fertilizer application, we always advise submitting physical soil samples to an accredited Krishi Vigyan Kendra (KVK) or soil testing laboratory.'
      ),
    },
    {
      q: t('Can I use CSN Bhoomi in Marathi or Hindi?', 'Can I use CSN Bhoomi in Marathi or Hindi?'),
      a: t(
        'Yes. CSN Bhoomi features instant bilingual language support (English & Hindi) with dual-language subtitles so every farmer can comfortably read crop names, nutrient guides, and reports in their preferred language.',
        'Yes. CSN Bhoomi features instant bilingual language support (English & Hindi) with dual-language subtitles so every farmer can comfortably read crop names, nutrient guides, and reports in their preferred language.'
      ),
    },
    {
      q: t('Is my farmland information kept private?', 'Is my farmland information kept private?'),
      a: t(
        'Yes. Your registered farm parcels, boundaries, and reports are saved securely under your personal account and are never shared or sold to third parties.',
        'Yes. Your registered farm parcels, boundaries, and reports are saved securely under your personal account and are never shared or sold to third parties.'
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF5] text-[#172B1A] flex flex-col font-sans">
      {/* ── Public Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCE5DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#166534] flex items-center justify-center shadow-xs text-white">
              <Leaf className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <span className="font-display font-bold text-gray-900 text-lg leading-tight block">
                CSN Bhoomi
              </span>
              <span className="text-[11px] text-[#166534] font-medium leading-none block">
                {t('Satellite Soil Report', 'Satellite Soil Report')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSlider />

            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#166534] px-3 py-2 rounded-xl transition-colors"
            >
              {t('Sign In', 'Sign In')}
            </Link>

            <Link
              to="/register"
              className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs"
            >
              {t('Get Started', 'Get Started')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Section 1: Hero & Primary Call to Action ── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-[#FAFAF5] to-[#FAFAF5] border-b border-[#DCE5DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFCE7] border border-[#22C55E]/40 text-[#14532D] text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-[#166534]" />
            <span>{t('Practical Intelligence for Indian Farmers', 'Practical Intelligence for Indian Farmers')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-[#172B1A] tracking-tight leading-tight max-w-4xl mx-auto">
            {t('Understand Your Soil. Grow with Confidence.', 'Understand Your Soil. Grow with Confidence.')}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto font-normal leading-relaxed">
            {t(
              'Manage your farmland, understand your soil, and discover crops that may suit your land with clear, practical farming guidance.',
              'Manage your farmland, understand your soil, and discover crops that may suit your land with clear, practical farming guidance.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/farms"
              className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-white text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-md flex items-center gap-2.5 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span className="font-semibold">{t('Explore My Farm', 'Explore My Farm')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="btn btn-secondary border-[#DCE5DD] text-[#172B1A] hover:bg-stone-100 text-sm sm:text-base px-6 py-3.5 rounded-2xl w-full sm:w-auto justify-center"
            >
              {t('How It Works', 'How It Works')}
            </a>
          </div>

          {/* Quick value badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              {t('No Technical Jargon', 'No Technical Jargon')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              {t('ICAR Agronomic Benchmarks', 'ICAR Agronomic Benchmarks')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              {t('English & Hindi Localized', 'English & Hindi Localized')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              {t('Official Downloadable Reports', 'Official Downloadable Reports')}
            </span>
          </div>
        </div>
      </section>

      {/* ── Section 2: How CSN Bhoomi Works ── */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-[#DCE5DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
              {t('Simple 4-Step Process', 'Simple 4-Step Process')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gray-900">
              {t('How CSN Bhoomi Works for Farmers', 'How CSN Bhoomi Works for Farmers')}
            </h2>
            <p className="text-sm text-gray-500">
              {t(
                'From mapping your field boundary to getting customized fertilizer bag counts and planting advice.',
                'From mapping your field boundary to getting customized fertilizer bag counts and planting advice.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FAFAF5] border border-[#DCE5DD] flex flex-col justify-between hover:border-[#166534]/50 transition-all shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#DCE5DD] flex items-center justify-center text-[#166534] shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-extrabold text-gray-300 font-mono text-lg">
                        {st.num}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                        {st.badge}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-2">
                        {st.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3 & 4: Farm Mapping & Soil Understanding ── */}
      <section className="py-16 md:py-24 bg-[#FAFAF5] border-b border-[#DCE5DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
                {t('Field Mapping & Cadastral Sizing', 'Field Mapping & Cadastral Sizing')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-gray-900 leading-tight">
                {t('Register and Map Your Farmland with Precision', 'Register and Map Your Farmland with Precision')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(
                  'Search your village, taluka, or district. Draw your field boundary on high-resolution satellite imagery. CSN Bhoomi automatically computes your geodesic area in both Acres and Hectares so your fertilizer and seed calculations are exact.',
                  'Search your village, taluka, or district. Draw your field boundary on high-resolution satellite imagery. CSN Bhoomi automatically computes your geodesic area in both Acres and Hectares so your fertilizer and seed calculations are exact.'
                )}
              </p>

              <div className="space-y-2.5 text-xs text-gray-700 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span>{t('Search by Indian Village, Taluka, District, or PIN Code', 'Search by Indian Village, Taluka, District, or PIN Code')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span>{t('Automatic area calculation in Acres and Hectares', 'Automatic area calculation in Acres and Hectares')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span>{t('Boundary saved securely under your farmer profile', 'Boundary saved securely under your farmer profile')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/farms"
                  className="btn btn-primary bg-[#166534] hover:bg-[#14532D] text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                >
                  <span>{t('Open Farm Workspace', 'Open Farm Workspace')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Card Mockup */}
            <div className="bg-white p-6 rounded-3xl border border-[#DCE5DD] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#166534]" />
                  <span className="font-bold text-gray-900 text-sm">Shri Ganesh Farm (2.03 Acres)</span>
                </div>
                <span className="badge bg-[#DCFCE7] text-[#14532D] text-[11px] font-bold">
                  {t('Boundary Verified', 'Boundary Verified')}
                </span>
              </div>

              <div className="h-44 bg-emerald-950/90 rounded-2xl relative overflow-hidden flex items-center justify-center text-white p-4">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="z-10 text-center space-y-1">
                  <Compass className="w-8 h-8 text-[#22C55E] mx-auto animate-pulse" />
                  <p className="text-xs font-semibold text-emerald-200">Interactive Field Boundary</p>
                  <p className="text-[10px] text-gray-400">Lat: 18.5204°N, Lon: 73.8567°E • Baramati, Pune</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Total Area</span>
                  <strong className="text-gray-900 text-sm">2.03 Acres (0.82 Ha)</strong>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Soil Fertility Score</span>
                  <strong className="text-[#166534] text-sm">78.4 / 100 (Good)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5 & 6: Planting Guidance & Report Organization ── */}
      <section className="py-16 md:py-24 bg-white border-b border-[#DCE5DD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#166534]">
              {t('Two Dedicated AI Agents', 'Two Dedicated AI Agents')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-gray-900">
              {t('Specialized Agricultural Guidance for Every Field', 'Specialized Agricultural Guidance for Every Field')}
            </h2>
            <p className="text-sm text-gray-500">
              {t(
                'CSN Bhoomi cleanly separates Soil Health Analysis from Planting & Crop Advice into two dedicated tools.',
                'CSN Bhoomi cleanly separates Soil Health Analysis from Planting & Crop Advice into two dedicated tools.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Agent 1 Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-white border-2 border-emerald-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1">
                    Agent 1
                  </span>
                  <FlaskConical className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t('Soil Analysis Agent', 'Soil Analysis Agent')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t(
                    'Evaluates your field against regional ICAR soil benchmarks. Displays clear Low, Good, and High indicators for Nitrogen, Phosphorus, Potassium, Organic Carbon, and pH without confusing technical math.',
                    'Evaluates your field against regional ICAR soil benchmarks. Displays clear Low, Good, and High indicators for Nitrogen, Phosphorus, Potassium, Organic Carbon, and pH without confusing technical math.'
                  )}
                </p>
                <div className="space-y-1.5 text-xs text-emerald-950 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('Overall Soil Fertility Score (0–100)', 'Overall Soil Fertility Score (0–100)')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('NPK and Micronutrients (Zinc, Iron, Boron, Sulphur)', 'NPK and Micronutrients (Zinc, Iron, Boron, Sulphur)')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('Data source transparency on every card', 'Data source transparency on every card')}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/agents/soil-analysis"
                className="btn btn-secondary border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>{t('Explore Soil Analysis Agent', 'Explore Soil Analysis Agent')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Agent 2 Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-teal-50/70 to-white border-2 border-teal-200 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="badge bg-teal-100 text-teal-800 font-bold text-xs px-2.5 py-1">
                    Agent 2
                  </span>
                  <Sprout className="w-6 h-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t('Planting Advisor Agent', 'Planting Advisor Agent')}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t(
                    'Connects with Google Gemini AI and state agricultural university guidelines to match crops to your soil, water availability, and season, and converts fertilizer needs into standard 50 kg bags.',
                    'Connects with Google Gemini AI and state agricultural university guidelines to match crops to your soil, water availability, and season, and converts fertilizer needs into standard 50 kg bags.'
                  )}
                </p>
                <div className="space-y-1.5 text-xs text-teal-950 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('Ranked crop suitability for Kharif, Rabi & Summer', 'Ranked crop suitability for Kharif, Rabi & Summer')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('Exact 50kg bag quantities for Urea, DAP, and Potash', 'Exact 50kg bag quantities for Urea, DAP, and Potash')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('Science-backed ICAR and university agronomic rules', 'Science-backed ICAR and university agronomic rules')}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/agents/planting-advisor"
                className="btn btn-secondary border-teal-300 text-teal-900 hover:bg-teal-100 text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <span>{t('Explore Planting Advisor Agent', 'Explore Planting Advisor Agent')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Data Transparency & Scientific Limitations ── */}
      <section className="py-16 md:py-20 bg-[#FAFAF5] border-b border-[#DCE5DD]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-white border border-[#DCE5DD] shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {t('Our Commitment to Scientific Transparency', 'Our Commitment to Scientific Transparency')}
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {t(
                'CSN Bhoomi is built as a farmer-support tool. We believe in complete honesty: spatial models and satellite vegetation indices cannot replace physical laboratory soil chemistry tests. Whenever a soil score is estimated by our model, it is clearly labelled as an estimate. We never fabricate laboratory numbers or promise inflated yield statistics.',
                'CSN Bhoomi is built as a farmer-support tool. We believe in complete honesty: spatial models and satellite vegetation indices cannot replace physical laboratory soil chemistry tests. Whenever a soil score is estimated by our model, it is clearly labelled as an estimate. We never fabricate laboratory numbers or promise inflated yield statistics.'
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1">
                  {t('Accredited Benchmarks', 'Accredited Benchmarks')}
                </span>
                <span className="text-gray-500">
                  {t('ICAR-IISS (Indian Institute of Soil Science) and MPKV Rahuri Agronomic Standards.', 'ICAR-IISS (Indian Institute of Soil Science) and MPKV Rahuri Agronomic Standards.')}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block mb-1">
                  {t('Agronomic Safety', 'Agronomic Safety')}
                </span>
                <span className="text-gray-500">
                  {t('Always combine fertilizer schedules with organic manures and consult your local KVK.', 'Always combine fertilizer schedules with organic manures and consult your local KVK.')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-16 md:py-20 bg-white border-b border-[#DCE5DD]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              {t('Frequently Asked Questions', 'Frequently Asked Questions')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('Common questions farmers ask about CSN Bhoomi and soil testing.', 'Common questions farmers ask about CSN Bhoomi and soil testing.')}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#DCE5DD] overflow-hidden transition-all bg-[#FAFAF5]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-[#166534]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-white">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8: Final Call to Action ── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#166534] via-[#14532D] to-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
            {t('Start Managing Your Farmland Smarter Today', 'Start Managing Your Farmland Smarter Today')}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            {t(
              'Join farmers across Maharashtra using CSN Bhoomi to map fields, check soil health, and get practical agricultural guidance.',
              'Join farmers across Maharashtra using CSN Bhoomi to map fields, check soil health, and get practical agricultural guidance.'
            )}
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="btn btn-primary bg-white text-[#166534] hover:bg-[#DCFCE7] text-sm sm:text-base px-8 py-3.5 rounded-2xl font-bold shadow-lg inline-flex items-center gap-2"
            >
              <span>{t('Register Your Farm Now', 'Register Your Farm Now')}</span>
              <ArrowRight className="w-4 h-4 text-[#166534]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 9: Footer ── */}
      <footer className="bg-white border-t border-[#DCE5DD] py-12 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center text-white">
              <Leaf className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">CSN Bhoomi</p>
              <p className="text-[10px] text-gray-400">
                {t('Satellite Soil Report & Agricultural Intelligence', 'Satellite Soil Report & Agricultural Intelligence')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
            <Link to="/login" className="hover:text-[#166534]">{t('Sign In', 'Sign In')}</Link>
            <Link to="/register" className="hover:text-[#166534]">{t('Get Started', 'Get Started')}</Link>
            <a href="#how-it-works" className="hover:text-[#166534]">{t('How It Works', 'How It Works')}</a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-400">{t('Aligned with ICAR-IISS Guidelines', 'Aligned with ICAR-IISS Guidelines')}</span>
          </div>

          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} CSN Bhoomi. {t('All rights reserved.', 'All rights reserved.')}
          </p>
        </div>
      </footer>
    </div>
  );
}
