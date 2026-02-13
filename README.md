# GRC Risk Assessment & Heatmap Dashboard

A full-stack web application for Governance, Risk, and Compliance (GRC) risk assessment using the NIST-aligned likelihood × impact risk matrix model.

## 📋 Overview

This application implements a complete GRC risk assessment workflow:
1. **Risk Input** - Users assess organizational risks by evaluating likelihood (1-5) and impact (1-5)
2. **Risk Calculation** - Automatic score computation (likelihood × impact = 1-25)
3. **Risk Classification** - Automatic level assignment (Low/Medium/High/Critical)
4. **Risk Visualization** - Interactive 5×5 heatmap showing risk distribution
5. **Risk Management** - Dashboard with filtering, sorting, and export capabilities

### GRC Alignment
This tool aligns with **NIST SP 800-30 Risk Assessment Framework**, a standard approach used by government and enterprise organizations to systematically identify, analyze, and prioritize information security risks.

### Screenshots
**Dashboard**
![Dashboard](images\dashboard.png)
**Assess Risk**
![Assess Risk](images\input_form.png)


## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ (https://nodejs.org/)
- **npm** 6+ (comes with Node.js)
- **SQLite3** (automatically managed by the backend)

### Installation & Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
# Server will run on http://localhost:5000
```

The backend will:
- Initialize SQLite database (`risks.db`) automatically
- Create the `risks` table schema on first run
- Expose REST API endpoints at `http://localhost:5000`

#### Frontend Setup (in a new terminal)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
# App will open at http://localhost:5173
```

The frontend will:
- Open automatically in your default browser
- Connect to backend at `http://localhost:5000`
- Display dashboard on startup

### Verification
1. Open **http://localhost:5173** in your browser
2. Navigate to **"➕ Assess Risk"** tab
3. Fill in a sample risk:
   - Asset: "Customer Database"
   - Threat: "Unauthorized Access"
   - Likelihood: 3
   - Impact: 4
4. Click **"✅ Submit Risk Assessment"**
5. Return to **"📊 Dashboard"** to see your risk in the table and heatmap

## 📊 Features

### Core Features
- ✅ **Risk Assessment Form** with real-time preview of score and level
- ✅ **Interactive Dashboard** with risks table and heatmap
- ✅ **Risk Heatmap** - 5×5 matrix showing likelihood × impact distribution
- ✅ **Statistics Cards** - Total risks, High/Critical count, average score
- ✅ **Filtering** - Filter risks by level (Low/Medium/High/Critical)
- ✅ **Sorting** - Click column headers to sort by any field
- ✅ **CSV Export** - Download all risks as CSV file
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Mitigation Hints** - Context-specific recommendations for each risk level

### Technical Features
- ✅ RESTful API with comprehensive error handling
- ✅ SQLite database with persistent storage
- ✅ CORS-enabled for cross-origin requests
- ✅ Input validation on both frontend and backend
- ✅ Real-time state management with React Hooks
- ✅ Professional UI with Tailwind CSS

## 🏗️ Architecture

### Backend (Node.js + Express + SQLite)
```
backend/
├── .gitignore        # File ignored by Git
├── server.js         # Main Express server
├── risks.db          # SQLite database (auto-created)
└── package.json      # Dependencies
```

**API Endpoints:**
- `POST /assess-risk` - Create new risk assessment
- `GET /risks` - Fetch all risks (with optional `?level=` filter)
- `GET /risks/:id` - Fetch specific risk
- `DELETE /risks/:id` - Delete risk
- `GET /stats` - Get summary statistics
- `GET /heatmap` - Get heatmap matrix data
- `GET /health` - Health check

### Frontend (React + Tailwind CSS)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Heatmap.jsx       # 5x5 heatmap visualization
│   │   ├── RiskForm.jsx      # Risks assessment form
│   │   ├── RisksTable.jsx    # Risks table with sorting
│   │   └── StatsCards.jsx    # Statistics display
│   ├── App.css               # Component-level styling
│   ├── App.jsx               # Root React Component
│   ├── index.css             # Global styles
│   └── main.jsx              # Application entry point
├── .gitignore                # File ignored by Git
├── eslint.config.js          # ESLint rules & configuration
├── index.html                # Main HTML file
├── package.json              # Dependencies
├── postcss.config.js         # PostCSS setup (required for TailwindCSS)
├── README.md                 # Project Documentation
├── tailwind.config.js        # Tailwind theme configuration
└── vite.config.js            # Vite handler configuration
```
## 📈 Risk Score Calculation

**Formula:** `Score = Likelihood × Impact`

**Scoring Matrix:**
| Likelihood | Impact | Example | Score | Level |
|------------|--------|---------|-------|-------|
| 1          | 1      | 1       | 1-5   | Low |
| 3          | 2      | 6       | 6-12  | Medium |
| 4          | 4      | 16      | 13-18 | High |
| 5          | 5      | 25      | 19-25 | Critical |

**Risk Levels:**
- **Low (1-5):** Accept / monitor
- **Medium (6-12):** Plan mitigation within 6 months
- **High (13-18):** Prioritize action + compensating controls (NIST PR.AC)
- **Critical (19-25):** Immediate mitigation required + executive reporting

## 💾 Database Schema

```sql
CREATE TABLE risks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset TEXT NOT NULL,
  threat TEXT NOT NULL,
  likelihood INTEGER NOT NULL,        -- 1-5
  impact INTEGER NOT NULL,            -- 1-5
  score INTEGER NOT NULL,             -- Computed: likelihood × impact
  level TEXT NOT NULL,                -- Low, Medium, High, Critical
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Test Scenarios

