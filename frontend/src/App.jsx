import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import LandingPage from "./components/LandingPage";
import PlatformPage from "./components/PlatformPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { COPY } from "./data/translations";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [page, setPage] = useState("landing");

  const copy = useMemo(() => COPY[language] || COPY.en, [language]);
  const showingLanding = page === "landing";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.22),transparent_33%),radial-gradient(circle_at_50%_95%,rgba(34,197,94,0.14),transparent_33%)]" />

      <header className="relative z-20 border-b border-white/35 bg-white/65 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <motion.p
            className="text-lg font-extrabold tracking-wide text-emerald-900 md:text-2xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {copy.brand}
          </motion.p>
          <LanguageSwitcher language={language} onChange={setLanguage} label={copy.language} />
        </div>
      </header>

      <main className="relative z-10">
        <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 180, damping: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0.96 }} animate={{ opacity: 1 }} exit={{ opacity: 0.96 }}>
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {showingLanding ? (
                  <LandingPage copy={copy} onStart={() => setPage("platform")} />
                ) : (
                  <PlatformPage copy={copy} language={language} onBackHome={() => setPage("landing")} />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </MotionConfig>
      </main>
    </div>
  );
}
