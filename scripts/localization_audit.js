#!/usr/bin/env node
/**
 * CSN Bhoomi — Trilingual Localization Audit Script
 * Validates EN / HI / MR translation JSON files for:
 *   - All required top-level namespaces present in all languages
 *   - No empty string values
 *   - All keys present in EN also present in HI and MR
 *   - Placeholder variables ({{}}) match across languages
 */

const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "frontend", "src", "locales");
const LANGS = ["en", "hi", "mr"];
const NAMESPACES = ["common", "farm", "soil", "crops", "fertilizers", "reports"];

let errors = 0;
let warnings = 0;
let passed = 0;

function log(level, msg) {
  const icon = level === "ERROR" ? "✗" : level === "WARN" ? "⚠" : "✓";
  console.log(`  ${icon} [${level}] ${msg}`);
  if (level === "ERROR") errors++;
  else if (level === "WARN") warnings++;
  else passed++;
}

// Flatten nested JSON into dot-separated keys
function flattenKeys(obj, prefix = "") {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      Object.assign(result, flattenKeys(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

// Extract {{placeholder}} vars from a string
function extractVars(str) {
  const matches = str.match(/\{\{[^}]+\}\}/g) || [];
  return new Set(matches);
}

console.log("\n═══════════════════════════════════════════════════");
console.log("  CSN Bhoomi — Trilingual Localization Audit");
console.log("  Languages: English (EN), Hindi (HI), Marathi (MR)");
console.log("═══════════════════════════════════════════════════\n");

const allData = {};

// Load all files
for (const lang of LANGS) {
  allData[lang] = {};
  for (const ns of NAMESPACES) {
    const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      allData[lang][ns] = flattenKeys(parsed);
      console.log(`  ✓ Loaded ${lang}/${ns}.json (${Object.keys(allData[lang][ns]).length} keys)`);
      passed++;
    } catch (e) {
      log("ERROR", `Could not load ${lang}/${ns}.json: ${e.message}`);
      allData[lang][ns] = {};
    }
  }
}

console.log("\n─── Key Coverage Audit ─────────────────────────────\n");

for (const ns of NAMESPACES) {
  console.log(`  Namespace: ${ns}`);
  const enKeys = Object.keys(allData["en"][ns]);
  for (const lang of ["hi", "mr"]) {
    const langKeys = new Set(Object.keys(allData[lang][ns]));
    const missing = enKeys.filter(k => !langKeys.has(k));
    if (missing.length === 0) {
      log("OK", `${lang}/${ns} — all ${enKeys.length} EN keys present`);
    } else {
      for (const mk of missing) {
        log("WARN", `${lang}/${ns}.${mk} — missing translation`);
      }
    }
  }
}

console.log("\n─── Empty Value Audit ──────────────────────────────\n");

for (const lang of LANGS) {
  for (const ns of NAMESPACES) {
    for (const [key, val] of Object.entries(allData[lang][ns])) {
      if (!val || val.trim() === "") {
        log("ERROR", `${lang}/${ns}.${key} is empty`);
      }
    }
  }
}

console.log("\n─── Placeholder Variable Consistency ───────────────\n");

for (const ns of NAMESPACES) {
  const enKeys = allData["en"][ns];
  for (const [key, enVal] of Object.entries(enKeys)) {
    const enVars = extractVars(enVal);
    if (enVars.size === 0) continue;
    for (const lang of ["hi", "mr"]) {
      const transVal = allData[lang][ns][key];
      if (!transVal) continue;
      const transVars = extractVars(transVal);
      for (const v of enVars) {
        if (!transVars.has(v)) {
          log("WARN", `${lang}/${ns}.${key} — missing placeholder ${v}`);
        }
      }
    }
  }
}

console.log("\n═══════════════════════════════════════════════════");
console.log(`  Audit Complete`);
console.log(`  ✓ Passed: ${passed}`);
console.log(`  ⚠ Warnings: ${warnings}`);
console.log(`  ✗ Errors: ${errors}`);
console.log("═══════════════════════════════════════════════════\n");

process.exit(errors > 0 ? 1 : 0);
