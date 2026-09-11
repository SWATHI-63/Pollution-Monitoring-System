# EcoComply – Industrial Pollution Monitoring & Compliance Dashboard

> **Tagline:** Smart Software-Based Environmental Monitoring and Compliance Analysis  
> **Type:** Software-Based Environmental Pollution Monitoring & Compliance Simulation System

---

## 🌿 Project Overview

**EcoComply** is a modern, responsive, industrial environmental pollution monitoring and compliance simulation dashboard. It simulates real-time data from industrial sensors (MQ-135 semiconductor gas sensors, atmospheric temperature, relative humidity, effluent water pH, and water turbidity) without requiring physical hardware (such as ESP32, Arduino, or physical probes).

The system continuously compares live readings against **Configured Reference Thresholds**, generates immediate critical alerts upon violation breaches, recalculates composite compliance scores dynamically, and enforces strict **Role-Based Access Control (RBAC)** across `ADMIN` and `EMPLOYEE` tiers.

---

## 🚀 Key Features & Highlights

- **Zero Physical Hardware Required:** Fully software-driven simulation engine with realistic time-series drift, noise, and diurnally fluctuating telemetry.
- **Universal Email Authentication:** Login accepts **any valid email address format** (e.g., `student@gmail.com`, `swathi@example.com`, `admin@company.com`) without hardcoded or domain restrictions.
- **Strict Role-Based Access Control:**
  - **ADMIN:** Full authority across all 12 modules, threshold customization, facility CRUD, employee directory management, and administrative settings.
  - **EMPLOYEE:** Monitoring-focused access with real-time dashboards, alerts resolution, analytics, historical audit logs, and report exports. Blocked from administrative modules with an active **ACCESS DENIED** route guard screen.
- **Dynamic Real-Time Recalculation:** Changing reference thresholds instantly propagates across the Dashboard, Sensor Simulator, Compliance Center, and Alert engine.
- **Sensor Simulator Deck:**
  - **Modes:** *Normal Environment*, *Warning Condition*, *Pollution Violation*.
  - **State Controls:** Start, Pause, Stop, and customizable tick rates (1.5s, 3s, 5s, 10s).
  - **Manual Input & Analysis Form:** Enter custom parameters and click **ANALYZE READING** to test immediate evaluation and automatic alert dispatch.
- **Compliance Center:** Circular radial compliance gauge, individual parameter conformity breakdown, and statutory prototype disclaimer banner.
- **Reports Generation:** Daily, Weekly, Monthly, and Violation reports with printable letterhead formatting and CSV data export.
- **High-Contrast Themes:** Seamless dark/light mode toggle suited for industrial SCADA command rooms.
- **Full LocalStorage Persistence:** Retains sessions, custom thresholds, facilities, alerts, and settings across browser refreshes.

---

## 🛠️ Technology Stack

- **Frontend Library:** React 18
- **Build Tool:** Vite 6
- **Language:** JavaScript (JSX, ES Modules)
- **Styling:** Tailwind CSS v3 with custom industrial environmental palette
- **Routing:** React Router DOM v6 with declarative guards (`RoleGuard`, `ProtectedRoute`)
- **Data Visualizations:** Recharts (LineChart, AreaChart, BarChart, ResponsiveContainer)
- **Icons:** Lucide React
- **Storage:** HTML5 LocalStorage

---

## 📋 Main Modules (12 Modules)

