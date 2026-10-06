import { lazy, Suspense, useState, type ReactNode } from "react";

const WeatherForecast = lazy(() => import("./WeatherForecast"));
const RadarSatellite = lazy(() => import("./RadarSatellite"));
const HydrologyFlood = lazy(() => import("./HydrologyFlood"));
const GeophysicalHazards = lazy(() => import("./GeophysicalHazards"));
const ObservatoriesHealth = lazy(() => import("./ObservatoriesHealth"));
const IncidentManagement = lazy(() => import("./IncidentManagement"));
const SystemInfrastructure = lazy(() => import("./SystemInfrastructure"));

type IconName =
  | "grid"
  | "cloud"
  | "radar"
  | "waves"
  | "activity"
  | "radio"
  | "ticket"
  | "server"
  | "bell"
  | "settings"
  | "shield"
  | "search"
  | "chevron"
  | "pause"
  | "play"
  | "layers"
  | "maximize"
  | "wind"
  | "rain"
  | "thermometer"
  | "pin";

const icons: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  cloud: <path d="M6 18h11.5a3.5 3.5 0 0 0 .4-7A6 6 0 0 0 6.6 9.2 4.4 4.4 0 0 0 6 18Z" />,
  radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 6-6M12 3v2M3 12h2" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  waves: <><path d="M3 7c3-3 5 3 8 0s5 3 10 0M3 12c3-3 5 3 8 0s5 3 10 0M3 17c3-3 5 3 8 0s5 3 10 0" /></>,
  activity: <path d="M3 12h4l2.5-7 4.5 14 2.5-7H21" />,
  radio: <><circle cx="12" cy="12" r="2" /><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" /></>,
  ticket: <path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z" />,
  server: <><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /><path d="M7 7h.01M7 17h.01M11 7h7M11 17h7" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  shield: <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  chevron: <path d="m8 10 4 4 4-4" />,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  play: <path d="m8 5 11 7-11 7V5Z" />,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
  maximize: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
  wind: <><path d="M3 8h10c3 0 3-4 0-4-1.5 0-2.2.8-2.5 1.5M3 12h16M3 16h10c3 0 3 4 0 4-1.5 0-2.2-.8-2.5-1.5" /></>,
  rain: <><path d="M6 15h11.5a3.5 3.5 0 0 0 .4-7A6 6 0 0 0 6.6 6.2 4.4 4.4 0 0 0 6 15Z" /><path d="m8 18-1 3m6-3-1 3m6-3-1 3" /></>,
  thermometer: <><path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" /><path d="M12 9v8" /></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

const navItems: { label: string; sub: string; icon: IconName }[] = [
  { label: "National Situation", sub: "Master overview", icon: "grid" },
  { label: "Weather & Forecasts", sub: "Models & observations", icon: "cloud" },
  { label: "Radar & Satellite", sub: "Mosaics & imagery", icon: "radar" },
  { label: "Hydrology & Flood", sub: "Rivers & catchments", icon: "waves" },
  { label: "Geophysical & Hazards", sub: "Seismic & risk", icon: "activity" },
  { label: "AWS & Observatories", sub: "Network health", icon: "radio" },
  { label: "Incident Management", sub: "Tickets & workflows", icon: "ticket" },
  { label: "System Health", sub: "Infrastructure", icon: "server" },
];

const alerts = [
  { level: "SEVERE", color: "red", title: "Extreme Heatwave Warning", place: "Sibi, Jacobabad & Dadu Districts", meta: "Issued 14 min ago", temp: "49°C" },
  { level: "WARNING", color: "amber", title: "GLOF Risk — Elevated", place: "Hunza & Upper Chitral Valleys", meta: "Updated 32 min ago", temp: "72%" },
  { level: "WARNING", color: "amber", title: "Riverine Flood Watch", place: "Indus — Guddu to Sukkur reach", meta: "Updated 48 min ago", temp: "Rising" },
  { level: "ADVISORY", color: "blue", title: "Dust Storm Advisory", place: "South Punjab & Eastern Sindh", meta: "Issued 1 hr ago", temp: "65 km/h" },
];