### Scenario 1: Add Low-Risk Item
- Asset: "Office Printer"
- Threat: "Paper Jam"
- Likelihood: 2, Impact: 1
- Expected: Score 2 (Low)

### Scenario 2: Add High-Risk Item
- Asset: "Email Server"
- Threat: "Ransomware Attack"
- Likelihood: 4, Impact: 5
- Expected: Score 20 (Critical)

### Scenario 3: Filter by Level
1. Add multiple risks at different levels
2. Use filter dropdown to show only "Critical" risks
3. Verify table updates and heatmap reflects filter

### Scenario 4: Export CSV
1. Add at least 2 risks
2. Click "📥 Export CSV"
3. Verify file downloads with correct format and data

### Scenario 5: Responsive Design
1. Open dashboard on mobile-sized browser window
2. Verify table scrolls horizontally
3. Verify buttons are clickable on touch devices

## 🔍 Error Handling

### Validation Errors
- **Missing Fields:** "Asset and threat are required"
- **Invalid Range:** "Likelihood and Impact must be 1–5"
- **Type Mismatch:** "Likelihood and Impact must be integers"

### Network Errors
- Display user-friendly error messages
- Retry logic on failed API calls
- Graceful degradation if backend is unavailable

### Database Errors
- All database operations wrapped in error handlers
- Server returns HTTP 500 with error message
- Logs errors to console for debugging

## 📸 Screenshots & Walkthrough

### 1. Risk Assessment Form
- Clean form layout with sliders
- Real-time score preview (matches backend logic)
- Validation feedback before submission

### 2. Dashboard Overview
- Statistics cards showing key metrics
- Filter dropdown to narrow risk view
- Export CSV button for reporting

### 3. Risks Table
- Sortable columns (click header to sort)
- Color-coded risk levels
- Mitigation hints for each risk
- Delete button for risk management

### 4. Risk Heatmap
- 5×5 grid with likelihood on Y-axis, impact on X-axis
- Cell colors represent risk levels (green→red)
- Hover tooltips show asset names and risk count
- Color legend explains mapping

## 🛠️ Development Notes

### Key Challenges & Solutions

**Challenge 1: Real-Time Score Preview**
- **Solution:** Calculate score client-side in RiskForm using state, mirror backend logic

**Challenge 2: Heatmap Visualization**
- **Solution:** Build 5×5 grid manually with CSS flexbox, group risks by (likelihood, impact)

**Challenge 3: Cross-Origin Requests**
- **Solution:** Enable CORS in Express, set proxy in React package.json

**Challenge 4: Persistent Storage**
- **Solution:** Use SQLite3 for simple file-based persistence, no external database needed

### Design Decisions

1. **React Hooks over Class Components** - Simpler state management, modern patterns
2. **Tailwind CSS over Bootstrap** - Smaller bundle, utility-first flexibility
3. **SQLite over PostgreSQL** - No extra setup, perfect for small apps
4. **Express over FastAPI** - JavaScript ecosystem consistency
5. **Client-side Filtering** - Fast, no extra API calls

### Assumptions

- Single-user local application (no multi-user support)
- No authentication/authorization needed
- All risks treated equally (no user roles/permissions)
- Database file location: `backend/risks.db`
- Frontend proxy to backend: `http://localhost:5000`

## 🐛 Debugging

### Backend Issues
```bash
# Check if server is running
curl http://localhost:5000/health

# View database directly
sqlite3 backend/risks.db ".tables"
sqlite3 backend/risks.db "SELECT * FROM risks;"

# Enable verbose logging
NODE_DEBUG=* npm start
```

### Frontend Issues
```bash
# Check browser console for errors (F12)
# Check network tab to see API calls
# Verify backend is accessible: http://localhost:5000/health
```

### Database Issues
```bash
# Reset database (delete file and restart server)
rm backend/risks.db
npm start

# Backup database
cp backend/risks.db backend/risks.backup.db
```

## 📚 References

- **NIST SP 800-30:** https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-30r1.pdf
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **SQLite:** https://www.sqlite.org/

## 🎯 Future Enhancements (Not Implemented)

- User authentication and multi-user support
- Risk history and audit trail
- Mitigation tracking and status updates
- Risk trending over time
- Integration with compliance frameworks (ISO 27001, SOC 2)
- Advanced analytics and reporting
- API rate limiting and security headers
- Dark mode
- Mobile-native apps (React Native)

## 📝 License

This project is provided as-is for educational and assessment purposes.

## ✅ Completion Checklist

- [x] Backend API with validation
- [x] SQLite database with schema
- [x] Frontend React app with components
- [x] Risk form with real-time preview
- [x] Risk dashboard with table
- [x] 5×5 heatmap visualization
- [x] Filtering and sorting
- [x] CSV export
- [x] Statistics cards
- [x] Responsive design
- [x] Error handling
- [x] Documentation (this README)
- [x] GRC alignment (NIST SP 800-30)
- [x] Mitigation hints
- [x] Code is runnable locally

## 🤝 Support

If you encounter issues:
1. Check that both servers are running (backend on :5000, frontend on :5173)
2. Verify Node.js and npm versions
3. Clear browser cache and refresh (Ctrl+Shift+R)
4. Check console logs for error messages
5. Try restarting both servers

---