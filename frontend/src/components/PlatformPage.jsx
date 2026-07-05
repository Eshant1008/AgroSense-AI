import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Camera, CheckCircle2, CloudSun, Leaf, ShieldAlert, Sparkles, UploadCloud } from "lucide-react";
import { CROP_OPTIONS, UPCOMING_CROPS } from "../data/translations";
import { predictDisease } from "../services/predictApi";

const resultOrder = [
  "disease",
  "confidence",
  "top3",
  "severity",
  "risk",
  "spread",
  "treatments",
  "prevention",
  "weather",
  "yield",
  "recovery",
];

function severityStyle(level) {
  if (level === "high") return "bg-rose-100 text-rose-700 border border-rose-200";
  if (level === "medium") return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-emerald-100 text-emerald-700 border border-emerald-200";
}

function cardHover(key) {
  if (key === "severity") {
    return {
      x: [0, -1.5, 1.5, -1.5, 1.5, 0],
      transition: { duration: 0.32, ease: "easeInOut" },
    };
  }

  return {
    y: -4,
    scale: 1.01,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  };
}

function humanizeDiseaseName(name) {
  if (!name) return "Unknown";
  return String(name)
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePredictionResponse(payload) {
  const top3Raw = Array.isArray(payload?.top3_predictions) ? payload.top3_predictions : [];
  const top3 = top3Raw.slice(0, 3).map((item) => ({
    name: humanizeDiseaseName(item?.disease),
    confidence: Number(item?.confidence || 0),
  }));

  const main = top3[0] || { name: "Unknown", confidence: 0 };
  const severityText = String(payload?.severity || "LOW").toUpperCase();
  const severityLevel = severityText.includes("HIGH") || severityText.includes("CRITICAL")
    ? "high"
    : severityText.includes("MEDIUM")
      ? "medium"
      : "low";

  return {
    disease: main.name,
    confidence: Number(main.confidence.toFixed(2)),
    top3,
    severityLevel,
    severityText,
    risk: payload?.risk || "Risk data unavailable.",
    spread: payload?.spread_probability || "Unknown",
    treatments: Array.isArray(payload?.treatments) ? payload.treatments : [],
    prevention: Array.isArray(payload?.prevention) ? payload.prevention : [],
    weather: payload?.weather_warning || "No weather warning available.",
    yield: payload?.yield_impact || "No yield impact estimate available.",
    recovery: payload?.recovery_time || "No recovery timeline available.",
  };
}

export default function PlatformPage({ copy, language, onBackHome }) {
  const crops = CROP_OPTIONS[language] || CROP_OPTIONS.en;
  const [crop, setCrop] = useState(crops[0]?.value || "tomato");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [warning, setWarning] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!crops.find((item) => item.value === crop)) {
      setCrop(crops[0]?.value || "tomato");
    }
  }, [crop, crops]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setWarning("Please upload a valid image file.");
      return;
    }

    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const nextUrl = URL.createObjectURL(file);

    setImageUrl(nextUrl);
    setSelectedFile(file);
    setWarning("");
    setErrorMessage("");
    setReport(null);
    setStatus("idle");
  }

  async function startPrediction() {
    if (!selectedFile) {
      setWarning(copy.uploadNeeded);
      return;
    }

    setWarning("");
    setErrorMessage("");
    setIsButtonPressed(true);
    setStatus("scanning");

    try {
      const payload = await predictDisease(selectedFile);
      const normalized = normalizePredictionResponse(payload);
      setReport(normalized);
      setStatus("complete");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error?.message || "Unable to reach AI server. Please retry.");
    } finally {
      setIsButtonPressed(false);
    }
  }

  return (
    <motion.section
      className="mx-auto min-h-[calc(100vh-98px)] w-full max-w-[1400px] px-4 py-8 md:px-8"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-base font-semibold uppercase tracking-wider text-emerald-900/70">{copy.brand}</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900 md:text-5xl">{copy.platformTitle}</h2>
          <p className="mt-2 text-base text-slate-700 md:text-lg">{copy.platformSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={onBackHome}
          className="rounded-xl border border-emerald-200 bg-white/85 px-5 py-3 text-base font-medium text-emerald-800 transition hover:bg-white"
        >
          {copy.backHome}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="glass-panel rounded-3xl p-7 lg:col-span-4">
          <h3 className="text-2xl font-semibold text-slate-900">{copy.featuresTitle}</h3>
          <ul className="mt-5 space-y-4 text-base text-slate-700 md:text-lg">
            <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" /> {copy.feature1}</li>
            <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" /> {copy.feature2}</li>
            <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600" /> {copy.feature3}</li>
          </ul>

          <div className="mt-8">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 md:text-base">{copy.cropSupport}</h4>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {crops.slice(0, 3).map((item) => (
                <span key={item.value} className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-sm font-medium text-emerald-700">
                  {item.label} | {copy.cropReady}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(UPCOMING_CROPS[language] || UPCOMING_CROPS.en).map((name) => (
                <span key={name} className="rounded-full bg-amber-100 px-3.5 py-1.5 text-sm font-medium text-amber-700">
                  {name} | {copy.cropSoon}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-7 lg:col-span-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/75 p-5">
              <p className="text-sm uppercase tracking-wider text-slate-500">{copy.step1}</p>
              <label className="mt-3 block text-base font-medium text-slate-700">{copy.selectCrop}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="mt-2.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base outline-none"
              >
                {crops.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-white/75 p-5 md:col-span-2">
              <p className="text-sm uppercase tracking-wider text-slate-500">{copy.step2}</p>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-white p-6 text-center">
                <UploadCloud className="h-9 w-9 text-emerald-700" />
                <p className="mt-3 text-lg font-medium text-slate-800">{copy.uploadLeaf}</p>
                <p className="text-sm text-slate-500">{copy.uploadHint}</p>
                <input className="hidden" type="file" accept="image/*" capture="environment" onChange={onFileChange} />
              </label>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <motion.div className="rounded-2xl bg-slate-950 p-5 text-slate-100">
              <div className="flex items-center justify-between text-sm uppercase tracking-wider text-slate-300">
                <span>{copy.step3}</span>
                <Camera className="h-5 w-5" />
              </div>
              <motion.button
                type="button"
                onClick={startPrediction}
                disabled={status === "scanning"}
                className="group relative mt-4 w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 px-6 py-4 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-75"
                whileHover={status === "scanning" ? {} : { scale: 1.015 }}
                whileTap={status === "scanning" ? {} : { scale: 0.95 }}
                animate={isButtonPressed ? { x: -24, scale: 0.98 } : { x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16 }}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,rgba(255,255,255,0)_20%,rgba(255,255,255,0.22)_50%,rgba(255,255,255,0)_80%)] transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10">{status === "scanning" ? "Analyzing..." : copy.startPrediction}</span>
              </motion.button>
              {warning && <p className="mt-3 text-sm text-rose-300">{warning}</p>}
            </motion.div>

            <div className="rounded-2xl bg-white/75 p-5">
              <p className="text-sm uppercase tracking-wider text-slate-500">{copy.preview}</p>
              <AnimatePresence mode="wait">
                {imageUrl ? (
                  <motion.img
                    key={imageUrl}
                    src={imageUrl}
                    alt="Leaf preview"
                    className="mt-3 h-52 w-full rounded-xl object-cover"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    className="mt-3 flex h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-base text-slate-500"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Leaf className="mr-2 h-5 w-5" />
                    {copy.uploadLeaf}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {status === "scanning" && (
              <motion.div
                className="mt-5 overflow-hidden rounded-2xl border border-emerald-300/70 bg-emerald-100/60 p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-lg font-medium text-emerald-900">AgroSense AI is analyzing your crop...</p>
                <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-emerald-200">
                  <motion.div
                    className="absolute h-full w-1/3 bg-emerald-600"
                    animate={{ x: ["-110%", "330%"] }}
                    transition={{ repeat: Infinity, duration: 1.35, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status === "error" && (
              <motion.div
                className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
                  <div className="flex-1">
                    <p className="text-base font-semibold text-rose-700">Prediction failed</p>
                    <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={startPrediction}
                      className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {status === "complete" && report && (
          <motion.section
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-5 text-3xl font-bold text-slate-900 md:text-4xl">{copy.reportTitle}</h3>

            <motion.div
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              variants={{
                hidden: { opacity: 1 },
                show: { opacity: 1, transition: { staggerChildren: 0.11 } },
              }}
              initial="hidden"
              animate="show"
            >
              {resultOrder.map((key) => (
                <motion.article
                  key={key}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  whileHover={cardHover(key)}
                  className="glass-panel rounded-2xl p-5"
                >
                  {key === "disease" && (
                    <>
                      <p className="label">{copy.diseaseName}</p>
                      <p className="value text-lg font-semibold">{report.disease}</p>
                    </>
                  )}
                  {key === "confidence" && (
                    <>
                      <p className="label">{copy.aiConfidence}</p>
                      <p className="value text-lg font-semibold">{report.confidence}%</p>
                      <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(Math.max(report.confidence, 0), 100)}%` }}
                          transition={{ duration: 1.2 }}
                        />
                      </div>
                    </>
                  )}
                  {key === "top3" && (
                    <>
                      <p className="label">{copy.top3}</p>
                      <div className="mt-2 space-y-2 text-base text-slate-700">
                        {report.top3.length === 0 && (
                          <p className="rounded-lg bg-white/70 px-3 py-2.5 text-sm">No predictions returned.</p>
                        )}
                        {report.top3.map((item, index) => (
                          <motion.div
                            key={item.name}
                            whileHover={{ x: 4, scale: 1.01 }}
                            className="rounded-lg bg-white/70 px-3 py-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span>{index + 1}. {item.name}</span>
                              <span className="font-semibold">{item.confidence.toFixed(2)}%</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(Math.max(item.confidence, 0), 100)}%` }}
                                transition={{ duration: 1.0, delay: index * 0.08 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                  {key === "severity" && (
                    <>
                      <p className="label">{copy.severity}</p>
                      <span className={`mt-3 block w-full rounded-xl px-3 py-3 text-center text-lg font-semibold ${severityStyle(report.severityLevel)}`}>
                        {report.severityText}
                      </span>
                    </>
                  )}
                  {key === "risk" && (
                    <>
                      <p className="label">{copy.risk}</p>
                      <p className="value text-base font-semibold text-rose-700">{report.risk}</p>
                    </>
                  )}
                  {key === "spread" && (
                    <>
                      <p className="label">Spread Probability</p>
                      <p className="value text-base font-semibold">{report.spread}</p>
                    </>
                  )}
                  {key === "treatments" && (
                    <>
                      <p className="label">{copy.treatment}</p>
                      <ul className="mt-2 space-y-2 text-base text-slate-700">
                        {report.treatments.length === 0 && (
                          <li className="rounded-lg bg-white/70 px-3 py-2.5 text-sm">No treatment suggestions returned.</li>
                        )}
                        {report.treatments.map((item) => <li key={item} className="rounded-lg bg-white/70 px-3 py-2.5">{item}</li>)}
                      </ul>
                    </>
                  )}
                  {key === "prevention" && (
                    <>
                      <p className="label">{copy.prevention}</p>
                      <ul className="mt-2 space-y-2 text-base text-slate-700">
                        {report.prevention.length === 0 && (
                          <li className="rounded-lg bg-white/70 px-3 py-2.5 text-sm">No prevention checklist returned.</li>
                        )}
                        {report.prevention.map((item) => <li key={item} className="rounded-lg bg-white/70 px-3 py-2.5">{item}</li>)}
                      </ul>
                    </>
                  )}
                  {key === "weather" && (
                    <>
                      <p className="label flex items-center gap-1.5"><CloudSun className="h-[18px] w-[18px]" /> {copy.weather}</p>
                      <p className="value text-base">{report.weather}</p>
                    </>
                  )}
                  {key === "yield" && (
                    <>
                      <p className="label flex items-center gap-1.5"><ShieldAlert className="h-[18px] w-[18px]" /> {copy.yield}</p>
                      <p className="value text-base">{report.yield}</p>
                    </>
                  )}
                  {key === "recovery" && (
                    <>
                      <p className="label flex items-center gap-1.5"><Sparkles className="h-[18px] w-[18px]" /> {copy.recovery}</p>
                      <p className="value text-base">{report.recovery}</p>
                    </>
                  )}
                </motion.article>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
