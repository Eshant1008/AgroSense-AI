import { motion } from "framer-motion";
import { Leaf, Sparkles, Waves } from "lucide-react";

export default function LandingPage({ copy, onStart }) {
  return (
    <motion.section
      className="relative mx-auto flex min-h-[calc(100vh-98px)] w-full max-w-[1400px] items-center px-4 py-10 md:px-8"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute left-[-80px] top-24 h-56 w-56 rounded-full bg-emerald-400/25 blur-3xl" />
      <div className="absolute bottom-10 right-[-80px] h-60 w-60 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-white/70 px-5 py-2.5 text-base font-medium text-emerald-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Leaf className="h-5 w-5 text-emerald-700" />
            {copy.brand}
          </motion.div>

          <motion.h1
            className="text-5xl font-extrabold leading-tight text-slate-900 md:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
          >
            {copy.heroTitle}
          </motion.h1>

          <motion.p
            className="max-w-2xl text-lg leading-relaxed text-slate-700 md:text-2xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.6 }}
          >
            {copy.heroSubtitle}
          </motion.p>

          <motion.button
            type="button"
            onClick={onStart}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500 px-10 py-6 text-xl font-semibold text-white shadow-[0_14px_34px_rgba(5,150,105,0.36)] md:text-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
          >
            <span className="relative z-10">{copy.heroCta}</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
          </motion.button>

          <p className="flex items-center gap-2 text-base text-slate-600 md:text-lg">
            <Sparkles className="h-5 w-5 text-amber-500" /> {copy.heroTrust}
          </p>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-lg rounded-[30px] border border-white/50 bg-white/55 p-7 backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          <motion.div
            className="absolute -left-5 top-10 rounded-xl bg-white/85 px-4 py-2 text-sm font-medium text-emerald-700"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <Waves className="mr-1 inline h-4 w-4" /> Smart Crop Care
          </motion.div>

          <motion.div
            className="absolute -right-6 bottom-12 rounded-xl bg-white/85 px-4 py-2 text-sm font-medium text-amber-700"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            AI Disease Alert
          </motion.div>

          <div className="h-72 rounded-2xl bg-gradient-to-b from-emerald-100 to-emerald-50 p-4">
            <div className="relative h-full overflow-hidden rounded-xl border border-emerald-200/70 bg-white/60">
              <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(16,185,129,0.20),transparent_45%)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
