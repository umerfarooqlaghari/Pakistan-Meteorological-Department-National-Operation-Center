import { useEffect, useRef, useState, type ReactNode } from "react";

const stations = [
  { name: "Islamabad", x: 365, y: 200, temp: 31, humidity: 64, rain: 8.4, wind: 12, lat: 33.68, lon: 73.05 },
  { name: "Lahore", x: 395, y: 280, temp: 38, humidity: 48, rain: 2.1, wind: 9, lat: 31.52, lon: 74.36 },
  { name: "Karachi", x: 245, y: 493, temp: 34, humidity: 78, rain: 0.4, wind: 21, lat: 24.86, lon: 67.01 },
  { name: "Quetta", x: 190, y: 320, temp: 29, humidity: 23, rain: 0, wind: 16, lat: 30.18, lon: 66.98 },
  { name: "Peshawar", x: 320, y: 190, temp: 35, humidity: 42, rain: 3.2, wind: 14, lat: 34.02, lon: 71.52 },
  { name: "Gilgit", x: 413, y: 115, temp: 22, humidity: 55, rain: 12.6, wind: 8, lat: 35.92, lon: 74.31 },
  { name: "Multan", x: 333, y: 345, temp: 41, humidity: 34, rain: 0.8, wind: 11, lat: 30.16, lon: 71.52 },
  { name: "Sukkur", x: 280, y: 414, temp: 43, humidity: 29, rain: 0, wind: 17, lat: 27.71, lon: 68.85 },
];
const layers = ["Temperature Grid", "Rainfall Accumulation", "Snowfall Layers", "Wind Vector Streams", "Cloud Cover %", "Atmospheric Visibility"];
const colors = ["#fb923c", "#34d399", "#a5b4fc", "#38bdf8", "#cbd5e1", "#facc15"];
const outline = "M420 60 445 77 471 69 490 88 480 110 454 126 443 153 418 172 416 202 443 228 430 254 416 276 407 312 381 337 365 369 340 390 332 424 313 445 303 482 277 508 247 505 230 492 204 495 190 477 154 481 134 461 103 454 87 426 67 412 80 389 72 367 100 348 113 315 144 310 169 285 201 286 225 265 230 231 250 213 263 186 281 168 299 143 319 129 326 105 355 97 369 72 390 82Z";

function Card({ title, label, children, extra, className = "" }: { title: string; label: string; children: ReactNode; extra?: ReactNode; className?: string }) {
  return <section className={`min-h-0 overflow-hidden rounded-sm border border-neutral-200 bg-white ${className}`}><div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3"><div><p className="mb-1 text-[9px] font-semibold tracking-[.16em] text-black">{label}</p><h2 className="text-[13px] font-semibold text-black">{title}</h2></div>{extra}</div>{children}</section>;
}

function Trend({ cityIndex, hour, model }: { cityIndex: number; hour: number; model: string }) {
  const base = stations[cityIndex].temp + (model === "Local WRF" ? 1 : model === "GFS" ? -1 : 0);
  return <><div className="flex justify-between px-4 pt-4"><div><p className="text-[10px] text-black">NEXT 72 HOURS</p><p className="mt-1 font-mono text-2xl text-black">{base + Math.round(Math.sin(hour / 12) * 3)}°<span className="ml-2 text-xs text-black">C</span></p></div><div className="text-right text-[10px] leading-5 text-black">HIGH <b className="text-black">{base + 4}°</b><br />LOW <b className="text-black">{base - 9}°</b></div></div><svg viewBox="0 0 360 180" className="h-[clamp(120px,19vh,250px)] w-full" role="img" aria-label="72-hour temperature high, low, and precipitation probability trends">
    {[30, 65, 100, 135].map((height, index) => <g key={height}><line x1="35" y1={height} x2="340" y2={height} stroke="#26354b" strokeDasharray="2 4" /><text x="6" y={height + 3} fill="#718198" fontSize="8">{base + 6 - index * 5}°</text><text x="344" y={height + 3} fill="#718198" fontSize="7">{90 - index * 25}%</text></g>)}
    <path d={`M35 ${57 + cityIndex} Q65 18 87 49T137 65T187 40T237 57T287 37T337 52`} fill="none" stroke="#fb923c" strokeWidth="2" />
    <path d="M35 116Q65 90 87 105T137 117T187 99T237 109T287 93T337 109" fill="none" stroke="#38bdf8" strokeWidth="2" />
    <path d={`M35 139Q65 140 87 115T137 ${90 - cityIndex * 4}T187 106T237 119T287 76T337 97`} fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1={35 + hour / 72 * 302} y1="20" x2={35 + hour / 72 * 302} y2="147" stroke="#94a3b8" strokeDasharray="3 3" />
    {[0, 12, 24, 36, 48, 60, 72].map((time, index) => <text key={time} x={35 + index * 50} y="166" fill="#718198" fontSize="8" textAnchor="middle">+{time}h</text>)}
  </svg><div className="flex justify-center gap-4 pb-3 text-[9px]"><span className="text-orange-600">━ High</span><span className="text-sky-600">━ Low</span><span className="text-emerald-600">┄ Precip. probability</span></div></>;
}

