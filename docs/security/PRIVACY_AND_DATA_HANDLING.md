# AI Bhoomi — Privacy and Data Handling Policy

**Document ID**: SEC-PRIV-001  
**Project**: AI Bhoomi — AI-Powered Sustainable Agriculture Intelligence Platform  
**Version**: 1.0.0  
**Status**: APPROVED  

---

## 1. Principles of Agricultural Data Privacy

Farmer land ownership data, GPS coordinates, and historical soil fertility records represent sensitive personal and economic information. AI Bhoomi follows strict data minimization, purpose limitation, and user sovereignty principles.

---

## 2. Data Categories & Handling Practices

| Data Category | Specific Elements | Collection Purpose | Retention Period | Deletion Behavior |
|:---|:---|:---|:---|:---|
| **Identity & Account Data** | Full Name, Email, Password Hash, Phone | Authentication, session management, contact for critical advisories | Active account duration | Deleted upon user account purge request |
| **Geospatial Parcel Data** | Boundary coordinates, Centroid GPS, Area, Taluka/Village | Drawing map polygons, calculating fertilizer doses, resolving administrative hierarchy | Retained while parcel is active | Soft-deleted (`status="archived"`) or hard-deleted via `?cascade=true` |
| **Soil Measurement Data** | pH, EC, OC, N, P, K, Zn, Fe, Lab Ref ID | Generating ICAR crop recommendations and trend tracking | Retained for multi-year historical comparison | Linked to farm lifecycle |
| **Audit Logs** | IP address, Action, Entity ID, Timestamp | Security incident investigation, tamper-proofing, regulatory compliance | 1 year rolling window | Immutable; preserved for audit compliance |

---

## 3. Location Permission & Third-Party Sharing

### 3.1 Browser Location Permissions
- The "Locate Me" button triggers standard W3C Geolocation API permissions.
- Location coordinates are processed exclusively in-browser and transmitted only when the user voluntarily saves the polygon.
- Denying location permission does not block app usage; users can search manually by place name or PIN code.

### 3.2 Third-Party Sharing Restrictions
- **Zero Commercial Monetization**: Farmer parcel coordinates and contact details are never sold to commercial commodity traders or third-party advertisers.
- **Geocoding Transmission**: Only sanitized coordinates (lat, lon) are sent to Geoapify for reverse geocoding; no farmer names or email addresses are passed to external geocoders.
- **Map Tiles**: The browser fetches anonymous raster tiles directly from public CDNs without user identity headers.