function Panel({ title, kicker, children, className = "", action }: { title: string; kicker?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-header">
        <div>
          {kicker && <span className="eyebrow">{kicker}</span>}
          <h2>{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function PakistanMap() {
  const stations = [
    [250, 81, "Gilgit", "cold"], [287, 121, "Islamabad", "ok"], [222, 150, "Lahore", "hot"],
    [170, 168, "Quetta", "ok"], [229, 229, "Sukkur", "warn"], [207, 295, "Karachi", "ok"],
    [286, 209, "Multan", "hot"], [309, 166, "Peshawar", "ok"],
  ];
  return (
    <div className="map-stage">
      <svg className="map-grid" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#f0f0f0" strokeWidth="1" /></pattern>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="country" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fafafa" /><stop offset="1" stopColor="#f5f5f5" /></linearGradient>
        </defs>
        <rect width="600" height="380" fill="url(#grid)" />
        <g opacity=".35" fill="none" stroke="#a3a3a3" strokeWidth=".8">
          <path d="M0 68h600M0 315h600M80 0v380M510 0v380" />
          <path d="M12 325C99 283 132 283 195 298s126 40 184 14 104-4 203-41" />
        </g>
        <g transform="translate(42 2)">
          <path className="pakistan-shape" d="M234 29 257 47 278 45 286 63 309 74 294 96 305 116 290 139 318 155 305 181 326 206 304 220 292 247 273 260 266 291 238 315 207 309 190 289 168 287 148 263 127 259 115 236 91 225 107 196 96 171 116 150 122 123 144 115 151 83 176 77 186 55 211 53Z" />
          <g className="province-lines">
            <path d="M151 83 196 104 234 93 294 96M122 123l74-19 15 65-95-19M211 169l79-30M211 169l-43 118M211 169l93 51M168 287l105-27M107 196l61 91" />
          </g>
          <path d="M149 263c25-20 46-12 55 8 7 18 20 26 47 27" fill="none" stroke="#26a0da" strokeWidth="5" opacity=".65" />
          <path d="M151 263c25-20 46-12 55 8 7 18 20 26 47 27" fill="none" stroke="#80d7ff" strokeWidth="1.2" />
          <g className="storm-cell">
            <path d="M207 121c13-18 45-20 57 3s-4 41-26 42-42-24-31-45Z" />
            <path d="M214 126c11-10 30-12 42 2" />
          </g>
          {stations.map(([x, y, , status], i) => (
            <g className={`station station-${status}`} transform={`translate(${x},${y})`} key={i}>
              <circle r="9" /><circle r="3" />
            </g>
          ))}
          <g className="wind-arrows">
            {[[135,130],[165,142],[198,191],[247,184],[270,226],[192,239],[242,110]].map(([x,y], i) => <path key={i} d={`M${x} ${y}l16 ${i % 2 ? -7 : 4}m-5-5 5 5-7 2`} />)}
          </g>
        </g>
        <g className="map-labels">
          <text x="236" y="68">GILGIT-BALTISTAN</text><text x="330" y="142">KHYBER PAKHTUNKHWA</text>
          <text x="270" y="186">PUNJAB</text><text x="159" y="186">BALOCHISTAN</text><text x="251" y="278">SINDH</text>
          <text className="city" x="336" y="166">ISLAMABAD</text><text className="city" x="237" y="315">KARACHI</text>
        </g>
      </svg>
      <div className="absolute bottom-3 right-3 z-10 max-w-[calc(100%-24px)] rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[10px] text-black" aria-label="National map legend"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />284 Online stations</div><div className="mt-2 flex items-center gap-2"><span className="h-2 w-2 shrink-0 border border-amber-400" />3 Active warnings</div></div>
      <div className="map-tools">
        <button aria-label="Map layers"><Icon name="layers" /></button>
        <button aria-label="Expand map"><Icon name="maximize" /></button>
      </div>
      <div className="map-condition">
        <span className="condition-icon"><Icon name="wind" size={17} /></span>
        <div><strong>WNW 18 km/h</strong><small>National mean wind</small></div>
      </div>
    </div>
  );
}

function Sparkline() {
  return (
    <svg className="river-chart" viewBox="0 0 400 128" preserveAspectRatio="none">
      <defs><linearGradient id="riverFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#1b9cde" stopOpacity=".35" /><stop offset="1" stopColor="#1b9cde" stopOpacity="0" /></linearGradient></defs>
      {[25, 60, 95].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#1a3046" strokeDasharray="3 4" />)}
      <path d="M0 100C28 99 39 83 67 87s41-22 67-15 37 18 61 9 33-31 58-25 35-13 60-5 47-14 87-31V128H0Z" fill="url(#riverFill)" />
      <path d="M0 100C28 99 39 83 67 87s41-22 67-15 37 18 61 9 33-31 58-25 35-13 60-5 47-14 87-31" fill="none" stroke="#49bdf5" strokeWidth="2" />
      <line x1="0" y1="34" x2="400" y2="34" stroke="#f4a340" strokeDasharray="5 5" />
      <circle cx="400" cy="20" r="4" fill="#49bdf5" />
    </svg>
  );
}

export default function App() {
  const [isLive, setIsLive] = useState(true);
  const [emergency, setEmergency] = useState(false);
  const [mapTime, setMapTime] = useState("LIVE");
  const [activeNav, setActiveNav] = useState(7);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>PMD</span><i /></div>
          <div><strong>PMDNOC</strong><small>OPERATIONS CENTER</small></div>
        </div>
        <div className="nav-section-label">COMMAND MODULES</div>
        <nav>
          {navItems.map((item, i) => (
            <button key={item.label} className={`nav-item ${activeNav === i ? "active" : ""}`} onClick={() => setActiveNav(i)}>
              <span className="nav-icon"><Icon name={item.icon} size={18} /></span>
              <span><strong>{item.label}</strong><small>{item.sub}</small></span>
              {i === 0 && <i className="live-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="system-ring"><span>98%</span></div>
          <div><strong>System integrity</strong><small><i /> All services nominal</small></div>
        </div>
      </aside>

      <div className="workspace">
        <Suspense fallback={<div className="grid flex-1 place-items-center bg-white text-sm text-black" role="status">Loading operations workspace…</div>}>
        {activeNav === 7 ? <SystemInfrastructure /> : activeNav === 6 ? <IncidentManagement /> : activeNav === 5 ? <ObservatoriesHealth /> : activeNav === 4 ? <GeophysicalHazards /> : activeNav === 3 ? <HydrologyFlood /> : activeNav === 2 ? <RadarSatellite /> : activeNav === 1 ? <WeatherForecast /> : <>
        <header className="topbar">
          <div className="title-block">
            <span className="eyebrow">NATIONAL COMMAND VIEW</span>
            <div><h1>Situation Awareness</h1><span className="status-badge"><i />All Feeds Active</span></div>
          </div>
          <div className="global-filters">
            <label><span>REGION</span><button>All Pakistan <Icon name="chevron" size={14} /></button></label>
            <label><span>STATION / DISTRICT</span><button><Icon name="search" size={14} /> All stations <Icon name="chevron" size={14} /></button></label>
            <label><span>TIME RANGE</span><button>Real-time <Icon name="chevron" size={14} /></button></label>
            <button className={`refresh-button ${isLive ? "live" : ""}`} onClick={() => setIsLive(!isLive)}>
              <Icon name={isLive ? "pause" : "play"} size={14} /><span>{isLive ? "LIVE REFRESH" : "RESUME"}</span>
            </button>
          </div>
          <div className="top-actions">
            <button className={`emergency ${emergency ? "on" : ""}`} onClick={() => setEmergency(!emergency)}><Icon name="shield" size={16} /><span>EMERGENCY</span></button>
            <button className="icon-button notification" aria-label="Notifications"><Icon name="bell" size={18} /><i>3</i></button>
            <button className="icon-button" aria-label="Settings"><Icon name="settings" size={18} /></button>
            <button className="profile"><span>AK</span><div><strong>Ali Khan</strong><small>Senior Operator</small></div><Icon name="chevron" size={13} /></button>
          </div>
        </header>

        <main className="dashboard">
          <div className="column left-column">
            <Panel title="Active National Alerts" kicker="04 OPEN WARNINGS" action={<button className="text-action">View all</button>}>
              <div className="alert-list">
                {alerts.map(alert => (
                  <article className="alert-item" key={alert.title}>
                    <div className={`severity ${alert.color}`}>{alert.level}</div>
                    <div className="alert-content"><strong>{alert.title}</strong><span><Icon name="pin" size={11} />{alert.place}</span><small>{alert.meta}</small></div>
                    <b>{alert.temp}</b>
                  </article>
                ))}
              </div>
            </Panel>
            <Panel title="Key Meteorological KPIs" kicker="NATIONAL AGGREGATES" className="kpi-panel">
              <div className="kpi-grid">
                <article><span className="kpi-icon orange"><Icon name="thermometer" /></span><small>AVG. TEMPERATURE</small><strong>31.8<sup>°C</sup></strong><em className="up">↑ 2.4° vs norm</em></article>
                <article><span className="kpi-icon blue"><Icon name="rain" /></span><small>24H RAINFALL</small><strong>18.6<sup>mm</sup></strong><em>National mean</em></article>
                <article><span className="kpi-icon purple"><Icon name="activity" /></span><small>SEISMIC EVENTS</small><strong>07</strong><em>M2.5+ last 24h</em></article>
                <article><span className="kpi-icon green"><Icon name="radio" /></span><small>AWS ONLINE</small><strong>284<sup>/300</sup></strong><em className="online">94.7% operational</em></article>
              </div>
            </Panel>
          </div>

          <div className="column center-column">
            <Panel title="National Common Operating Picture" kicker="LIVE GIS · 20:42:16 PKT" className="map-panel" action={<div className="map-pills"><button className="active">Weather</button><button>Hazards</button><button>Stations</button></div>}>
              <PakistanMap />
              <div className="timeline">
                <button className="play-button" onClick={() => setIsLive(!isLive)}><Icon name={isLive ? "pause" : "play"} size={14} /></button>
                <div className="time-track">
                  <div className="track-line"><i style={{ width: mapTime === "LIVE" ? "100%" : mapTime === "-3H" ? "70%" : "38%" }} /></div>
                  {["-6H", "-3H", "-1H", "LIVE"].map(time => <button className={mapTime === time ? "active" : ""} key={time} onClick={() => setMapTime(time)}>{time}</button>)}
                </div>
                <span className="timeline-date">15 JUN 2025 <b>20:42 PKT</b></span>
              </div>
            </Panel>
            <div className="center-stats">
              <article><span>PRECIPITATION CELLS</span><strong>12</strong><small>3 intensifying</small></article>
              <article><span>ACTIVE STORM TRACKS</span><strong>04</strong><small>Max 62 km/h</small></article>
              <article><span>DATA OBSERVATIONS</span><strong>1.8M</strong><small>Past 24 hours</small></article>
              <article><span>LAST INGEST</span><strong>4.2s</strong><small>Pipeline latency</small></article>
            </div>
          </div>

          <div className="column right-column">
            <Panel title="River Discharge" kicker="HYDROLOGICAL HIGHLIGHTS" action={<select aria-label="Select river"><option>Indus Basin</option><option>Jhelum</option></select>}>
              <div className="river-summary"><div><small>CURRENT FLOW</small><strong>412.8<sup>K cusecs</sup></strong></div><span>+8.2% <small>24H</small></span></div>
              <div className="chart-wrap"><Sparkline /><span className="threshold">WARNING THRESHOLD</span></div>
              <div className="river-sites">
                <div><span><i className="green" />Tarbela</span><strong>Normal</strong><small>136.2K</small></div>
                <div><span><i className="amber" />Guddu</span><strong>Rising</strong><small>198.6K</small></div>
                <div><span><i className="green" />Sukkur</span><strong>Normal</strong><small>78.0K</small></div>
              </div>
            </Panel>
            <Panel title="Quick Feed Status" kicker="NETWORK AVAILABILITY" className="feeds-panel" action={<span className="uptime">99.2% UPTIME</span>}>
              <div className="feed-list">
                {[
                  ["Radar network", "8 / 8 feeds", 100, "Live"],
                  ["Satellite loops", "6 / 6 channels", 96, "Live"],
                  ["Lightning detection", "14 / 16 sensors", 88, "Degraded"],
                  ["Telemetry pipelines", "42 / 43 active", 97, "Live"],
                ].map(([name, detail, pct, state]) => (
                  <div className="feed" key={name as string}>
                    <div><strong>{name}</strong><span className={state === "Degraded" ? "warn" : ""}><i />{state}</span></div>
                    <small>{detail}</small>
                    <div className="progress"><i style={{ width: `${pct}%` }} className={state === "Degraded" ? "warn" : ""} /></div>
                  </div>
                ))}
              </div>
              <div className="feed-footer"><span><i />Last health check</span><strong>20:42:08 PKT</strong></div>
            </Panel>
            <div className="observation-strip">
              <span><Icon name="cloud" size={18} /></span>
              <div><small>NEXT SYNOPTIC OBSERVATION</small><strong>21:00 PKT</strong></div>
              <b>17:44</b>
            </div>
          </div>
        </main>
        <footer className="statusbar">
          <span><i />PMDNOC CORE <b>ONLINE</b></span><span>DATA LATENCY <b>4.2 SEC</b></span><span>NETWORK <b>1.8 GBPS</b></span>
          <span className="coordinates">33.6844° N, 73.0479° E · ISLAMABAD</span>
          <span>UTC+5 · <b>15 JUN 2025 20:42:16</b></span>
        </footer>
        </>}
        </Suspense>
      </div>
    </div>
  );
}