export default function WeatherForecast() {
  const [cityIndex, setCityIndex] = useState(0);
  const [model, setModel] = useState("ECMWF");
  const [hour, setHour] = useState(24);
  const [date, setDate] = useState("2025-06-15T00:00");
  const [enabled, setEnabled] = useState([true, false, false, true, false, false]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [summary, setSummary] = useState("");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const mapRef = useRef<HTMLElement>(null);
  const station = stations[cityIndex];
  const temp = station.temp + Math.round(Math.sin(hour / 12) * 3) + (model === "GFS" ? -1 : model === "Local WRF" ? 1 : 0);
  const validTime = new Date(new Date(`${date}Z`).getTime() + hour * 3600000);
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setHour(previous => previous >= 72 ? 0 : previous + 1), 1000 / speed); return () => window.clearInterval(timer); }, [playing, speed]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  const exportForecast = () => { const url = URL.createObjectURL(new Blob([`city,model,run,lead_hours,temperature_c,humidity_pct,rainfall_mm,wind_knots\n${station.name},${model},${date},${hour},${temp},${station.humidity},${station.rain},${station.wind}\n`], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = `PMDNOC-${station.name}-${model}-${hour}h.csv`; link.click(); URL.revokeObjectURL(url); };
  const control = "rounded-sm border border-neutral-200 bg-white px-2 py-1.5 text-[11px] text-black focus:outline-2 focus:outline-black";
  return <div className="flex min-h-0 flex-1 flex-col bg-white text-black">
    <header className="flex min-h-[86px] flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
      <div><p className="mb-1.5 text-[9px] tracking-[.18em] text-black">FORECAST OPERATIONS / 02</p><h1 className="text-xl font-semibold">Weather & Forecasts</h1><p className="mt-1 text-[10px] text-black">Model: <b className="text-black">{model}</b> · Run {date.slice(11,13)}Z <span className="ml-2 text-black">● Ready</span></p></div>
      <div className="flex flex-wrap items-end gap-3"><label className="grid gap-1 text-[9px] tracking-wider text-black">REGION / CITY<select className={`${control} min-w-32`} value={cityIndex} onChange={event => setCityIndex(Number(event.target.value))}>{stations.map((city, index) => <option key={city.name} value={index}>{city.name}</option>)}</select></label><label className="grid gap-1 text-[9px] tracking-wider text-black">FORECAST MODEL<select className={`${control} min-w-28`} value={model} onChange={event => setModel(event.target.value)}>{["NWP", "GFS", "ECMWF", "Local WRF"].map(name => <option key={name}>{name}</option>)}</select></label><label className="grid gap-1 text-[9px] tracking-wider text-black">LEAD TIME<select className={control} value={hour} onChange={event => setHour(Number(event.target.value))}>{Array.from({ length: 73 }, (_, index) => <option key={index} value={index}>+{String(index).padStart(2,"0")}h</option>)}</select></label><label className="grid gap-1 text-[9px] tracking-wider text-black">MODEL RUN / UTC<input className={control} type="datetime-local" value={date} required onChange={event => { if(event.target.value) setDate(event.target.value); }} /></label></div>
      <div className="relative flex gap-2"><button className={control} onClick={exportForecast}>↓ Export</button><button className={control} aria-label="Expand forecast map" onClick={() => setExpanded(true)}>⛶</button><button className={`${control} flex items-center gap-2`} aria-expanded={notifications} onClick={() => setNotifications(!notifications)}>Alerts <span className="rounded-sm bg-neutral-100 px-1 text-black">2</span></button>{notifications && <div className="absolute right-0 top-10 z-50 w-72 border border-neutral-200 bg-white p-4 text-xs shadow-xl"><b className="text-black">Forecast advisories · sample data</b><p className="mt-3">Heat stress likely across southern Punjab and Sindh.</p><p className="mt-3 text-black">Convective rainfall over upper KP and Gilgit-Baltistan.</p></div>}</div>
    </header>
    <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-2 text-[9px] tracking-wider text-black"><span>MODEL GUIDANCE <span className="mx-3 text-black">/</span> DETERMINISTIC FORECAST <span className="mx-3 text-black">/</span> PAKISTAN DOMAIN</span><span><span className="text-black">SIMULATED DATA</span> · 0.25° RESOLUTION · {model} {date.slice(11,13)}Z</span></div>
    <main className="grid min-h-0 flex-1 grid-cols-[30fr_45fr_25fr] gap-3 overflow-auto p-3">
      <div className="flex min-w-0 flex-col gap-3">
        <Card title="Atmospheric Vertical Profiles" label="UPPER-AIR / SOUNDING ANALYSIS" extra={<span className="text-[9px] text-black">{station.name}</span>} className="flex-1">
          <div className="flex justify-between px-4 pt-3 text-[10px] text-black"><span>Altitude profile · +{hour}h</span><span>Surface: {1008 - cityIndex * 3} hPa</span></div>
          <svg viewBox="0 0 360 320" className="h-[clamp(170px,29vh,450px)] w-full" role="img" aria-label={`Atmospheric temperature and dew point profile for ${station.name}`}>
            {[45, 88, 131, 174, 217, 260].map((position, index) => <g key={position}><line x1="45" y1={position} x2="303" y2={position} stroke="#2b3a50" strokeDasharray="2 3" /><text x="12" y={position + 3} fill="#718198" fontSize="9">{[200,300,500,700,850,1000][index]}</text><text x="314" y={position + 3} fill="#718198" fontSize="8">{[12,9,5.5,3,1.5,0][index]} km</text></g>)}
            {[-50,-30,-10,10,30,50].map((value,index) => <g key={value}><line x1={55 + index * 43} y1="268" x2={120 + index * 43} y2="35" stroke="#243247" /><text x={55 + index * 43} y="288" fill="#718198" fontSize="9">{value}°</text></g>)}
            <path d={`M${245 + cityIndex * 2} 260 239 240 219 220 226 201 209 179 191 158 174 137 167 113 143 91 124 70 109 45`} fill="none" stroke="#fb923c" strokeWidth="2.5" />
            <path d="M205 260 194 240 179 220 187 201 162 179 149 158 121 137 124 113 108 91 89 70 76 45" fill="none" stroke="#34d399" strokeWidth="2" />
            <text x="150" y="312" fill="#718198" fontSize="9">TEMPERATURE (°C)</text>
          </svg>
          <div className="flex justify-center gap-5 text-[10px]"><span className="text-orange-600">━ Temperature</span><span className="text-emerald-600">━ Dew point</span></div>
          <div className="mx-4 my-4 grid grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200 py-3 text-center"><div><p className="text-[9px] text-black">CAPE</p><p className="mt-1 font-mono text-sm">{840 + cityIndex * 115}<span className="text-[9px] text-black"> J/kg</span></p></div><div><p className="text-[9px] text-black">LIFTED INDEX</p><p className="mt-1 font-mono text-sm text-black">−{(2.4 + cityIndex * .2).toFixed(1)}°C</p></div><div><p className="text-[9px] text-black">FREEZING LEVEL</p><p className="mt-1 font-mono text-sm">4,250<span className="text-[9px] text-black"> m</span></p></div></div>
        </Card>
        <Card title="Parameter Selector" label="MAP & MODEL LAYERS" extra={<span className="text-[9px] text-black">{enabled.filter(Boolean).length} active</span>}>
          <div className="grid gap-1 p-3">{layers.map((layer,index) => <button key={layer} aria-pressed={enabled[index]} onClick={() => setEnabled(previous => previous.map((value, layerIndex) => layerIndex === index ? !value : value))} className={`flex items-center justify-between rounded-sm border px-3 py-2 text-[11px] transition-colors ${enabled[index] ? "border-neutral-300 bg-neutral-100 text-black" : "border-transparent text-black hover:bg-neutral-100"}`}><span className="flex items-center gap-3"><svg width="12" height="12"><circle cx="6" cy="6" r="4" fill={colors[index]} /></svg>{layer}</span><span className={`h-3 w-6 rounded-full p-0.5 ${enabled[index] ? "bg-neutral-100" : "bg-neutral-100"}`}><span className={`block h-2 w-2 rounded-full bg-white ${enabled[index] ? "ml-3" : ""}`} /></span></button>)}</div>
        </Card>
      </div>
      <section ref={mapRef} className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-sm border border-neutral-200 bg-white ${expanded ? "fixed inset-4 z-50 shadow-2xl" : ""}`}>
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3"><div><p className="mb-1 text-[9px] tracking-[.16em] text-black">SPATIAL FORECAST / PAKISTAN DOMAIN</p><h2 className="text-[13px] font-semibold">Meteorological Forecast Map</h2></div><button className={control} onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Close expanded map" : "Expand map"}>{expanded ? "✕ Close" : "⛶"}</button></div>
        <div className="relative min-h-[300px] flex-1 overflow-hidden bg-white">
          <div className="absolute left-3 top-3 z-10 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[9px] text-black"><b className="text-black">{model}</b> · +{String(hour).padStart(2,"0")}h <span className="mx-2 text-black">|</span> {enabled[0] ? "2m temperature" : "Regional base map"}</div>
          <svg viewBox="0 0 600 580" className="h-full w-full" role="group" aria-label="Interactive Pakistan forecast map; select a city marker for local metrics">
            <defs><pattern id="forecastGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#1b2a3d" strokeWidth=".7" /></pattern><linearGradient id="forecastHeat" x1=".7" y1="0" x2=".3" y2="1"><stop stopColor="#3a86ef" /><stop offset=".3" stopColor="#3caaaa" /><stop offset=".55" stopColor="#c6a64b" /><stop offset=".8" stopColor="#d66538" /><stop offset="1" stopColor="#b44238" /></linearGradient><clipPath id="forecastCountry"><path d={outline} /></clipPath></defs>
            <rect width="600" height="580" fill="url(#forecastGrid)" />
            <g fill="#41536a" fontSize="10" letterSpacing="2"><text x="88" y="175">AFGHANISTAN</text><text x="38" y="320">IRAN</text><text x="462" y="370">INDIA</text><text x="490" y="65">CHINA</text><text x="130" y="558">ARABIAN SEA</text></g>
            <path d={outline} fill={enabled[0] ? "url(#forecastHeat)" : "#20334a"} fillOpacity=".7" stroke="#7797a9" strokeWidth="1.2" />
            <g clipPath="url(#forecastCountry)">
              {Array.from({ length: 22 }, (_,index) => <path key={index} d={`M40 ${60 + index * 23} Q150 ${30 + index * 24} 260 ${75 + index * 23} T500 ${48 + index * 25}`} fill="none" stroke="#d7e4da" opacity=".12" strokeWidth=".8" />)}
              <path d="M330 150 345 214 371 263 329 306 299 351 283 401 262 447 246 492" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity=".65" />
              <path d="M201 286 260 312 329 306M283 401 205 390M345 214 418 202" fill="none" stroke="#d6e2e7" strokeDasharray="3 4" opacity=".35" />
              {enabled[1] && <g fill="#34d399" opacity=".55"><ellipse cx="357" cy="184" rx="54" ry="30" /><ellipse cx="413" cy="126" rx="36" ry="25" /></g>}
              {enabled[2] && <path d="M350 70 490 70 464 145 389 119Z" fill="#dbeafe" opacity=".75" />}
              {enabled[4] && <g fill="#cbd5e1" opacity=".35"><ellipse cx="365" cy="208" rx="94" ry="32" /><ellipse cx="261" cy="405" rx="80" ry="22" /></g>}
              {enabled[5] && <g fill="none" stroke="#facc15" strokeDasharray="3 4" opacity=".6"><circle cx="333" cy="345" r="58" /><circle cx="245" cy="493" r="42" /></g>}
            </g>
            {enabled[3] && <g className={playing ? "forecast-streams" : ""} fill="none" stroke="#9adcf4" opacity=".5" strokeWidth="1" strokeDasharray="18 12">{Array.from({length: 14}, (_,index) => <path key={index} d={`M${90 + index % 3 * 60} ${115 + index * 28} Q${230 + index % 2 * 70} ${70 + index * 28} ${425 + index % 2 * 35} ${150 + index * 25}`} />)}</g>}
            <g fill="#deebed" fontSize="8" letterSpacing="1" opacity=".65"><text x="376" y="99">GILGIT-BALTISTAN</text><text x="263" y="230">KP</text><text x="350" y="315">PUNJAB</text><text x="139" y="365">BALOCHISTAN</text><text x="238" y="455">SINDH</text></g>
            {stations.map((city,index) => <g key={city.name} transform={`translate(${city.x},${city.y})`} role="button" tabIndex={0} aria-label={`Select ${city.name} forecast`} onClick={() => setCityIndex(index)} onKeyDown={event => { if(event.key === "Enter" || event.key === " ") {event.preventDefault(); setCityIndex(index);} }} className="forecast-marker cursor-pointer outline-none"><title>{city.name} · {city.temp}°C · Click for forecast</title><circle r={cityIndex === index ? 12 : 8} fill="#0b1729" fillOpacity=".65" stroke={cityIndex === index ? "#38bdf8" : "#b7c8d4"} strokeWidth={cityIndex === index ? 2 : 1} /><circle r="2.5" fill={cityIndex === index ? "#38bdf8" : "#f1f5f9"} /><text x="15" y="3" fill="#e2e8f0" fontSize="9">{city.name}</text><text x="15" y="16" fill="#cbd5e1" fontSize="8">{city.temp + Math.round(Math.sin(hour / 12) * 3)}°</text></g>)}
          </svg>
          <div className="absolute bottom-14 left-3 right-3 flex items-center justify-between gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-3"><div><p className="text-xs font-semibold text-black">{station.name} <span className="ml-1 text-[9px] font-normal text-black">POINT FORECAST</span></p><p className="mt-1 font-mono text-[9px] text-black">{station.lat}° N / {station.lon}° E</p></div><div className="text-right"><b className="font-mono text-xl text-black">{temp}°C</b><p className="text-[9px] text-black">{station.rain} mm · {station.wind} kt · RH {station.humidity}%</p></div></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 text-[9px] text-black"><span>{enabled[0] ? "TEMP °C" : "BASE MAP"}</span><div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-600" /><span>10</span><span>25</span><span>40</span><span>50+</span></div>
        </div>
        <div className="border-t border-neutral-200 bg-white px-4 py-3"><div className="mb-3 flex items-center justify-between"><div className="flex gap-1.5"><button className={control} onClick={() => setHour(Math.max(0,hour-1))} aria-label="Step back one hour">−1h</button><button className={`${control} min-w-16 border-neutral-300 text-black`} onClick={() => setPlaying(!playing)}>{playing ? "Ⅱ Pause" : "▶ Play"}</button><button className={control} onClick={() => setHour(Math.min(72,hour+1))} aria-label="Step forward one hour">+1h</button><button className={control} onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)} aria-label="Change playback speed">» {speed}×</button></div><span className="font-mono text-[10px] text-black">+{String(hour).padStart(2,"0")}h</span></div><input aria-label="Forecast timeline lead time" className="h-1 w-full cursor-pointer accent-black" type="range" min="0" max="72" value={hour} onChange={event => setHour(Number(event.target.value))} /><div className="mt-2 flex justify-between text-[9px] text-black">{[0,12,24,36,48,60,72].map(time => <button key={time} className={hour === time ? "text-black" : "hover:text-black"} onClick={() => setHour(time)}>+{String(time).padStart(2,"0")}h</button>)}</div><div className="mt-3 flex justify-between border-t border-neutral-200 pt-2 text-[9px] text-black"><span>RUN {date.slice(11,13)}Z <span className="ml-2 text-black">● Complete</span></span><span>VALID {validTime.toLocaleString("en-GB",{timeZone:"Asia/Karachi",month:"short",day:"2-digit",hour:"2-digit",minute:"2-digit"})} PKT</span></div></div>
      </section>
      <div className="flex min-w-0 flex-col gap-3">
        <Card title="Point Forecast & Trends" label={`${station.name.toUpperCase()} / 72H GUIDANCE`}><Trend cityIndex={cityIndex} hour={hour} model={model} /><div className="grid grid-cols-3 border-t border-neutral-200 py-3 text-center"><div><p className="text-[9px] text-black">RAIN / 24H</p><p className="mt-1 font-mono text-sm text-black">{station.rain} <small className="text-[9px]">mm</small></p></div><div><p className="text-[9px] text-black">WIND</p><p className="mt-1 font-mono text-sm">{station.wind} <small className="text-[9px] text-black">kt</small></p></div><div><p className="text-[9px] text-black">HUMIDITY</p><p className="mt-1 font-mono text-sm">{station.humidity}<small className="text-[9px] text-black">%</small></p></div></div></Card>
        <Card title="Meteorological Summary" label="BULLETIN / FORECASTER DESK" className="flex-1" extra={<button className="text-[10px] text-black" onClick={() => {setEditing(!editing); setSaved(false);}}>{editing ? "Cancel" : "Edit"}</button>}>
          <div className="p-4"><div className="mb-4 flex justify-between text-[9px]"><span className="rounded-sm border border-neutral-300 bg-neutral-100 px-2 py-1 text-black">HEAT ADVISORY</span><span className="py-1 text-black">{model} · {date.slice(11,13)}Z</span></div>
            {editing ? <><textarea aria-label="Forecaster summary" className="min-h-36 w-full rounded-sm border border-neutral-200 bg-white p-2 text-xs leading-6 text-black" value={summary} onChange={event => setSummary(event.target.value)} placeholder="Enter regional forecast summary…" /><button className={`${control} mt-2`} onClick={() => {setEditing(false); setSaved(true);}}>Save bulletin</button></> : <p className="text-[11px] leading-[1.9] text-black">{summary || `Hot and dry conditions persist across southern Punjab and Sindh. ${station.name} is expected to reach ${temp}°C at +${hour}h. Isolated convective activity is likely over upper Khyber Pakhtunkhwa and Gilgit-Baltistan. Southwesterly flow continues along the coastal belt.`}</p>}
            {saved && <p className="mt-2 text-[9px] text-black" role="status">Bulletin saved for this session.</p>}
            <div className="mt-5 border-t border-neutral-200 pt-3"><p className="mb-3 text-[9px] tracking-wider text-black">REGIONAL WIND / HUMIDITY</p>{[["Northern region","NW","08–14","62"],["Central plains","SW","12–18","48"],["Southern coast","SW","18–24","78"]].map(([region,dir,wind,rh]) => <div key={region} className="flex justify-between border-b border-neutral-200 py-2 text-[10px]"><span className="text-black">{region}</span><span className="font-mono text-black">{dir} {wind} kt <span className="ml-2 text-black">{rh}%</span></span></div>)}</div><p className="mt-4 text-[9px] leading-4 text-black">Operator review required before dissemination.<br />Prototype guidance · not for operational use.</p>
          </div>
        </Card>
        <div className="flex items-center justify-between rounded-sm border border-neutral-200 bg-white p-3 text-[9px]"><span className="text-black">MODEL CONSISTENCY</span><span className="text-black">● 94.2% agreement</span></div>
      </div>
    </main>
    <footer className="flex justify-between border-t border-neutral-200 px-4 py-2 font-mono text-[9px] text-black"><span><span className="text-black">●</span> FORECAST ENGINE READY <span className="mx-3">|</span> {enabled.filter(Boolean).length} LAYERS ACTIVE</span><span>{station.lat}° N, {station.lon}° E · {station.name.toUpperCase()} <span className="mx-3">|</span> SIMULATED / DEMO</span></footer>
  </div>;
}
