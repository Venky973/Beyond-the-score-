# BEYOND THE SCORE
### Integrated Sports Management & Real-Time Facility Booking Platform

**Beyond The Score** is an integrated full-stack MERN web application bringing live sports scores, athlete statistics, location-based turf discovery, turf slot reservations, and custom scorecard creation into one unified platform.

---

## 1. Key Platform Features

- **Live Sports Score Tracking**:
  - Multi-sport coverage: Cricket (runs, wickets, overs, batting & bowling rates), Football (goals, assists, cards, possession), Basketball (quarters, top scorers), Tennis, Badminton, and Volleyball.
  - Sub-100ms real-time updates broadcast via Socket.IO without page refreshes.
  - Real-time commentary and match timeline event feed.
  - Live Scorer Console for tournament directors and officials to update match actions on the fly.

- **Location-Based Sports Turf Discovery**:
  - Browser Geolocation API integration to detect the user's GPS coordinates.
  - Haversine distance calculations showing proximity in kilometers.
  - Filter by sport, facility amenities (floodlights, locker rooms, parking, cafeteria), price range, and radius.
  - Verified badges and player ratings.

- **Turf Booking & Reservation Engine**:
  - Real-time slot availability calendar with conflict-prevention algorithms.
  - Rechecks active reservations immediately before confirmation to prevent double bookings.
  - Generates official vouchers with unique reference IDs (e.g. `BTS-2026-XXXX`).
  - Dedicated Operator portal to accept, reject, or mark bookings completed.

- **Custom Scorecard Creation & Sharing**:
  - Record matches not covered by official broadcasts (friendly matches, pickup games, corporate leagues, amateur tournaments).
  - Dynamic forms that adapt specifically to the selected sport.
  - Privacy controls: Public, Unlisted (link only), or Private.
  - Public match share URLs accessible without login.

- **Athlete Performance & Head-to-Head Comparison**:
  - Comprehensive player profiles with sport-specific metrics.
  - Interactive career performance charts powered by Recharts.
  - Strict same-sport comparative metrics engine highlighting category leaders.

- **Role-Based Access Control (5 Roles)**:
  1. **Sports Fan / General User**: Browse live matches, book turfs, follow clubs, create personal scorecards.
  2. **Player**: Athlete profile, individual career records, recent form tracker.
  3. **Team / Event Organizer**: Create tournaments, schedule official matches, operate live scorer console.
  4. **Turf Operator**: Register sports arenas, configure operating hours, manage slot availability, review booking requests.
  5. **Platform Administrator**: System statistics, user activation/suspension, turf verification queue, global booking registry, content moderation.

- **Real-Time Notifications & Global Search**:
  - In-app notification bell with unread badge counter and real-time socket alerts.
  - Debounced multi-entity search across Matches, Turfs, Players, Teams, and Competitions.

---

## 2. Technology Stack

- **Frontend**:
  - React.js (ES6+)
  - React Router DOM v7
  - Tailwind CSS
  - Lucide React (Sports & System Icons)
  - Recharts (Performance Visualization)
  - Socket.IO Client
  - Axios

- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose ODM
  - Socket.IO (Real-Time Bi-Directional Engine)
  - JSON Web Tokens (JWT) & bcryptjs Password Hashing
  - Multer (File Upload Handling)
  - Express Rate Limit & Security Middleware
  - Node-Cron (Automated Background Booking Maintenance)

---

## 3. Seeded Demo Accounts

All seeded demo accounts use the standard password: `password123`

| Role | Email | Password | Primary Capabilities |
|------|-------|----------|----------------------|
| **Administrator** | `admin@beyondthescore.com` | `password123` | Platform metrics, Turf verification, User moderation |
| **Turf Operator** | `operator@beyondthescore.com` | `password123` | Facility management, Slot blocking, Accept/Reject bookings |
| **Organizer** | `organizer@beyondthescore.com` | `password123` | Tournament creation, Match scheduling, Live Scorer Console |
| **Star Player** | `player@beyondthescore.com` | `password123` | Cricket career stats, batting averages, form tracking |
| **Footballer** | `lucas@beyondthescore.com` | `password123` | Football goals, assists, shots on target |
| **General Fan** | `user@beyondthescore.com` | `password123` | Turf booking, personal scorecard creation, favorites |

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds database with sports, turfs, players, matches, and users
npm start        # Launches Express API & Socket.IO server on port 5005
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Launches Vite dev server on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 5. Environment Variables (.env)

Server `.env` configuration:
```env
PORT=5005
MONGO_URI=mongodb://127.0.0.1:27017/beyond-the-score
JWT_SECRET=beyond-the-score-super-secret-key-2026
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

---

## 6. REST API Endpoints Overview

- **Auth**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `PUT /api/auth/profile`
  - `PUT /api/auth/change-password`

- **Matches & Scores**:
  - `GET /api/matches` (filters: sport, status, category, search)
  - `GET /api/matches/live`
  - `GET /api/matches/:id`
  - `POST /api/matches` (Organizer/Admin)
  - `PUT /api/matches/:id/score` (Real-Time Scorer Console)
  - `PUT /api/matches/:id/result` (Declare Result)

- **Turfs & Bookings**:
  - `GET /api/turfs` (lat, lng, radius, sport, price, facilities, sort)
  - `GET /api/turfs/:id`
  - `GET /api/turfs/:id/slots?date=YYYY-MM-DD`
  - `POST /api/turfs` (Operator)
  - `POST /api/turfs/:id/block-slots` (Operator maintenance)
  - `POST /api/bookings` (Atomic slot conflict check)
  - `GET /api/bookings/my-bookings`
  - `GET /api/bookings/operator`
  - `PUT /api/bookings/:id/status` (Confirm / Reject / Cancel)

- **Custom Scorecards**:
  - `POST /api/scorecards`
  - `GET /api/scorecards/my-scorecards`
  - `GET /api/scorecards/public`
  - `GET /api/scorecards/share/:code` (No login required)
  - `PUT /api/scorecards/:id`
  - `DELETE /api/scorecards/:id`

- **Athletes & Compare**:
  - `GET /api/players`
  - `GET /api/players/:id`
  - `GET /api/players/compare?player1Id=...&player2Id=...`

- **Administration**:
  - `GET /api/admin/stats`
  - `GET /api/admin/users`
  - `PUT /api/admin/users/:id/toggle-status`
  - `GET /api/admin/turf-approvals`
  - `PUT /api/admin/turf-approvals/:id`
  - `GET /api/admin/bookings`
  - `GET /api/admin/reports`
  - `GET /api/admin/activity-logs`