1. **Dashboard Module (`/dashboard`)**: KPI cards (Overall Compliance, Total Facilities, Active Alerts, Violations, Monitored Channels), Air and Water subsystem cards, Multi-Parameter Pollution Trend Chart with 1h/6h/24h/7d filters, Recent Alerts table, and Facility Compliance progress bars.
2. **Air Quality Monitoring Module (`/air-quality`)**: Live MQ-135 PPM, Ambient Temperature (°C), Relative Humidity (%), Minimum/Maximum/Average statistics, and historical progression area curves.
3. **Water Quality Monitoring Module (`/water-quality`)**: Effluent pH Balance, Wastewater Turbidity (NTU), Minimum/Maximum/Average statistics, and correlation charts.
4. **Sensor Simulation Module (`/simulator`)**: Core simulation cockpit supporting Normal, Warning, and Violation modes, live channel cards, and Manual Sensor Telemetry Analyzer with automated alert generation.
5. **Threshold Comparison & Configuration Module (`/thresholds`)**: *ADMIN ONLY*. Real-time adjustment of warning and violation limits for all 5 channels with reset-to-defaults capabilities.
6. **Alert Generation & Alert Center (`/alerts`)**: Incident audit log with Critical, Warning, Resolved, and Total counters, comprehensive search/filter controls, and modal resolution workflow.
7. **Compliance Monitoring Center (`/compliance`)**: Overall (e.g. 92%), Air, and Water compliance percentages, conformity status classifications (COMPLIANT, PARTIALLY COMPLIANT, NON-COMPLIANT), and prototype disclaimer.
8. **Analytics Module (`/analytics`)**: Six dedicated time-series charts with Daily (24H), Weekly (7D), and Monthly (30D) temporal filters and facility filter.
9. **Facility Management Module (`/facilities`)**: Plant profiles for Textile Processing Unit, Chemical Manufacturing Unit, Paper Manufacturing Unit, and Food Processing Unit (Admin CRUD, Employee view-only).
10. **Reports Module (`/reports`)**: Formal audit dossiers with executive summary, parameter tables, violation incident logs, printable layout, and CSV download.
11. **User Management Module (`/users`)**: *ADMIN ONLY*. Employee registry supporting any valid email address, role assignments, activation/deactivation, and deletion.
12. **Settings Module (`/settings`)**: Profile info, display mode (Industrial Dark / Clean Light), telemetry tick rate, notification preferences, and enterprise administrative settings.

---

## 🎬 Complete Project Demonstration Flow (Step-by-Step)

| Step | Action | Expected Output |
| :--- | :--- | :--- |
| **STEP 1** | Open application | Redirected to professional `/login` page with EcoComply branding. |
| **STEP 2** | Enter any valid email (e.g., `student@gmail.com` or click "ADMIN Role") | Email validated; select `ADMIN` role and log in. |
| **STEP 3** | Open Dashboard (`/dashboard`) | View KPIs (Compliance, Active Alerts), environmental cards, and live trend charts. |
| **STEP 4** | Inspect Monitoring Status | Check Air Quality (MQ-135, Temp, Humidity) and Water Quality (pH, Turbidity). |
| **STEP 5** | Navigate to Sensor Simulator (`/simulator`) | View simulation control deck and live telemetry channel cards. |
| **STEP 6** | Select **NORMAL ENVIRONMENT** | Telemetry generates safe values within configured reference thresholds; status indicates `NORMAL`. |
| **STEP 7** | Select **WARNING CONDITION** | Telemetry drifts into warning envelope; status changes to `WARNING` and warning alert generated. |
| **STEP 8** | Select **POLLUTION VIOLATION** | Parameter spikes past violation threshold (e.g. Turbidity > 10 NTU or MQ-135 > 150 PPM). |
| **STEP 9** | View **CRITICAL ALERT** | Instant critical alert dispatched; notification bell counter increments. |
| **STEP 10**| Open Alert Center (`/alerts`) | Inspect logged critical alert with detailed breach metrics; click **Resolve**. |
| **STEP 11**| Open Compliance Center (`/compliance`) | View reduced compliance percentage and updated parameter conformity table. |
| **STEP 12**| Test Manual Sensor Input | Switch to "MANUAL INPUT" tab in `/simulator`, enter custom values, and click **ANALYZE READING**. |
| **STEP 13**| Test Admin Threshold Customization | In `/thresholds`, modify MQ-135 warning threshold and verify immediate dashboard recalculation. |
| **STEP 14**| Test Role Protection | Logout and login as `EMPLOYEE` (`swathi@example.com`). Attempt to navigate to `/thresholds` or `/users` to verify the **ACCESS DENIED** screen with "Back to Dashboard" button. |
| **STEP 15**| Open Analytics (`/analytics`) | Filter trends across Daily, Weekly, and Monthly horizons. |
| **STEP 16**| Open Historical Data (`/history`) | Search logs, apply facility filters, navigate pagination, and click **EXPORT CSV**. |
| **STEP 17**| Open Reports (`/reports`) | Select "Violation Report", view the dossier preview, and test **PRINT / DOWNLOAD PDF** and **EXPORT CSV**. |
| **STEP 18**| Toggle Theme | Click the theme icon in the top header to toggle between Industrial Dark and Clean Light modes. |

---

## ⚡ Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd Pollution-Monitoring-System

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173/`

### Production Build
```bash
npm run build
npm run preview
```

---

## ⚖️ Statutory Prototype Disclaimer

> *"EcoComply is a software-based environmental monitoring prototype. Sensor readings in this demonstration are simulated or manually entered. Configured thresholds are reference values for demonstration and should not be interpreted as certified regulatory measurements. Actual industrial compliance requires calibrated and certified monitoring instruments."*

