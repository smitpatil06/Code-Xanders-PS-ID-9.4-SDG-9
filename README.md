# AegisFlow — Code-Xanders (CIH Hackathon)

**Project:** AegisFlow — Predictive Intelligence for Industrial Longevity

**Short tagline:** Shielding Assets Through Data Velocity.

**PS ID:** **9.4**

Team name: Code Xanders

Team members:
- Vaishnav Raut
- Smit Patil
- Vaidehee Daf
- Yukti Raurkar

Repository: Code-Xanders-PS-ID-9.4-SDG-9

Overview
--------
AegisFlow transforms raw sensor streams into actionable maintenance intelligence. We predict the Remaining Useful Life (RUL) of critical components using fast, on-prem / cloud-ready ML models and a realtime telemetry stack. This project was produced for the CIH Hackathon (Design ML software predicting factory equipment failures using sensor data — predictive maintenance startup).

Key features
- Realtime telemetry ingestion and visualization (frontend dashboard)
- Per-sensor monitoring and critical-alert detection
- RUL prediction and degradation curve visualization
- Batch upload analysis pipeline (CSV) and model inference utilities

Files and structure (high level)
- `CIH-Main/backend/` — FastAPI backend and sensor simulator (`main.py`, `sensor_sim_fixed.py`)
- `CIH-Main/frontend/` — React + Vite frontend with `Dashboard_Premium` and `Landing` components
- `CIH-Main/ai_engine/` — training & inference scripts plus saved `joblib` models
- `data/` — dataset files used for development and testing (NASA C-MAPSS subsets)

Requirements
------------
Install Python dependencies into a virtual environment. A top-level `requirements.txt` has been added.

Quick start — backend

1. Create & activate a Python virtualenv (or use `CIHenv` if present):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Start the backend API (from `CIH-Main/backend`):

```bash
cd CIH-Main/backend
uvicorn main:app --reload --port 8000
```

Quick start — frontend

1. Ensure Node and pnpm are installed, then start the frontend:

```bash
cd CIH-Main/frontend
pnpm install
pnpm dev
```

2. Open the app in your browser. The app now shows a landing page — click **Enter Dashboard** to view the monitoring dashboard.

Landing page
------------
Title: AegisFlow — Predictive Intelligence for Industrial Longevity

Hero headline: Shielding Assets Through Data Velocity.

Sub-headline: AegisFlow transforms raw sensor streams into actionable maintenance intelligence. We predict the Remaining Useful Life (RUL) of critical components with industry-leading precision.

Team name: Code Xanders — Team members and PS ID are shown on the landing page.

Notes and development
---------------------
- Critical alerts in the dashboard now persist briefly to avoid flicker; this retention is implemented in `Dashboard_Premium.tsx` via a small sticky cache.
- Charts receive a flattened, numeric `chartData` to keep `recharts` happy; missing sensor values are set to `null` so charts behave correctly.
- The landing page `Learn More` button links to the GitHub repository: https://github.com/smitpatil06/Code-Xanders-PS-ID-9.4-SDG-9

Contributing
------------
Pull requests and issues are welcome. For local development, follow the quick start steps above.

Contact
-------
Team Code Xanders — see repository for contact and commit history.

License
-------
This repository follows the code and data licenses included in the project. Check individual files for any third-party license notices.

