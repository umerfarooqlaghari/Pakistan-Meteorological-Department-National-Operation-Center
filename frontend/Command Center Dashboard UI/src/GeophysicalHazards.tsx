import { useEffect, useRef, useState, type ReactNode } from "react"

type HazardType = "Seismic" | "Heatwave" | "Drought" | "Landslide"
type Tier = "Normal" | "Watch" | "High" | "Critical"
const layerNames = ["Seismic", "Heatwave", "Drought", "Landslide", "Faults"] as const
const tierColors: Record<Tier, string> = {
  Normal: "#15803d",
  Watch: "#ca8a04",
  High: "#ea580c",
  Critical: "#dc2626",
}
const referenceTime = Date.UTC(2025, 5, 15, 15, 40)
const events = [
  {
    id: "EQ-250615-08",
    name: "Hindu Kush region",
    province: "Khyber Pakhtunkhwa",
    magnitude: 5.2,
    depth: 128,
    lat: 36.42,
    lon: 71.18,
    x: 305,
    y: 130,
    age: 0.3,
    tier: "High" as Tier,
  },
  {
    id: "EQ-250615-07",
    name: "Khuzdar, Balochistan",
    province: "Balochistan",
    magnitude: 4.1,
    depth: 23,
    lat: 27.82,
    lon: 66.62,
    x: 197,
    y: 414,
    age: 1.1,
    tier: "Watch" as Tier,
  },
  {
    id: "EQ-250615-06",
    name: "Gilgit-Baltistan",
    province: "Gilgit-Baltistan",
    magnitude: 3.6,
    depth: 17,
    lat: 35.92,
    lon: 74.31,
    x: 408,
    y: 126,
    age: 2.8,
    tier: "Watch" as Tier,
  },
  {
    id: "EQ-250615-05",
    name: "Quetta district",
    province: "Balochistan",
    magnitude: 2.9,
    depth: 12,
    lat: 30.18,
    lon: 66.98,
    x: 190,
    y: 320,
    age: 4.3,
    tier: "Normal" as Tier,
  },
  {
    id: "EQ-250615-04",
    name: "Swat valley",
    province: "Khyber Pakhtunkhwa",
    magnitude: 3.2,
    depth: 31,
    lat: 35.22,
    lon: 72.43,
    x: 337,
    y: 182,
    age: 6.5,
    tier: "Normal" as Tier,
  },
  {
    id: "EQ-250613-03",
    name: "Muzaffarabad",
    province: "AJK",
    magnitude: 4.4,
    depth: 19,
    lat: 34.37,
    lon: 73.47,
    x: 391,
    y: 204,
    age: 48,
    tier: "Watch" as Tier,
  },
  {
    id: "EQ-250603-02",
    name: "Western Makran",
    province: "Balochistan",
    magnitude: 5.7,
    depth: 36,
    lat: 25.23,
    lon: 62.33,
    x: 115,
    y: 471,
    age: 288,
    tier: "High" as Tier,
  },
]
const cities = [
  {
    id: "HW-01",
    name: "Jacobabad",
    province: "Sindh",
    temp: 49,
    anomaly: 7.2,
    index: 54,
    days: 5,
    x: 263,
    y: 406,
    tier: "Critical" as Tier,
  },
  {
    id: "HW-02",
    name: "Sibi",
    province: "Balochistan",
    temp: 47.6,
    anomaly: 6.4,
    index: 50,
    days: 4,
    x: 214,
    y: 355,
    tier: "Critical" as Tier,
  },
  {
    id: "HW-03",
    name: "Multan",
    province: "Punjab",
    temp: 44.2,
    anomaly: 4.8,
    index: 48,
    days: 3,
    x: 333,
    y: 345,
    tier: "High" as Tier,
  },
  {
    id: "HW-04",
    name: "Dadu",
    province: "Sindh",
    temp: 46.8,
    anomaly: 5.9,
    index: 51,
    days: 4,
    x: 241,
    y: 449,
    tier: "Critical" as Tier,
  },
]
const droughtZones = [
  {
    id: "DR-01",
    name: "Tharparkar",
    province: "Sindh",
    spi: -1.82,
    spei: -2.14,
    vhi: 24,
    x: 300,
    y: 470,
    tier: "Critical" as Tier,
  },
  {
    id: "DR-02",
    name: "Cholistan",
    province: "Punjab",
    spi: -1.36,
    spei: -1.52,
    vhi: 33,
    x: 355,
    y: 387,
    tier: "High" as Tier,
  },
  {
    id: "DR-03",
    name: "Eastern Balochistan",
    province: "Balochistan",
    spi: -1.04,
    spei: -1.28,
    vhi: 38,
    x: 198,
    y: 383,
    tier: "Watch" as Tier,
  },
]
const slopes = [
  {
    id: "LS-01",
    name: "Karakoram Highway · Kohistan",
    province: "Khyber Pakhtunkhwa",
    rain: 86,
    trigger: 60,
    slope: 38,
    households: 320,
    x: 363,
    y: 160,
    tier: "Critical" as Tier,
  },
  {
    id: "LS-02",
    name: "Hunza / Attabad corridor",
    province: "Gilgit-Baltistan",
    rain: 64,
    trigger: 50,
    slope: 42,
    households: 180,
    x: 414,
    y: 96,
    tier: "High" as Tier,
  },
  {
    id: "LS-03",
    name: "Murree / Galiyat slopes",
    province: "Punjab",
    rain: 42,
    trigger: 45,
    slope: 29,
    households: 260,
    x: 374,
    y: 206,
    tier: "Watch" as Tier,
  },
]
const country =
  "M420 60 445 77 471 69 490 88 480 110 454 126 443 153 418 172 416 202 443 228 430 254 416 276 407 312 381 337 365 369 340 390 332 424 313 445 303 482 277 508 247 505 230 492 204 495 190 477 154 481 134 461 103 454 87 426 67 412 80 389 72 367 100 348 113 315 144 310 169 285 201 286 225 265 230 231 250 213 263 186 281 168 299 143 319 129 326 105 355 97 369 72 390 82Z"
const control =
  "rounded-sm border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] text-black hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
const empty = (
  <p className="px-4 py-6 text-[11px] leading-5">
    No records match these filters. Adjust the hazard, region, or threshold.
  </p>
)

function HazardCard({
  title,
  label,
  children,
  extra,
  className = "",
}: {
  title: string
  label: string
  children: ReactNode
  extra?: ReactNode
  className?: string
}) {
  return (
    <section
      className={`min-h-0 overflow-hidden rounded-sm border border-neutral-200 bg-white ${className}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
        <div>
          <p className="mb-1 text-[9px] tracking-[.15em]">{label}</p>
          <h2 className="text-[13px] font-semibold">{title}</h2>
        </div>
        {extra}
      </header>
      {children}
    </section>
  )
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[9px]">
      <svg width="6" height="6">
        <circle cx="3" cy="3" r="3" fill={tierColors[tier]} />
      </svg>
      {tier.toUpperCase()}
    </span>
  )
}

export default function GeophysicalHazards() {
  const [hazard, setHazard] = useState("All")
  const [province, setProvince] = useState("All Pakistan")
  const [threshold, setThreshold] = useState("All levels")
  const [timeRange, setTimeRange] = useState(24)
  const [selectedId, setSelectedId] = useState(events[0].id)
  const [layersOpen, setLayersOpen] = useState(false)
  const [layers, setLayers] = useState({
    Seismic: true,
    Heatwave: true,
    Drought: true,
    Landslide: true,
    Faults: true,
  })
  const [expanded, setExpanded] = useState(false)
  const [broadcast, setBroadcast] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [exported, setExported] = useState(false)
  const [trendIndex, setTrendIndex] = useState(6)
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (confirming) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [confirming])
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false)
        setLayersOpen(false)
      }
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])
  const matches = (
    kind: HazardType,
    region: string,
    tier: Tier,
    magnitude = 0,
  ) =>
    (hazard === "All" || hazard === kind) &&
    (province === "All Pakistan" || province === region) &&
    (threshold === "All levels" ||
      (threshold === "High / Critical" &&
        (tier === "High" || tier === "Critical")) ||
      (threshold === "Critical only" && tier === "Critical") ||
      (threshold.startsWith("M ≥") &&
        kind === "Seismic" &&
        magnitude >= Number(threshold.slice(4))))
  const seismic = events.filter(
    (event) =>
      event.age <= timeRange &&
      matches("Seismic", event.province, event.tier, event.magnitude),
  )
  const heat = cities.filter((city) =>
    matches("Heatwave", city.province, city.tier),
  )
  const drought = droughtZones.filter((zone) =>
    matches("Drought", zone.province, zone.tier),
  )
  const landslides = slopes.filter((slope) =>
    matches("Landslide", slope.province, slope.tier),
  )
  const records = [
    ...seismic.map((event) => ({
      ...event,
      kind: "Seismic" as HazardType,
      metric: `M ${event.magnitude.toFixed(1)} · ${event.depth} km depth`,
      detail: `${event.lat.toFixed(2)}°N, ${event.lon.toFixed(2)}°E · ${new Date(referenceTime - event.age * 3600000).toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit" })} PKT`,
    })),
    ...heat.map((city) => ({
      ...city,
      kind: "Heatwave" as HazardType,
      metric: `${city.temp}°C · heat index ${city.index}°C`,
      detail: `+${city.anomaly}°C anomaly · ${city.days} consecutive days`,
    })),
    ...drought.map((zone) => ({
      ...zone,
      kind: "Drought" as HazardType,
      metric: `SPI ${zone.spi} · SPEI ${zone.spei}`,
      detail: `VHI ${zone.vhi} / 100 · agricultural exposure`,
    })),
    ...landslides.map((slope) => ({
      ...slope,
      kind: "Landslide" as HazardType,
      metric: `${slope.rain} mm / 24h · slope ${slope.slope}°`,
      detail: `Trigger ${slope.trigger} mm · ${slope.households} vulnerable households`,
    })),
  ]
  const selected =
    records.find((record) => record.id === selectedId) ?? records[0]
  const mapRecords = records.filter((record) => layers[record.kind])
  const frequency = Array.from(
    { length: 7 },
    (_, index) =>
      seismic.filter(
        (event) =>
          Math.min(6, Math.floor((1 - event.age / timeRange) * 7)) === index,
      ).length,
  )
  const peakHeatDays = heat.length
    ? Math.max(...heat.map((city) => city.days))
    : 0
  const report = () => {
    const csv = `PMDNOC simulated multi-hazard report,${province},${hazard},Last ${timeRange} hours\nID,Type,Area,Province,Tier,Metric,Details\n${records.map((record) => [record.id, record.kind, record.name, record.province, record.tier, record.metric, record.detail].map((value) => `"${value.replace(/"/g, '""')}"`).join(",")).join("\n")}`
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "PMDNOC-multi-hazard-report.csv"
    anchor.click()
    URL.revokeObjectURL(url)
    setExported(true)
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white text-black">
      <header className="flex min-h-[86px] flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
        <div>
          <p className="mb-1.5 text-[9px] tracking-[.18em]">
            GEOPHYSICAL INTELLIGENCE / 05
          </p>
          <h1 className="text-xl font-semibold">
            Geophysical & Multi-Hazard Monitoring
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
            Seismic Monitoring: Active{" "}
            <span className="ml-2">· Simulated network</span>
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-[9px] tracking-wider">
            HAZARD TYPE
            <select
              className={control}
              value={hazard}
              onChange={(event) => {
                setHazard(event.target.value)
                setThreshold("All levels")
              }}
            >
              {["All", "Seismic", "Heatwave", "Drought", "Landslide"].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </label>
          <label className="grid gap-1 text-[9px] tracking-wider">
            REGION / PROVINCE
            <select
              className={control}
              value={province}
              onChange={(event) => setProvince(event.target.value)}
            >
              {[
                "All Pakistan",
                "Punjab",
                "Sindh",
                "Balochistan",
                "Khyber Pakhtunkhwa",
                "Gilgit-Baltistan",
                "AJK",
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-[9px] tracking-wider">
            MAGNITUDE / THRESHOLD
            <select
              className={control}
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
            >
              {[
                "All levels",
                "High / Critical",
                "Critical only",
                ...(hazard === "Seismic" ? ["M ≥ 3", "M ≥ 4", "M ≥ 5"] : []),
              ].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-[9px] tracking-wider">
            TIME RANGE / TO 15 JUN 20:40 PKT
            <select
              className={control}
              value={timeRange}
              onChange={(event) => setTimeRange(Number(event.target.value))}
            >
              {[
                [24, "Last 24 hours"],
                [168, "Last 7 days"],
                [720, "Last 30 days"],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="relative flex gap-2">
          <button
            className={`${control} ${
              broadcast ? "border-red-500 bg-red-50" : ""
            }`}
            aria-pressed={broadcast}
            onClick={() =>
              broadcast ? setBroadcast(false) : setConfirming(true)
            }
          >
            ◉ {broadcast ? "Demo active" : "Emergency"}
          </button>
          <button
            className={control}
            aria-expanded={layersOpen}
            onClick={() => setLayersOpen(!layersOpen)}
          >
            ▱ Layers
          </button>
          <button className={control} onClick={report}>
            ↓ Report
          </button>
          {layersOpen && (
            <div className="absolute right-0 top-10 z-50 w-48 rounded-sm border border-neutral-300 bg-white p-3 shadow-lg">
              <p className="mb-2 text-[9px] tracking-wider">HAZARD OVERLAYS</p>
              {layerNames.map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between py-2 text-[11px]"
                >
                  {key}
                  <input
                    className="accent-black"
                    type="checkbox"
                    checked={layers[key]}
                    onChange={() =>
                      setLayers((previous) => ({
                        ...previous,
                        [key]: !previous[key],
                      }))
                    }
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="flex justify-between border-b border-neutral-200 px-5 py-2 text-[9px] tracking-wider">
        <span>
          MULTI-HAZARD COMMON OPERATING PICTURE <span className="mx-3">/</span>{" "}
          {province.toUpperCase()} <span className="mx-3">/</span>{" "}
          {records.length} MATCHING RECORDS
        </span>
        <span role="status">
          {exported ? "CSV REPORT EXPORTED · " : ""}SIMULATED DATA · NOT FOR
          OPERATIONAL USE
        </span>
      </div>
      <main className="grid min-h-0 flex-1 grid-cols-[28fr_46fr_26fr] gap-3 overflow-auto p-3">
        <div className="flex min-w-0 flex-col gap-3">
          <HazardCard
            title="Recent Seismic Events"
            label="EPICENTER / DEPTH / MAGNITUDE"
            extra={<span className="text-[9px]">{seismic.length} events</span>}
            className="flex min-h-[280px] flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-auto p-3">
              {seismic.map((event) => (
                <button
                  key={event.id}
                  className={`mb-1 w-full rounded-sm border p-3 text-left ${
                    selected?.id === event.id
                      ? "border-black bg-neutral-100"
                      : "border-transparent hover:bg-neutral-50"
                  }`}
                  onClick={() => setSelectedId(event.id)}
                  aria-pressed={selected?.id === event.id}
                >
                  <div className="flex items-start gap-3">
                    <svg
                      width="39"
                      height="39"
                      className="shrink-0"
                      aria-label={`Magnitude ${event.magnitude}`}
                    >
                      <rect
                        width="39"
                        height="39"
                        rx="2"
                        fill={tierColors[event.tier]}
                        fillOpacity=".1"
                      />
                      <text
                        x="19.5"
                        y="13"
                        textAnchor="middle"
                        fill="#171717"
                        fontSize="7"
                      >
                        MAGNITUDE
                      </text>
                      <text
                        x="19.5"
                        y="30"
                        textAnchor="middle"
                        fill={tierColors[event.tier]}
                        fontFamily="monospace"
                        fontSize="17"
                        fontWeight="600"
                      >
                        {event.magnitude.toFixed(1)}
                      </text>
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold">{event.name}</p>
                      <p className="mt-1 font-mono text-[9px]">
                        {event.lat.toFixed(2)}°N · {event.lon.toFixed(2)}°E
                      </p>
                      <div className="mt-2 flex justify-between text-[9px]">
                        <span>
                          Depth <b>{event.depth} km</b>
                        </span>
                        <span>
                          {new Date(
                            referenceTime - event.age * 3600000,
                          ).toLocaleString("en-GB", {
                            timeZone: "Asia/Karachi",
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          PKT
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {!seismic.length && empty}
            </div>
            <div className="flex justify-between border-t border-neutral-200 px-4 py-2 text-[9px]">
              <span>MAGNITUDE: SIMULATED ML</span>
              <span>Reviewed sample events</span>
            </div>
          </HazardCard>
          <HazardCard
            title="Drought & Environmental Indices"
            label="AGRICULTURAL ZONES / 3-MONTH INDICES"
          >
            <div className="overflow-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-neutral-50 text-[9px]">
                  <tr>
                    <th className="px-3 py-3 font-medium">ZONE</th>
                    <th className="font-medium">SPI</th>
                    <th className="font-medium">SPEI</th>
                    <th className="pr-3 font-medium">VHI</th>
                  </tr>
                </thead>
                <tbody>
                  {drought.map((zone) => (
                    <tr
                      key={zone.id}
                      className={`border-t border-neutral-200 ${
                        selected?.id === zone.id ? "bg-neutral-100" : ""
                      }`}
                    >
                      <td className="px-3 py-3">
                        <button
                          className="text-left text-[10px] font-semibold hover:underline"
                          onClick={() => setSelectedId(zone.id)}
                        >
                          {zone.name}
                        </button>
                        <p className="mt-1">
                          <TierBadge tier={zone.tier} />
                        </p>
                      </td>
                      <td className="font-mono">{zone.spi.toFixed(2)}</td>
                      <td className="font-mono">{zone.spei.toFixed(2)}</td>
                      <td className="pr-3 font-mono">
                        {zone.vhi}
                        <small className="text-[8px]">/100</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!drought.length && empty}
            </div>
            <div className="border-t border-neutral-200 px-3 py-3 text-[9px] leading-4">
              SPI / SPEI ≤ −1.5: severe drought.
              <br />
              VHI below 35: vegetation stress. Static seasonal sample.
            </div>
          </HazardCard>
        </div>
        <div
          className={`flex min-h-0 min-w-0 flex-col gap-3 ${
            expanded ? "fixed inset-4 z-50 bg-white p-3 shadow-2xl" : ""
          }`}
        >
          <HazardCard
            title="Multi-Hazard & Seismic Epicenter Map"
            label="GIS / FAULTS / EXPOSURE / TERRAIN RISK"
            className="flex min-h-[340px] flex-1 flex-col"
            extra={
              <button
                className={control}
                onClick={() => setExpanded(!expanded)}
                aria-label={
                  expanded ? "Close expanded map" : "Expand hazard map"
                }
              >
                {expanded ? "✕ Close" : "⛶"}
              </button>
            }
          >
            <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
              <div className="absolute left-3 right-3 top-3 flex justify-between">
                <span className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[9px]">
                  {hazard} hazards · last {timeRange}h
                </span>
                <span className="rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[9px]">
                  {mapRecords.length} visible · schematic GIS
                </span>
              </div>
              <svg
                viewBox="0 0 600 580"
                className="h-full w-full"
                role="group"
                aria-label="Schematic Pakistan multi-hazard map; select hazard markers for details"
              >
                <defs>
                  <pattern
                    id="hazardGrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M40 0H0V40"
                      fill="none"
                      stroke="#223247"
                      strokeWidth=".6"
                    />
                  </pattern>
                  <clipPath id="hazardCountry">
                    <path d={country} />
                  </clipPath>
                </defs>
                <rect width="600" height="580" fill="url(#hazardGrid)" />
                <g fill="#556a80" fontSize="10" letterSpacing="2">
                  <text x="80" y="175">
                    AFGHANISTAN
                  </text>
                  <text x="22" y="330">
                    IRAN
                  </text>
                  <text x="475" y="378">
                    INDIA
                  </text>
                  <text x="487" y="65">
                    CHINA
                  </text>
                  <text x="130" y="550">
                    ARABIAN SEA
                  </text>
                </g>
                <path
                  d={country}
                  fill="#1b3041"
                  stroke="#748b9d"
                  strokeWidth="1.2"
                />
                <g clipPath="url(#hazardCountry)">
                  {Array.from({ length: 20 }, (_, index) => (
                    <path
                      key={index}
                      d={`M65 ${80 + index * 23}Q190 ${35 + index * 24} 340 ${95 + index * 22}T510 ${80 + index * 23}`}
                      fill="none"
                      stroke="#a5b9c2"
                      opacity={index < 7 ? ".25" : ".1"}
                    />
                  ))}
                  {layers.Faults && (
                    <g
                      fill="none"
                      stroke="#e879f9"
                      strokeWidth="1.3"
                      strokeDasharray="7 4"
                      opacity=".75"
                    >
                      <path d="M173 470 194 405 209 355 234 301 266 242 296 183 330 143" />
                      <path d="M276 202 323 221 369 207 418 172 463 124" />
                      <path d="M83 458 151 461 226 483 280 501" />
                      <path d="M352 173 383 151 428 116" />
                    </g>
                  )}
                  {layers.Heatwave &&
                    heat.map((city) => (
                      <g key={city.id}>
                        <ellipse
                          cx={city.x}
                          cy={city.y}
                          rx="37"
                          ry="34"
                          fill={tierColors[city.tier]}
                          opacity=".22"
                        />
                        <ellipse
                          cx={city.x}
                          cy={city.y}
                          rx="24"
                          ry="22"
                          fill="#fb923c"
                          opacity=".2"
                        />
                      </g>
                    ))}
                  {layers.Drought &&
                    drought.map((zone) => (
                      <ellipse
                        key={zone.id}
                        cx={zone.x}
                        cy={zone.y}
                        rx="35"
                        ry="40"
                        fill="#ca8a04"
                        fillOpacity=".2"
                        stroke="#eab308"
                        strokeDasharray="3 4"
                        opacity=".7"
                      />
                    ))}
                  {layers.Landslide &&
                    landslides.map((slope) => (
                      <path
                        key={slope.id}
                        d={`M${slope.x - 25} ${slope.y + 24} ${slope.x} ${slope.y - 26} ${slope.x + 28} ${slope.y + 24}Z`}
                        fill={tierColors[slope.tier]}
                        fillOpacity=".24"
                        stroke={tierColors[slope.tier]}
                        opacity=".7"
                      />
                    ))}
                </g>
                <g fill="#94adbc" fontSize="8" letterSpacing="1">
                  <text x="365" y="115">
                    GILGIT-BALTISTAN
                  </text>
                  <text x="283" y="234">
                    KP
                  </text>
                  <text x="352" y="300">
                    PUNJAB
                  </text>
                  <text x="126" y="358">
                    BALOCHISTAN
                  </text>
                  <text x="223" y="472">
                    SINDH
                  </text>
                </g>
                {mapRecords.map((record) => (
                  <g
                    key={record.id}
                    transform={`translate(${record.x} ${record.y})`}
                    role="button"
                    tabIndex={0}
                    className="forecast-marker cursor-pointer outline-none"
                    aria-label={`Inspect ${record.kind}: ${record.name}, ${record.tier}`}
                    onClick={() => setSelectedId(record.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedId(record.id)
                      }
                    }}
                  >
                    <title>
                      {record.name} · {record.metric}
                    </title>
                    {record.kind === "Seismic" && (
                      <>
                        {[20, 35, 50].map((radius) => (
                          <circle
                            key={radius}
                            r={radius}
                            fill="none"
                            stroke={tierColors[record.tier]}
                            opacity={radius === 20 ? ".6" : ".25"}
                            strokeWidth="1"
                          />
                        ))}
                      </>
                    )}
                    <circle
                      r={selected?.id === record.id ? 11 : 7}
                      fill="#0c1828"
                      stroke={
                        selected?.id === record.id
                          ? "#fff"
                          : tierColors[record.tier]
                      }
                      strokeWidth="1.5"
                    />
                    <circle r="3" fill={tierColors[record.tier]} />
                    <text x="14" y="3" fill="#e2e8f0" fontSize="8">
                      {record.kind === "Seismic"
                        ? record.metric.split(" · ")[0]
                        : record.kind === "Landslide"
                          ? "SLOPE RISK"
                          : record.name}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-3 left-3 right-3 rounded-sm border border-neutral-200 bg-white p-3">
                {selected ? (
                  <>
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold">
                          {selected.name}
                        </p>
                        <p className="mt-1 text-[9px]">
                          {selected.kind} · {selected.province}
                        </p>
                      </div>
                      <TierBadge tier={selected.tier} />
                    </div>
                    <p className="mt-2 font-mono text-[11px]">
                      {selected.metric}
                    </p>
                    <p className="mt-1 text-[9px]">{selected.detail}</p>
                  </>
                ) : (
                  <p className="text-[11px]">
                    No hazards match the current filters.
                  </p>
                )}
                <div className="mt-3 flex justify-between border-t border-neutral-200 pt-2 text-[9px]">
                  {Object.keys(tierColors).map((tier) => (
                    <TierBadge key={tier} tier={tier as Tier} />
                  ))}
                </div>
              </div>
            </div>
          </HazardCard>
          <HazardCard
            title="Temporal Hazard Trend & Magnitude"
            label={`LAST ${timeRange} HOURS / FILTERED REGION`}
            extra={
              <span className="text-[9px]">
                Bin {trendIndex + 1}/7 · {frequency[trendIndex]} events
              </span>
            }
          >
            <div className="flex justify-between px-4 pt-3 text-[9px]">
              <span>
                ▥ Seismic frequency{" "}
                <span className="ml-2 text-orange-700">● Max magnitude</span>
              </span>
              <span className="text-red-700">━ Heatwave duration / days</span>
            </div>
            <svg
              viewBox="0 0 520 135"
              className="h-[clamp(105px,15vh,205px)] w-full"
              role="group"
              aria-label="Select time bins to inspect seismic event frequency and heatwave duration"
            >
              <g>
                {[25, 55, 85, 110].map((height, index) => (
                  <g key={height}>
                    <line
                      x1="35"
                      x2="485"
                      y1={height}
                      y2={height}
                      stroke="#e5e5e5"
                      strokeDasharray="2 3"
                    />
                    <text x="9" y={height + 3} fontSize="8">
                      {6 - index * 2}
                    </text>
                  </g>
                ))}
              </g>
              {frequency.map((count, index) => (
                <g
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`Time bin ${index + 1}: ${count} seismic events`}
                  onClick={() => setTrendIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setTrendIndex(index)
                    }
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={42 + index * 65}
                    y="18"
                    width="40"
                    height="95"
                    fill={trendIndex === index ? "#f5f5f5" : "transparent"}
                  />
                  <rect
                    x={49 + index * 65}
                    y={110 - count * 16}
                    width="22"
                    height={count * 16}
                    rx="1"
                    fill="#0284c7"
                    opacity=".65"
                  />
                  {count > 0 && (
                    <circle
                      cx={60 + index * 65}
                      cy={
                        112 -
                        Math.max(
                          ...seismic
                            .filter(
                              (event) =>
                                Math.min(
                                  6,
                                  Math.floor((1 - event.age / timeRange) * 7),
                                ) === index,
                            )
                            .map((event) => event.magnitude),
                        ) *
                          13
                      }
                      r="3"
                      fill="#ea580c"
                    />
                  )}
                  <text
                    x={60 + index * 65}
                    y="128"
                    textAnchor="middle"
                    fontSize="8"
                  >
                    −{Math.round(((6 - index) / 6) * timeRange)}h
                  </text>
                </g>
              ))}
              {peakHeatDays > 0 && (
                <path
                  d={`M60 ${110 - Math.max(0, peakHeatDays - 4) * 13} ${125} ${110 - Math.max(0, peakHeatDays - 3) * 13} ${190} ${110 - Math.max(0, peakHeatDays - 3) * 13} ${255} ${110 - Math.max(0, peakHeatDays - 2) * 13} ${320} ${110 - Math.max(0, peakHeatDays - 1) * 13} ${385} ${110 - peakHeatDays * 13} ${450} ${110 - peakHeatDays * 13}`}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                />
              )}
              <line
                x1={60 + trendIndex * 65}
                x2={60 + trendIndex * 65}
                y1="18"
                y2="113"
                stroke="#171717"
                strokeDasharray="2 3"
              />
            </svg>
            <div className="border-t border-neutral-200 px-4 py-2 text-[9px]">
              Left: event count · orange: ML magnitude · red: duration in days.
              Heatwave curve is illustrative.
            </div>
          </HazardCard>
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <HazardCard
            title="Heatwave & Temperature Thresholds"
            label="EXPOSURE / ANOMALY / DURATION"
            extra={<span className="text-[9px]">{heat.length} warnings</span>}
          >
            <div className="p-3">
              {heat.map((city) => (
                <button
                  key={city.id}
                  className={`mb-2 w-full rounded-sm border p-3 text-left ${
                    selected?.id === city.id
                      ? "border-black bg-neutral-100"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                  onClick={() => setSelectedId(city.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold">{city.name}</p>
                      <p className="mt-1 text-[9px]">
                        {city.province} · {city.days}-day duration
                      </p>
                    </div>
                    <b className="font-mono text-xl">
                      {city.temp}
                      <small className="text-[10px]">°C</small>
                    </b>
                  </div>
                  <div className="mt-3 flex justify-between text-[9px]">
                    <span>
                      Heat index <b>{city.index}°C</b>
                    </span>
                    <span>
                      Anomaly <b>+{city.anomaly}°C</b>
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2">
                    <TierBadge tier={city.tier} />
                    <span className="text-[9px]">Threshold 40°C</span>
                  </div>
                </button>
              ))}
              {!heat.length && empty}
            </div>
          </HazardCard>
          <HazardCard
            title="Landslide & Mountain Risk Log"
            label="RAINFALL TRIGGERS / SLOPE STABILITY"
            extra={
              <span className="text-[9px]">
                {
                  landslides.filter((slope) => !acknowledged.includes(slope.id))
                    .length
                }{" "}
                open
              </span>
            }
            className="flex min-h-[230px] flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-auto p-3">
              {landslides.map((slope) => (
                <article
                  key={slope.id}
                  className={`mb-3 rounded-sm border p-3 ${
                    selected?.id === slope.id
                      ? "border-black bg-neutral-100"
                      : "border-neutral-200"
                  }`}
                >
                  <div className="flex justify-between">
                    <TierBadge tier={slope.tier} />
                    <span className="font-mono text-[9px]">{slope.id}</span>
                  </div>
                  <button
                    className="mt-2 text-left text-[11px] font-semibold hover:underline"
                    onClick={() => setSelectedId(slope.id)}
                  >
                    {slope.name}
                  </button>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[9px]">
                    <div>
                      24H RAINFALL
                      <b className="mt-1 block font-mono text-[15px]">
                        {slope.rain} mm
                      </b>
                    </div>
                    <div>
                      TRIGGER LEVEL
                      <b className="mt-1 block font-mono text-[15px]">
                        {slope.trigger} mm
                      </b>
                    </div>
                  </div>
                  <p className="mt-2 text-[9px] leading-4">
                    Slope {slope.slope}° · {slope.households} households
                    exposed.
                    <br />
                    {slope.rain >= slope.trigger
                      ? "Rainfall threshold breached; unstable slopes possible."
                      : "Approaching trigger; enhanced monitoring advised."}
                  </p>
                  <div className="mt-3 flex justify-between border-t border-neutral-200 pt-2 text-[9px]">
                    <span>Vulnerability: {slope.tier}</span>
                    <button
                      className="underline underline-offset-2 disabled:no-underline"
                      disabled={acknowledged.includes(slope.id)}
                      onClick={() =>
                        setAcknowledged((previous) => [...previous, slope.id])
                      }
                    >
                      {acknowledged.includes(slope.id)
                        ? "✓ Reviewed"
                        : "Acknowledge"}
                    </button>
                  </div>
                </article>
              ))}
              {!landslides.length && empty}
            </div>
          </HazardCard>
        </div>
      </main>
      <footer className="flex justify-between border-t border-neutral-200 px-4 py-2 font-mono text-[9px]">
        <span>
          ● SEISMIC NETWORK ACTIVE <span className="mx-3">|</span>{" "}
          {mapRecords.length} VISIBLE HAZARDS <span className="mx-3">|</span>{" "}
          {broadcast ? "DEMO EMERGENCY ACTIVE" : "MULTI-HAZARD WATCH"}
        </span>
        <span>SIMULATED TELEMETRY · 15 JUN 2025 20:40 PKT</span>
      </footer>
      <dialog
        ref={dialogRef}
        onCancel={() => setConfirming(false)}
        onClose={() => setConfirming(false)}
        aria-labelledby="hazard-broadcast-title"
        className="fixed inset-0 m-auto w-full max-w-md rounded-sm border border-neutral-300 bg-white p-6 text-black shadow-xl backdrop:bg-black/30"
      >
        <h2 id="hazard-broadcast-title" className="text-lg font-semibold">
          Activate demo emergency broadcast?
        </h2>
        <p className="mt-3 text-sm leading-6">
          Enable the emergency indicator for {hazard.toLowerCase()} hazards in{" "}
          {province}. This prototype sends no messages to agencies, operators,
          or the public.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            autoFocus
            className={control}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
          <button
            className={`${control} border-red-300 bg-red-50`}
            onClick={() => {
              setBroadcast(true)
              setConfirming(false)
            }}
          >
            Enable demo mode
          </button>
        </div>
      </dialog>
    </div>
  )
}
